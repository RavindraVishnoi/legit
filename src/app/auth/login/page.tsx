'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const emailLoginSchema = z.object({
  email: z.string().email("Invalid email address.").min(1, "Email is required."),
  password: z.string().min(6, "Password must be at least 6 characters.").min(1, "Password is required."),
});

type EmailLoginInputs = z.infer<typeof emailLoginSchema>;

export default function AuthPage() {
  const { currentUser, signInWithEmail, loading: authLoading } = useAuth();
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
      router.push('/chat');
    }
  }, [currentUser, authLoading, router]);

  const handleEmailLogin: SubmitHandler<EmailLoginInputs> = async (data) => {
    setEmailAuthLoading(true);
    await signInWithEmail(data.email, data.password);
    if (!currentUser) {
      setEmailAuthLoading(false);
    }
  };

  if (authLoading && !emailAuthLoading) {
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
    <div className="relative flex min-h-screen flex-row bg-gradient-to-br from-primary via-accent to-secondary p-4 overflow-hidden">
      <div className="w-1/2 flex items-center justify-center">
        <h1 className="text-[20vw] md:text-[15vw] lg:text-[12vw] font-black bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent select-none tracking-tighter animate-gradient-flow bg-[length:200%_200%]">
          LEGIT.
        </h1>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <Card className="w-full max-w-md rounded-xl border-border/50 shadow-2xl overflow-hidden z-10">
          <CardHeader className="bg-card p-6 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-primary pt-6">
              Access LEGIT
            </CardTitle>
            <CardDescription className="text-muted-foreground pt-1">
              Log in to your account
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailLogin)}>
              <CardContent className="p-6 space-y-6">
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
              </CardContent>
              <CardFooter className="p-6">
                <Button
                  type="submit"
                  className="w-full text-base py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  size="lg"
                  disabled={emailAuthLoading || authLoading}
                >
                  {emailAuthLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                  Log In
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
