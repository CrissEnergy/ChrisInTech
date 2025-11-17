import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '@/components/animate-on-scroll';

export function Hero() {
  return (
    <section id="home" className="w-full py-24 sm:py-32 md:py-40 lg:py-48 xl:py-56">
      <div className="container px-4 md:px-6">
        <AnimateOnScroll className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              <span>Hi, I&apos;m Chris. </span>
              <span className="md:block">I build things for the web.</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
              I&apos;m a developer specializing in creating and maintaining exceptional websites and web applications. I focus on creating fast, user-friendly, and visually appealing digital experiences.
            </p>
          </div>
          <div className="flex flex-col gap-4 min-[400px]:flex-row">
            <Button asChild size="lg">
              <Link href="#projects">View My Work</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="#contact">Contact Me</Link>
            </Button>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
