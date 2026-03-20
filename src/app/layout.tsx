import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Recovo — Polish Returns Hub for European Brands',
  description:
    'Stop paying €30+ per cross-border return. Recovo receives, inspects, grades and recovers value from your Polish returns within 48 hours.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Recovo Inspect',
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
        <meta name="theme-color" content="#0F0F0F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Recovo Inspect" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>{children}</body>
    </html>
  )
}
