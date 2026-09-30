import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AuthModal from '@/components/AuthModal';

export const metadata: Metadata = {
  title: 'The Cozy Skein | Artisanal Yarns & Handknits',
  description: 'Ethically sourced, hand-dyed natural yarns (merino, alpaca, silk) and heirloom hand-knitted beanies, scarves, sweaters, and mittens.',
  keywords: ['yarn', 'hand-dyed yarn', 'knitted sweaters', 'merino wool', 'alpaca', 'beanies', 'knitting accessories'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-cozy-cream text-cozy-charcoal antialiased selection:bg-cozy-terracotta selection:text-white">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <AuthModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
