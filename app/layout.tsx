import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { MetaPixel } from '@/components/MetaPixel';
import { BackToTopButton } from '@/components/BackToTopButton';

export const metadata: Metadata = {
  title: 'Rental Passport',
  description: 'Apply once. Rent anywhere.'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MetaPixel />
        {children}
        <BackToTopButton />
      </body>
    </html>
  );
}
