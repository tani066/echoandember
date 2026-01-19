import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers"
import { CartProvider } from "@/components/cart-provider"
import { WishlistProvider } from "@/components/wishlist-provider"
import { CartDrawer } from "@/components/cart-drawer"
import { Toaster } from "@/components/ui/sonner"
import { Footer } from "@/components/footer"
import { BackButton } from "@/components/back-button"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Echo & Ember | Sparkling Boutique",
  description: "Handcrafted accessories for magical moments.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <CartProvider>
            <WishlistProvider>
              {children}
              <CartDrawer />
              <BackButton className="fixed top-24 left-6 z-40 shadow-md border border-pink-100 bg-white/90 backdrop-blur-sm hover:bg-pink-50 text-primary" />
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
