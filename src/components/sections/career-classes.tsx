'use client';

import { GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimateOnScroll } from '@/components/animate-on-scroll';
import { Button } from '@/components/ui/button';

export function CareerClasses() {
  return (
    <section id="classes" className="w-full py-20 lg:py-32 bg-slate-900/20">
      <AnimateOnScroll className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
             <GraduationCap className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            Career Online Classes
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-foreground/80 md:text-xl">
            In-depth web development training and personalized mentoring to help you launch or advance your career in tech.
          </p>
           <div className="mt-8">
            <Button asChild size="lg">
              <Link href="#contact">Join Classes</Link>
            </Button>
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
