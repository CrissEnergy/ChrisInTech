'use client';

import type { FC, ReactNode } from 'react';
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
  threshold?: number;
}

export const AnimateOnScroll: FC<AnimateOnScrollProps> = ({
  children,
  className,
  as: Tag = 'div',
  delay = 0,
  threshold = 0.1,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};
