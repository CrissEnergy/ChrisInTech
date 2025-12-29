'use client';

import Link from 'next/link';
import { Whatsapp } from '@/components/icons/whatsapp-icon';
import { AnimateOnScroll } from './animate-on-scroll';

export function FloatingWhatsappIcon() {
  return (
    <AnimateOnScroll
      as="div"
      className="fixed bottom-6 right-6 z-50"
      delay={500}
    >
      <Link
        href="https://wa.me/message/RYP5SWAHLLZZD1"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-110"
      >
        <Whatsapp className="h-9 w-9" />
      </Link>
    </AnimateOnScroll>
  );
}
