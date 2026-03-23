import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';
import { Footer } from '@/components/layout/Footer';
import { ForgeIntro } from '@/components/effects/ForgeIntro';
import { IronSparks } from '@/components/effects/IronSparks';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-accent',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'The Iron & Oak Podcast',
    template: '%s | Iron & Oak',
  },
  description: 'Tyler Preisser and Lincoln Myers wrestle with the hardest questions about faith, God, and belief. Rooted in Scripture. Forged in honesty.',
  metadataBase: new URL('https://ironandoak.fm'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'The Iron & Oak Podcast',
    title: 'The Iron & Oak Podcast',
    description: 'Where iron sharpens iron and deep roots hold.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Iron & Oak Podcast',
    description: 'Where iron sharpens iron and deep roots hold.',
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
      data-theme="dark"
      suppressHydrationWarning
      className={`${playfair.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <SmoothScrollProvider>
              <ForgeIntro />
              <IronSparks />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
