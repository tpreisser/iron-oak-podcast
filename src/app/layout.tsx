import type { Metadata, Viewport } from 'next';
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
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
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'The Iron & Oak Podcast',
    title: 'The Iron & Oak Podcast | Faith Forged in Honesty',
    description: 'Two men from the Kansas plains digging into Scripture, doubt, and the questions that matter most.',
    images: [{ url: '/images/iron-oak-logo-new.webp', width: 1200, height: 1200, alt: 'The Iron & Oak Podcast' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Iron & Oak Podcast',
    description: 'Two men from the Kansas plains digging into Scripture, doubt, and the questions that matter most.',
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'The Iron and Oak Podcast',
        url: 'https://theironandoakpodcast.com',
        logo: 'https://theironandoakpodcast.com/images/iron-oak-logo-new.webp',
        sameAs: [],
      },
      {
        '@type': 'WebSite',
        name: 'The Iron and Oak Podcast',
        url: 'https://theironandoakpodcast.com',
        description:
          'Tyler Preisser and Lincoln Myers wrestle with the hardest questions about faith, God, and belief. 12 episodes. 109 questions. Rooted in Scripture. Forged in honesty.',
      },
      {
        '@type': 'PodcastSeries',
        name: 'The Iron and Oak Podcast',
        description:
          'Scripture-centered conversations about doubt and hard questions. Season One: Foundations of the Faith.',
        url: 'https://theironandoakpodcast.com',
        author: [
          {
            '@type': 'Person',
            name: 'Tyler Preisser',
            url: 'https://theironandoakpodcast.com/about',
          },
          {
            '@type': 'Person',
            name: 'Lincoln Myers',
            url: 'https://theironandoakpodcast.com/about',
          },
        ],
      },
    ],
  };

  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${playfair.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EZZ0J4K2RP"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EZZ0J4K2RP');
          `}
        </Script>
        <ThemeProvider>
          <SmoothScrollProvider>
              <ScrollToTop />
              <ForgeIntro />
              <IronSparks />
              {/* Header removed */}
              {/* padding-top compensates for the extra height the header gains from
                  env(safe-area-inset-top) on notched iPhones. Page-level components
                  already handle normal header height (pt-24 etc.) — this only adds
                  the safe area portion on top of that so content is never hidden
                  behind the Dynamic Island / notch. Zero impact on non-notch devices
                  because env() resolves to 0px there. */}
              <main
                className="flex-1"
                style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
              >
                {children}
              </main>
              <Footer />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
