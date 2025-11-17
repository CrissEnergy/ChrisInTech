'use client';

import { useEffect, useState } from 'react';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-card py-6">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {year} Chris In Tech. All rights reserved.</p>
      </div>
    </footer>
  );
}
