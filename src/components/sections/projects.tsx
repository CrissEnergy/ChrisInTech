import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AnimateOnScroll } from '@/components/animate-on-scroll';

const projects = [
  {
    id: 'project-1',
    title: 'E-commerce Platform',
    description: 'A responsive e-commerce site built with React and Node.js, featuring a full-featured shopping cart and payment integration.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    liveLink: '#',
    githubLink: '#',
  },
  {
    id: 'project-2',
    title: 'Data Analytics Dashboard',
    description: 'A web application for visualizing and analyzing complex datasets, built with Vue.js and Python.',
    technologies: ['Vue.js', 'Python', 'SQL'],
    liveLink: '#',
    githubLink: '#',
  },
  {
    id: 'project-3',
    title: 'Company Landing Page',
    description: 'A modern, fast, and SEO-optimized landing page for a tech startup, designed in Figma and built with Next.js.',
    technologies: ['Next.js', 'Figma', 'REST APIs'],
    liveLink: '#',
    githubLink: '#',
  },
];

export function Projects() {
  return (
    <section id="projects" className="w-full py-20 lg:py-32">
      <AnimateOnScroll className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-primary sm:text-4xl md:text-5xl">
            My Projects
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-foreground/80 md:text-xl">
            Here are a few projects I've worked on recently.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => {
            const image = PlaceHolderImages.find(p => p.id === project.id);
            return (
              <AnimateOnScroll key={project.id} delay={index * 100}>
                <Card className="flex h-full flex-col overflow-hidden">
                  <CardHeader className="items-center text-center">
                    {image && (
                      <div className="mb-4 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 p-1.5">
                        <Image
                          src={image.imageUrl}
                          alt={project.title}
                          data-ai-hint={image.imageHint}
                          width={128}
                          height={128}
                          className="h-32 w-32 rounded-full object-cover shadow-lg"
                        />
                      </div>
                    )}
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap justify-center gap-2">
                      {project.technologies.map(tech => (
                        <Badge key={tech} variant="secondary">{tech}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="justify-center space-x-4">
                    <Button asChild>
                      <Link href={project.liveLink} target="_blank">Live Demo</Link>
                    </Button>
                    <Button variant="secondary" asChild>
                      <Link href={project.githubLink} target="_blank">GitHub</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </AnimateOnScroll>
            );
          })}
        </div>
      </AnimateOnScroll>
    </section>
  );
}
