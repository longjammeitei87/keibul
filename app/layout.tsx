import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { siteConfig } from '@/lib/site-data';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'KEIBUL | Business & Technology Solutions',
    template: '%s | KEIBUL',
  },
  description:
    'KEIBUL helps businesses improve operations, identify growth opportunities and build practical technology solutions.',
  applicationName: 'KEIBUL',
  keywords: [
    'technology consulting',
    'business technology solutions',
    'custom software development',
    'AI automation',
    'business analytics',
    'digital transformation',
  ],
  openGraph: {
    title: 'KEIBUL | Business & Technology Solutions',
    description:
      'KEIBUL helps businesses improve operations, identify growth opportunities and build practical technology solutions.',
    url: siteConfig.url,
    siteName: 'KEIBUL',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KEIBUL | Business & Technology Solutions',
    description:
      'KEIBUL helps businesses improve operations, identify growth opportunities and build practical technology solutions.',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <div className="site-shell">
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <Header />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
