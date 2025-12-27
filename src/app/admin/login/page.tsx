'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'Firebase auth service is not available.' });
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Login Successful', description: 'Redirecting to your dashboard...' });
      router.push('/admin');
    } catch (error: any) {
      handleAuthError(error, 'Sign In Failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'Firebase auth service is not available.' });
      return;
    }
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({ title: 'Sign Up Successful', description: 'Your admin account has been created. Please sign in.' });
      // Clear form for sign-in
      setEmail('');
      setPassword('');
      // Optionally switch to sign-in tab, though user will need to re-enter details.
      // For a better UX, we just show a toast and they can switch and log in.
    } catch (error: any) {
      handleAuthError(error, 'Sign Up Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (error: any, title: string) => {
    let errorMessage = 'An unexpected error occurred.';
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please sign up.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use. Please sign in.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak. Please use at least 6 characters.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        default:
          errorMessage = error.message;
      }
    }
    toast({
      variant: 'destructive',
      title: title,
      description: errorMessage,
    });
  }

  const clearForm = () => {
    setEmail('');
    setPassword('');
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-sm w-full">
        <Tabs defaultValue="signin" className="w-full" onValueChange={clearForm}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <CardHeader>
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription>Enter your credentials to access the project dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email-signin">Email</Label>
                  <Input
                    id="email-signin"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password-signin">Password</Label>
                  <Input
                    id="password-signin"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </TabsContent>

          <TabsContent value="signup">
            <CardHeader>
              <CardTitle className="text-2xl">Admin Sign Up</CardTitle>
              <CardDescription>Create an admin account to manage your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input
                    id="password-signup"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Sign Up'}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
