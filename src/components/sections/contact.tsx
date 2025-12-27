'use client';

import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm, type FormState } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '@/components/animate-on-scroll';
import { Label } from '@/components/ui/label';

const socialLinks = [
  { icon: Github, href: '#', 'aria-label': 'GitHub profile' },
  { icon: Linkedin, href: '#', 'aria-label': 'LinkedIn profile' },
  { icon: Twitter, href: '#', 'aria-label': 'Twitter profile' },
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? 'Sending...' : 'Send Message'}
    </Button>
  );
}

export function Contact() {
  const initialState: FormState = { message: '', success: false };
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Uh oh!',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <section id="contact" className="w-full bg-transparent py-20 lg:py-32">
      <AnimateOnScroll className="container mx-auto max-w-3xl px-4 md:px-6">
        <div className="space-y-8 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
              Get In Touch
            </h2>
            <p className="text-foreground/80">
              Have a question or want to work together? Send me a message!
            </p>
          </div>

          <form action={formAction} className="space-y-6 text-left">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your name" required />
                {state.errors?.name && (
                  <p className="text-sm text-destructive">{state.errors.name.join(', ')}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Your email" required />
                 {state.errors?.email && (
                  <p className="text-sm text-destructive">{state.errors.email.join(', ')}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input id="phone" name="phone" type="tel" placeholder="Your phone number" />
               {state.errors?.phone && (
                  <p className="text-sm text-destructive">{state.errors.phone.join(', ')}</p>
                )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="Your message" required />
               {state.errors?.message && (
                  <p className="text-sm text-destructive">{state.errors.message.join(', ')}</p>
                )}
            </div>
            <div className="text-center">
              <SubmitButton />
            </div>
          </form>

          <div className="flex justify-center space-x-4 pt-4">
            {socialLinks.map((link, index) => (
              <Button key={index} variant="outline" size="icon" asChild>
                <Link href={link.href} target="_blank" aria-label={link['aria-label']}>
                  <link.icon className="h-5 w-5" />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
}

    