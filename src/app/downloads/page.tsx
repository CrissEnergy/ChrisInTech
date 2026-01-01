import { Download } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '@/components/animate-on-scroll';

const courseMaterials = [
  {
    title: 'Essential WordPress Plugins Pack',
    description: 'A curated collection of free and premium plugins to kickstart any WordPress project. Includes SEO, security, and performance tools.',
    downloadLink: '#',
  },
  {
    title: 'Figma UI Kit for Developers',
    description: 'A comprehensive UI kit to bridge the gap between design and development. Includes components, styles, and a ready-to-use design system.',
    downloadLink: '#',
  },
  {
    title: 'VS Code Setup & Extensions',
    description: 'My personal VS Code configuration file and a list of recommended extensions for maximum productivity in web development.',
    downloadLink: '#',
  },
  {
    title: 'Advanced CSS & Sass Snippets',
    description: 'A library of useful and reusable CSS and Sass snippets for creating modern layouts, animations, and effects.',
    downloadLink: '#',
  },
  {
    title: 'React Project Boilerplate',
    description: 'A pre-configured starter template for new React projects, including Next.js, TypeScript, and Tailwind CSS.',
    downloadLink: '#',
  },
  {
    title: 'Local Development Environment Guide',
    description: 'A step-by-step guide to setting up a professional local development environment for PHP and Node.js projects.',
    downloadLink: '#',
  },
];

export default function DownloadsPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-24 sm:py-32">
          <AnimateOnScroll className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl">
                Downloads
              </h1>
              <p className="mx-auto mt-4 max-w-[700px] text-foreground/80 md:text-xl">
                All the resources, tools, and materials you need for your web development courses.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {courseMaterials.map((material, index) => (
                <AnimateOnScroll key={material.title} delay={index * 100}>
                  <Card className="flex h-full flex-col">
                    <CardHeader>
                      <CardTitle>{material.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <CardDescription>{material.description}</CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <a href={material.downloadLink} download>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </AnimateOnScroll>
              ))}
            </div>
          </AnimateOnScroll>
        </section>
      </main>
      <Footer />
    </div>
  );
}
