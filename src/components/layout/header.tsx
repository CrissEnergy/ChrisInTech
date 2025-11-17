'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Whatsapp } from '@/components/icons/whatsapp-icon';

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

  return (
    <header className="sticky top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-7xl rounded-2xl border border-black/10 bg-white/50 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="#home" className="text-xl font-bold text-primary">
          Chris In Tech.
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
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b pb-4">
                   <Link href="#home" className="text-xl font-bold text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                    Chris In Tech.
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetClose>
                </div>
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
                    <li>
                      <Link href="https://wa.me/message/RYP5SWAHLLZZD1" target="_blank" className="flex items-center text-lg font-medium text-foreground transition-colors hover:text-primary">
                        <Whatsapp className="mr-2 h-6 w-6" />
                        WhatsApp
                      </Link>
                    </li>
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
