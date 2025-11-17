'use client';

import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '@/components/animate-on-scroll';

const socialLinks = [
  { icon: Github, href: '#', 'aria-label': 'GitHub profile' },
  { icon: Linkedin, href: '#', 'aria-label': 'LinkedIn profile' },
  { icon: Twitter, href: '#', 'aria-label': 'Twitter profile' },
];

export function Contact() {
  const recipientEmail = 'owusubusiness1@gmail.com';

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
          <div className="text-center">
            <Button asChild size="lg">
              <Link href={`mailto:${recipientEmail}`}>
                Send Message
              </Link>
            </Button>
          </div>

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
