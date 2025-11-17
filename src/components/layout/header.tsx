'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Whatsapp } from '@/components/icons/whatsapp-icon';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navItems = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const logo = PlaceHolderImages.find(p => p.id === 'site-logo');

  return (
    <header className="sticky top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-7xl rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="#home" className="flex items-center gap-2 text-xl font-bold text-primary">
          {logo && <Image src={logo.imageUrl} alt={logo.description} width={150} height={40} />}
        </Link>
        <nav className="hidden items-center md:flex">
          <ul className="flex items-center space-x-6">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="ml-6">
             <Button variant="ghost" size="icon" asChild>
                <Link href="https://wa.me/message/RYP5SWAHLLZZD1" target="_blank" aria-label="WhatsApp">
                  <Whatsapp className="h-6 w-6 text-foreground/80 transition-colors hover:text-primary" />
                </Link>
              </Button>
          </div>
        </nav>
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/80 backdrop-blur-xl">
               <SheetHeader className="flex-row items-center justify-between border-b pb-4">
                  <SheetTitle>
                    <Link href="#home" className="text-xl font-bold text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                      {logo && <Image src={logo.imageUrl} alt={logo.description} width={150} height={40} />}
                    </Link>
                  </SheetTitle>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetClose>
                </SheetHeader>
              <div className="flex h-full flex-col">
                <nav className="mt-8">
                  <ul className="flex flex-col items-start space-y-6">
                    {navItems.map((item) => (
                      <li key={item.label}>
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
