'use client';

import { Download, ArrowLeft, Plug, Braces, type LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { collection } from 'firebase/firestore';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '@/components/animate-on-scroll';
import { Skeleton } from '@/components/ui/skeleton';

type DownloadableMaterial = {
  id: string;
  title: string;
  description: string;
  downloadLink: string;
  category: 'Software & Tools' | 'WordPress Plugins';
  icon: string;
};

const categoryIcons: { [key: string]: React.ReactElement } = {
  'WordPress Plugins': <Plug className="h-10 w-10 text-primary" />,
  'Software & Tools': <Braces className="h-10 w-10 text-primary" />,
};

export default function DownloadsPage() {
  const router = useRouter();
  const { firestore } = useFirebase();

  const downloadsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'downloadable_materials') : null),
    [firestore]
  );
  const { data: materials, isLoading } = useCollection<DownloadableMaterial>(downloadsCollection);

  const groupedMaterials = useMemo(() => {
    if (!materials) return {};
    return materials.reduce((acc, material) => {
      const category = material.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(material);
      return acc;
    }, {} as { [key: string]: DownloadableMaterial[] });
  }, [materials]);


  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-24 sm:py-32">
          <AnimateOnScroll className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
               <Button variant="ghost" onClick={() => router.back()} className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl">
                Downloads
              </h1>
              <p className="mx-auto mt-4 max-w-[700px] text-foreground/80 md:text-xl">
                All the resources, tools, and materials you need for your web development courses.
              </p>
            </div>
            
            <div className="space-y-16">
               {isLoading ? (
                Array.from({ length: 2 }).map((_, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-8">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-8 w-64" />
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {Array.from({ length: 3 }).map((_, itemIndex) => (
                        <Card key={itemIndex} className="flex h-full flex-col">
                          <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                          </CardHeader>
                          <CardContent className="flex-grow space-y-2">
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-5/6" />
                          </CardContent>
                          <CardFooter>
                            <Skeleton className="h-10 w-full" />
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              ) : Object.keys(groupedMaterials).length > 0 ? (
                 Object.entries(groupedMaterials).map(([category, items], categoryIndex) => (
                  <AnimateOnScroll key={category} delay={categoryIndex * 150}>
                    <div >
                      <div className="mb-8 flex items-center gap-4">
                        {categoryIcons[category]}
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">{category}</h2>
                      </div>
                      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {items.map((material, itemIndex) => (
                          <AnimateOnScroll key={material.id} delay={itemIndex * 100}>
                            <Card className="flex h-full flex-col">
                              <CardHeader>
                                <CardTitle>{material.title}</CardTitle>
                              </CardHeader>
                              <CardContent className="flex-grow">
                                <CardDescription>{material.description}</CardDescription>
                              </CardContent>
                              <CardFooter>
                                <Button asChild className="w-full">
                                  <a href={material.downloadLink} target="_blank" rel="noopener noreferrer" download>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </a>
                                </Button>
                              </CardFooter>
                            </Card>
                          </AnimateOnScroll>
                        ))}
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))
              ) : (
                 <AnimateOnScroll>
                  <Card className="flex flex-col items-center justify-center py-20 text-center">
                    <CardHeader>
                      <CardTitle className="text-2xl">No Materials Available</CardTitle>
                      <CardDescription>
                        Course materials are not yet available. Please check back later or add some in the admin dashboard.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </AnimateOnScroll>
              )}
            </div>

          </AnimateOnScroll>
        </section>
      </main>
      <Footer />
    </div>
  );
}
