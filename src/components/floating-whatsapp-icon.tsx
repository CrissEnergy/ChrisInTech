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
        className="group flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 ease-in-out hover:w-48 hover:rounded-full"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]">
            <Whatsapp className="h-9 w-9" />
        </div>
        <span className="max-w-0 overflow-hidden whitespace-nowrap pr-4 transition-all duration-300 ease-in-out group-hover:max-w-xs">
            Hi, Whatsapp Me
        </span>
      </Link>
    </AnimateOnScroll>
  );
}
