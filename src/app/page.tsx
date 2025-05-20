'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, Scale } from 'lucide-react'; // Import Scale icon

export default function LandingPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && currentUser) {
      router.push('/chat'); // Redirect to chat if already logged in
    }
  }, [currentUser, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If user is not logged in and not loading, show landing page
  if (!currentUser) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-card to-secondary p-6 text-center text-white overflow-hidden">
        {/* Optional: Large background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-[25vw] md:text-[20vw] lg:text-[15vw] font-black text-primary/10 select-none tracking-tighter">
            LEGIT.
          </h1>
        </div>

        <main className="z-10 flex flex-col items-center">
          <Scale className="h-20 w-20 md:h-24 md:w-24 text-primary mb-6" /> {/* Added Scale icon */}
          <h1 className="mb-6 text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            LEGIT.
          </h1>
          <p className="mb-10 max-w-xl text-lg md:text-xl text-foreground/90">
            Your intelligent AI-powered legal assistant. Get answers to your legal queries and summarize complex documents with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/login" passHref>  {/* Updated to /auth/login */}
              <Button size="lg" className="w-full sm:w-auto px-10 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl transition-transform transform hover:scale-105">
                Login
              </Button>
            </Link>
            <Link href="/auth" passHref> {/* For now, sign up also goes to auth page */}
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 py-6 text-lg border-primary text-primary hover:bg-accent/10 hover:text-accent shadow-xl transition-transform transform hover:scale-105">
                Sign Up
              </Button>
            </Link>
          </div>
        </main>
        <footer className="absolute bottom-6 text-sm text-foreground/70 z-10">
          © {new Date().getFullYear()} LEGIT. All rights reserved.
        </footer>
      </div>
    );
  }

  // Fallback for currentUser but not yet redirected (should be brief)
  return (
     <div className="flex h-screen items-center justify-center bg-background">
       <Loader2 className="h-16 w-16 animate-spin text-primary" />
     </div>
   );
}
