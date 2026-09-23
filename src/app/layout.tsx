import type { Metadata } from 'next';
import '@/styles/tokens.css';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ServiceProvider } from '@/context/ServiceContext';
import { WatchlistProvider } from '@/context/WatchlistContext';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeScript } from '@/components/layout/ThemeScript';

export const metadata: Metadata = {
  title: {
    default: 'Universal Streamer',
    template: '%s · Universal Streamer',
  },
  description:
    'Discover where to watch movies and TV shows across the streaming services you actually subscribe to.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-bg text-text-primary antialiased">
        <ThemeProvider>
          <SettingsProvider>
            <ServiceProvider>
              <WatchlistProvider>
                <ToastProvider>
                  <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:border focus:border-border focus:bg-bg-elevated focus:px-4 focus:py-2 focus:text-sm"
                  >
                    Skip to content
                  </a>
                  <Header />
                  <main
                    id="main"
                    className="mx-auto w-full max-w-[1400px] px-4 py-4"
                  >
                    {children}
                  </main>
                  <Footer />
                </ToastProvider>
              </WatchlistProvider>
            </ServiceProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
