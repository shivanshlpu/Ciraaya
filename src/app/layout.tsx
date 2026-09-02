import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider } from '@/context/StoreContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'CIRAAYA — Curated Jewellery Collection | Waterproof • Anti-Tarnish • Skin-Safe',
    template: '%s | CIRAAYA',
  },
  description:
    'Discover aesthetic everyday curated jewellery at CIRAAYA. 100% Waterproof, Anti-Tarnish & Skin-Safe necklaces, earrings, rings, and bracelets designed for daily wear.',
  keywords: [
    'curated jewellery',
    'waterproof jewellery',
    'anti-tarnish jewellery',
    'skin safe jewellery',
    'aesthetic rings',
    'daily wear necklaces',
    'statement earrings',
    'CIRAAYA',
    'ciraaya.in',
  ],
  openGraph: {
    type: 'website',
    siteName: 'CIRAAYA',
    title: 'CIRAAYA — Curated Jewellery Collection | Waterproof • Anti-Tarnish • Skin-Safe',
    description:
      'Aesthetic everyday curated jewellery collection. 100% Waterproof, Anti-Tarnish & Skin-Safe.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#18181B] antialiased">
        <ToastProvider>
          <StoreProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <Header />
                  <main className="flex-1 w-full">
                    {children}
                  </main>
                  <Footer />
                  <MobileNav />
                  <WhatsAppFloat />
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </StoreProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
