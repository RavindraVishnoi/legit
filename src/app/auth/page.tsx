
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Image from 'next/image'; // Using next/image

// Simple inline SVG for Google icon
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5">
    <path fill="#4285F4" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.42C19,4.42 16.59,2.18 12.19,2.18C6.42,2.18 2.03,6.8 2.03,12C2.03,17.05 6.16,21.82 12.19,21.82C17.6,21.82 21.5,18.33 21.5,12.33C21.5,11.76 21.35,11.1 21.35,11.1Z"/>
  </svg>
);


export default function AuthPage() {
  const { currentUser, signInWithGoogle, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && currentUser) {
      router.push('/');
    }
  }, [currentUser, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // If user is already logged in (e.g. navigated back), redirect them.
  // This is a fallback, useEffect should handle it first.
  if (currentUser) {
     return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-sm rounded-xl border-border/50 shadow-2xl overflow-hidden">
        <CardHeader className="bg-card p-6 text-center">
           <div className="mx-auto mb-6 h-20 w-20">
             <Image src="https://placehold.co/100x100.png" alt="LEGIT Logo" width={100} height={100} className="rounded-full" data-ai-hint="scale justice" />
           </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">
            Welcome to LEGIT
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Your AI Legal Query Assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Button
            onClick={signInWithGoogle}
            className="w-full text-base py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            size="lg"
            variant="outline"
            disabled={authLoading}
          >
            <GoogleIcon />
            Sign In with Google
          </Button>
          {/* You can add more sign-in options like email/password here */}
        </CardContent>
        <CardFooter className="p-6 bg-muted/30 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center w-full">
                By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
