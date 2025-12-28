import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimateOnScroll } from '@/components/animate-on-scroll';
import {
  Briefcase,
  ShoppingCart,
  AppWindow,
  Newspaper,
  Wrench,
  GraduationCap,
} from 'lucide-react';

const services = [
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: 'Business & Portfolio Websites',
    description: 'For companies and professionals seeking a standout online presence.',
  },
  {
    icon: <ShoppingCart className="h-10 w-10 text-primary" />,
    title: 'E-Commerce Stores',
    description: 'Using WordPress WooCommerce or powerful custom-built solutions.',
  },
  {
    icon: <AppWindow className="h-10 w-10 text-primary" />,
    title: 'Web Applications & SaaS',
    description: 'Interactive, database-driven tools to power your business.',
  },
  {
    icon: <Newspaper className="h-10 w-10 text-primary" />,
    title: 'Blogs & Content Platforms',
    description: 'Leveraging WordPress or modern Headless CMS architecture.',
  },
  {
    icon: <Wrench className="h-10 w-10 text-primary" />,
    title: 'Website Maintenance & Updates',
    description: 'Reliable, ongoing support plans to keep your site running smoothly.',
  },
  {
    icon: <GraduationCap className="h-10 w-10 text-primary" />,
    title: 'Career Online Classes',
    description: 'In-depth web development training and personalized mentoring.',
  },
];

export function Services() {
  return (
    <section id="services" className="w-full py-20 lg:py-32">
      <AnimateOnScroll className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            My Services
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-foreground/80 md:text-xl">
            Providing a wide range of web development and design solutions.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <AnimateOnScroll key={service.title} delay={index * 100}>
              <Card className="h-full">
                <CardHeader className="items-center">
                  {service.icon}
                </CardHeader>
                <CardContent className="text-center">
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <p className="mt-2 text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </AnimateOnScroll>
    </section>
  );
}
