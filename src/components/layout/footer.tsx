'use client';

import { useEffect, useState } from 'react';

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-transparent py-6">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {year || new Date().getFullYear()} Chris In Tech. All rights reserved.</p>
      </div>
    </footer>
  );
}
