import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkyBooker - Flight Booking System',
  description: 'Book flights worldwide with our comprehensive flight booking platform',
  generator: 'v0.dev',
  manifest: '/manifest.json',
  keywords: ['flights', 'booking', 'travel', 'airlines', 'tickets'],
  authors: [{ name: 'SkyBooker Team' }],
  creator: 'SkyBooker',
  publisher: 'SkyBooker',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SkyBooker - Flight Booking System',
    description: 'Book flights worldwide with our comprehensive flight booking platform',
    url: 'https://localhost:3000',
    siteName: 'SkyBooker',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkyBooker - Flight Booking System',
    description: 'Book flights worldwide with our comprehensive flight booking platform',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SkyBooker',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SkyBooker" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        <link rel="apple-touch-icon" href="/placeholder-logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/placeholder-logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/placeholder-logo.png" />
        <link rel="mask-icon" href="/placeholder-logo.svg" color="#2563eb" />
        <link rel="shortcut icon" href="/placeholder-logo.png" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://localhost:3000" />
        <meta name="twitter:title" content="SkyBooker - Flight Booking System" />
        <meta name="twitter:description" content="Book flights worldwide with our comprehensive flight booking platform" />
        <meta name="twitter:image" content="https://localhost:3000/placeholder-logo.png" />
        <meta name="twitter:creator" content="@skyBooker" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SkyBooker - Flight Booking System" />
        <meta property="og:description" content="Book flights worldwide with our comprehensive flight booking platform" />
        <meta property="og:site_name" content="SkyBooker" />
        <meta property="og:url" content="https://localhost:3000" />
        <meta property="og:image" content="https://localhost:3000/placeholder-logo.png" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
