import type { Metadata, Viewport } from 'next';
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ForgeIntro } from '@/components/effects/ForgeIntro';
import { IronSparks } from '@/components/effects/IronSparks';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
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

// Separate viewport export — Next.js 14+ requirement
// viewport-fit=cover enables edge-to-edge on notched devices (iPhone X+)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0F1114',
};

export const metadata: Metadata = {
  title: {
    default: 'The Iron & Oak Podcast | Faith Forged in Honesty',
    template: '%s | Iron & Oak Podcast',
  },
  description: 'Tyler Preisser and Lincoln Myers wrestle with the hardest questions about faith, God, and belief. 12 episodes. 109 questions. Rooted in Scripture. Forged in honesty. A podcast from Hays, Kansas.',
  keywords: ['podcast', 'faith', 'Christianity', 'Bible', 'Scripture', 'theology', 'Iron and Oak', 'Tyler Preisser', 'Lincoln Myers', 'Hays Kansas', 'Christian podcast'],
  authors: [{ name: 'Tyler Preisser' }, { name: 'Lincoln Myers' }],
  creator: 'Iron & Oak Podcast',
  metadataBase: new URL('https://theironandoakpodcast.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'The Iron & Oak Podcast',
    title: 'The Iron & Oak Podcast | Faith Forged in Honesty',
    description: 'Hard questions. Honest faith. No easy answers. Tyler Preisser and Lincoln Myers dig into Scripture, doubt, and the questions most people are afraid to ask.',
    images: [{ url: '/images/iron-oak-logo-new.webp', width: 1200, height: 1200, alt: 'The Iron & Oak Podcast' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Iron & Oak Podcast',
    description: 'Hard questions. Honest faith. No easy answers. Where iron sharpens iron and deep roots hold.',
    images: ['/images/iron-oak-logo-new.webp'],
  },
  robots: {
    index: true,
    follow: true,
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
              <ScrollToTop />
              <ForgeIntro />
              <IronSparks />
              <Header />
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
