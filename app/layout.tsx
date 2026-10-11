import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { QueryProvider } from './QueryProvider';
import Header from '@/features/common/components/composites/Header';

import './globals.css';
import Footer from '@/features/common/components/composites/Footer';
import { siteUrl } from '@/lib/seo';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#080D1F',
};

export const metadata: Metadata = {
  // A real public origin is configured at deployment; localhost only supports local previews.
  metadataBase: siteUrl ?? new URL('http://localhost:3000'),
  applicationName: 'Kino XII',
  title: {
    default: 'Kino XII | Movies, Showtimes & Tickets',
    template: '%s | Kino XII',
  },
  description:
    'Discover movies, explore showtimes across Kino XII cinemas, choose your seats, and book tickets online.',
  alternates: siteUrl ? { canonical: '/' } : undefined,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Kino XII',
    title: 'Kino XII | Movies, Showtimes & Tickets',
    description:
      'Discover movies, explore showtimes, choose your seats, and book tickets online.',
    url: siteUrl ? '/' : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kino XII | Movies, Showtimes & Tickets',
    description:
      'Discover movies, explore showtimes, choose your seats, and book tickets online.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex flex-col min-h-screen">
        <QueryProvider>
          <Header />

          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
