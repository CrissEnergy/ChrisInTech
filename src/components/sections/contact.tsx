'use client';

import { useEffect, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm, type FormState } from '@/app/actions';
import { AnimateOnScroll } from '@/components/animate-on-scroll';

const contactSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  message: z.string().min(1, { message: 'Message is required.' }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const socialLinks = [
  { icon: Github, href: '#', 'aria-label': 'GitHub profile' },
  { icon: Linkedin, href: '#', 'aria-label': 'LinkedIn profile' },
  { icon: Twitter, href: '#', 'aria-label': 'Twitter profile' },
];

export function Contact() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const initialState: FormState = { message: '', success: false };
  const [state, formAction] = useActionState(submitContactForm, initialState);

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Success!',
        description: state.message,
      });
      form.reset();
    } else if (state.message && state.errors) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, form, toast]);

  return (
    <section id="contact" className="w-full bg-transparent py-20 lg:py-32">
      <AnimateOnScroll className="container mx-auto max-w-3xl px-4 md:px-6">
        <div className="space-y-8 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter text-primary sm:text-4xl md:text-5xl">
              Get In Touch
            </h2>
            <p className="text-foreground/80">
              Have a question or want to work together? Send me a message!
            </p>
          </div>
          <Form {...form}>
            <form action={formAction} className="space-y-4 text-left">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage>{state.errors?.name}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage>{state.errors?.email}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Your message..." {...field} />
                    </FormControl>
                    <FormMessage>{state.errors?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <div className="text-center">
                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
                  {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </Form>

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
