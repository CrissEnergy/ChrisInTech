import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { FloatingWhatsappIcon } from '@/components/floating-whatsapp-icon';

export const metadata: Metadata = {
  title: 'Chris In Tech | Developer Portfolio',
  description: 'Portfolio for Chris In Tech, a developer specializing in creating and maintaining exceptional websites and web applications.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
          <FloatingWhatsappIcon />
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
