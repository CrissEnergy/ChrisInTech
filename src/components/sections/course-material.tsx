'use client';

import { BookOpen, Download } from 'lucide-react';
import Link from 'next/link';
import { AnimateOnScroll } from '@/components/animate-on-scroll';
import { Button } from '@/components/ui/button';

export function CourseMaterial() {
  return (
    <section id="course-material" className="w-full py-20 lg:py-32">
      <AnimateOnScroll className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <BookOpen className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            Course Materials & Resources
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-foreground/80 md:text-xl">
            Access exclusive plugins, software, and learning materials to support your design and development journey.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/downloads">
                <Download className="mr-2 h-5 w-5" />
                Go to Downloads
              </Link>
            </Button>
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
