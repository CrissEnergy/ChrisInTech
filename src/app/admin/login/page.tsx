'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';

const MAGIC_CODE = '0596352632';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  
  const [magicCode, setMagicCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthError = (error: any, title: string) => {
    toast({
      variant: 'destructive',
      title: title,
      description: error.message || 'An unexpected error occurred.',
    });
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (magicCode !== MAGIC_CODE) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'The magic code is incorrect. Please try again.',
      });
      return;
    }

    if (!auth) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'Firebase auth service is not available.' });
      return;
    }

    setIsLoading(true);
    try {
      // For this magic code system, we'll use anonymous sign-in.
      // In a real-world scenario with multiple admins, you'd associate this
      // anonymous user's UID with an admin role in your database.
      await signInAnonymously(auth);
      toast({ title: 'Login Successful', description: 'Redirecting to your dashboard...' });
      router.push('/admin');
    } catch (error: any) {
      handleAuthError(error, 'Sign In Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your magic code to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="magic-code">Magic Code</Label>
              <Input
                id="magic-code"
                type="password"
                placeholder="••••••••"
                required
                value={magicCode}
                onChange={(e) => setMagicCode(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Enter Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
