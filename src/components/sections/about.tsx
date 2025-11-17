import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AnimateOnScroll } from '@/components/animate-on-scroll';

export function About() {
  const headshot = PlaceHolderImages.find(p => p.id === 'chris-headshot');

  return (
    <section id="about" className="w-full py-20 lg:py-32">
      <AnimateOnScroll className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter text-primary sm:text-4xl md:text-5xl">
              About Me
            </h2>
            <p className="max-w-[600px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              My journey in tech started with a curiosity about how websites work. That curiosity turned into a career where I now get to build them using modern technologies like React, Node.js, and Python. I&apos;m passionate about writing clean, efficient code and solving complex problems.
            </p>
          </div>
          <div className="flex justify-center">
            {headshot && (
              <div className="p-1.5 bg-gradient-to-tr from-primary to-secondary rounded-full">
                <Image
                  src={headshot.imageUrl}
                  alt={headshot.description}
                  data-ai-hint={headshot.imageHint}
                  width={400}
                  height={400}
                  className="rounded-full object-cover shadow-2xl"
                />
              </div>
            )}
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
