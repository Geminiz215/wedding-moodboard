import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Wedding of Zahra & Fachri — Soft Romance in Bloom',
  description:
    'Undangan Pernikahan Digital Zahra & Fachri — Sabtu, 14 Juni 2025 di The Grand Santika, Jakarta. Luxury Romantic Editorial & Botanical Stationery Experience.',
  openGraph: {
    title: 'The Wedding of Zahra & Fachri — 14 Juni 2025',
    description:
      'Kami mengundang Bapak/Ibu/Saudara/i untuk berbagi kebahagiaan dan doa restu di hari pernikahan kami. The Grand Santika, Jakarta.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FAF6F0',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        {/* Google Fonts: Playfair Display, Cormorant Garamond, Montserrat, Allura */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Allura&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,600&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="paper-surface cover-locked selection:bg-[#E7B8C4]/50 selection:text-[#3A272B] min-h-screen"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
