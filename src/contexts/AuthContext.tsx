
'use client';

import type { User } from 'firebase/auth';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, signInWithEmailAndPassword } from 'firebase/auth';
import { app as firebaseApp } from '@/lib/firebase/config';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(firebaseApp);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({ title: "Signed In", description: "Successfully signed in with Google." });
      // Redirect to /chat if on auth page, otherwise stay (or let page handle it)
      if (pathname === '/auth' || pathname === '/') {
        router.push('/chat');
      }
    } catch (error: any) {
      console.error("Error signing in with Google", error);
      toast({ title: "Sign In Failed", description: error.message || "Could not sign in with Google.", variant: "destructive" });
      setLoading(false); 
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Signed In", description: "Successfully signed in with email." });
       // Redirect to /chat if on auth page, otherwise stay (or let page handle it)
      if (pathname === '/auth' || pathname === '/') {
        router.push('/chat');
      }
    } catch (error: any) {
      console.error("Error signing in with email", error);
      let errorMessage = "Could not sign in with email.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({ title: "Sign In Failed", description: errorMessage, variant: "destructive" });
      setLoading(false); 
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      router.push('/'); // Redirect to the new landing page
    } catch (error: any) {
      console.error("Error signing out", error);
      toast({ title: "Sign Out Failed", description: error.message || "Could not sign out.", variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, signInWithGoogle, signInWithEmail, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
