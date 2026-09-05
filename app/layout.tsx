import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LAST DANCE — Teacher Tribute',
  description: 'Our Final Year. Their Last Bell. Our Tribute.',
  openGraph: {
    title: 'LAST DANCE — Teacher Tribute',
    description: 'An interactive RPG tribute to the teachers who shaped us.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LAST DANCE — Teacher Tribute',
    description: 'An interactive RPG tribute to the teachers who shaped us.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#031326',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
