import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { MetaPixel } from '@/components/MetaPixel';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { BackToTopButton } from '@/components/BackToTopButton';

export const metadata: Metadata = {
  title: 'Rental Passport',
  description:
    'Apply once. Rent anywhere. Build one Rental Passport with a $54.99 screening report (credit, criminal, eviction, income and rental history) and share it with unlimited landlords.'
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
        <GoogleAnalytics />
        {children}
        <BackToTopButton />
      </body>
    </html>
  );
}
