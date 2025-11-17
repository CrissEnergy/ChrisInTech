import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { AnimateOnScroll } from '@/components/animate-on-scroll';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 'testimonial-1',
    name: 'Sarah Johnson',
    title: 'CEO, TechCorp',
    quote: "Chris is a developer of the highest caliber. His ability to translate complex requirements into elegant, functional code is remarkable. He was instrumental in the success of our latest project.",
    rating: 5,
  },
  {
    id: 'testimonial-2',
    name: 'Michael Chen',
    title: 'Project Manager, Innovate LLC',
    quote: "Working with Chris was a pleasure. He's a proactive problem-solver, a great communicator, and delivered results that exceeded our expectations. I would highly recommend him.",
    rating: 5,
  },
  {
    id: 'testimonial-3',
    name: 'Emily Rodriguez',
    title: 'Lead Designer, Creative Solutions',
    quote: "Chris has a keen eye for design and user experience. He brought our Figma designs to life with pixel-perfect accuracy and suggested valuable improvements along the way. A true professional.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="w-full bg-transparent py-20 lg:py-32">
      <AnimateOnScroll className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-primary sm:text-4xl md:text-5xl">
            What My Clients Say
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-foreground/80 md:text-xl">
            I pride myself on building not just great software, but great relationships.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const image = PlaceHolderImages.find(p => p.id === testimonial.id);
            return (
              <AnimateOnScroll key={testimonial.id} delay={index * 100}>
                <Card className="flex h-full flex-col">
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={testimonial.name}
                        data-ai-hint={image.imageHint}
                        width={80}
                        height={80}
                        className="mb-4 rounded-full"
                      />
                    )}
                    <p className="mb-4 text-foreground/80 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            );
          })}
        </div>
      </AnimateOnScroll>
    </section>
  );
}
