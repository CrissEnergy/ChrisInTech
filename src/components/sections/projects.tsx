'use client';

import Image from 'next/image';
import Link from 'next/link';
import { collection } from 'firebase/firestore';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimateOnScroll } from '@/components/animate-on-scroll';
import { Skeleton } from '@/components/ui/skeleton';
import type { Project } from '@/lib/mock-data';


export function Projects() {
  const { firestore } = useFirebase();

  const projectsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'projects') : null),
    [firestore]
  );
  const { data: projects, isLoading } = useCollection<Project>(projectsCollection);

  return (
    <section id="projects" className="w-full py-20 lg:py-32">
      <AnimateOnScroll className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            My Projects
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-foreground/80 md:text-xl">
            Here are a few projects I've worked on recently.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <AnimateOnScroll key={index} delay={index * 100}>
                <Card className="flex h-full flex-col overflow-hidden">
                  <CardHeader className="items-center text-center">
                    <Skeleton className="mb-4 h-32 w-32 rounded-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="mt-2 h-4 w-full" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap justify-center gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </CardContent>
                  <CardFooter className="justify-center space-x-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </CardFooter>
                </Card>
              </AnimateOnScroll>
            ))
          ) : projects?.length ? (
            projects.map((project, index) => (
              <AnimateOnScroll key={project.id} delay={index * 100}>
                <Card className="flex h-full flex-col overflow-hidden">
                  <CardHeader className="items-center text-center">
                    <div className="mb-4 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 p-1.5">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        width={128}
                        height={128}
                        className="h-32 w-32 rounded-full object-cover shadow-lg"
                      />
                    </div>
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
                      <Link href={project.liveLink} target="_blank">Live Now</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={project.githubLink} target="_blank">GitHub</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </AnimateOnScroll>
            ))
          ) : (
            <AnimateOnScroll className="md:col-span-2 lg:col-span-3">
              <Card className="flex h-full flex-col items-center justify-center py-12">
                 <CardHeader>
                  <CardTitle>No Projects Yet</CardTitle>
                  <CardDescription>Check back soon, or add a project in the admin dashboard!</CardDescription>
                </CardHeader>
              </Card>
            </AnimateOnScroll>
          )}
        </div>
      </AnimateOnScroll>
    </section>
  );
}
