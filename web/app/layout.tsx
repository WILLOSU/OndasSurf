/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Metadata, Viewport } from 'next';
import { Inter, Space_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth-provider';
import { Toaster } from 'sonner';
import { GoogleMapsLoader } from '@/components/google-maps-loader';
import './globals.css';

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const _spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
});

export const metadata: Metadata = {
  title: 'Finding Waves - Surf Forecast',
  description:
    'Real-time surf forecast to find the best waves near you. Check swell, wind, and wave conditions for your favorite beaches.',
  generator: 'v0.app',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e8f0f8' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1b2e' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Favicon inline - ondas azuis */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%230ea5e9'/><path d='M25 55 Q 35 45, 45 55 T 65 55 T 75 55' stroke='white' stroke-width='4' fill='none' stroke-linecap='round'/><path d='M28 65 Q 38 55, 48 65 T 68 65 T 72 65' stroke='white' stroke-width='3' fill='none' stroke-linecap='round' opacity='0.7'/></svg>" />
      </head>
      <body className={`${_inter.variable} ${_spaceMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <GoogleMapsLoader
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
            >
              {children}
            </GoogleMapsLoader>
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
