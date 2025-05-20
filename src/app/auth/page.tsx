
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

// Simple inline SVG for Google icon
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5">
    <path fill="#4285F4" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.42C19,4.42 16.59,2.18 12.19,2.18C6.42,2.18 2.03,6.8 2.03,12C2.03,17.05 6.16,21.82 12.19,21.82C17.6,21.82 21.5,18.33 21.5,12.33C21.5,11.76 21.35,11.1 21.35,11.1Z"/>
  </svg>
);

const emailLoginSchema = z.object({
  email: z.string().email("Invalid email address.").min(1, "Email is required."),
  password: z.string().min(6, "Password must be at least 6 characters.").min(1, "Password is required."),
});

type EmailLoginInputs = z.infer<typeof emailLoginSchema>;

export default function AuthPage() {
  const { currentUser, signInWithGoogle, signInWithEmail, loading: authLoading } = useAuth();
  const router = useRouter();
  const [emailAuthLoading, setEmailAuthLoading] = useState(false);

  const form = useForm<EmailLoginInputs>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!authLoading && currentUser) {
      router.push('/');
    }
  }, [currentUser, authLoading, router]);

  const handleEmailLogin: SubmitHandler<EmailLoginInputs> = async (data) => {
    setEmailAuthLoading(true);
    await signInWithEmail(data.email, data.password);
    // setLoading(false) will be handled by the signInWithEmail or onAuthStateChanged
    // To ensure form error states clear up if there was a non-firebase error before:
    if (!currentUser) { // if sign in failed and didn't redirect
        setEmailAuthLoading(false);
    }
  };

  if (authLoading && !emailAuthLoading) { // Show main loader if auth state is changing but not specifically due to email form submit
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (currentUser) {
     return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary via-accent to-secondary p-4 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-[20vw] md:text-[15vw] lg:text-[12vw] font-black text-white/10 select-none tracking-tighter">
          LEGIT.
        </h1>
      </div>
      <Card className="w-full max-w-md rounded-xl border-border/50 shadow-2xl overflow-hidden z-10">
        <CardHeader className="bg-card p-6 text-center">
           {/* Removed Image component from here */}
          <CardTitle className="text-3xl font-bold tracking-tight text-primary pt-6">
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
            variant="secondary" // Changed from outline to secondary
            disabled={authLoading || emailAuthLoading}
          >
            {authLoading && !emailAuthLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GoogleIcon />}
            Sign In with Google
          </Button>
          
          <div className="flex items-center space-x-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailLogin)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} type="email" disabled={emailAuthLoading || authLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" {...field} type="password" disabled={emailAuthLoading || authLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-base py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" size="lg" disabled={emailAuthLoading || authLoading}>
                {emailAuthLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                Sign In with Email
              </Button>
            </form>
          </Form>

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

