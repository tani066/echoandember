import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { FeaturedCategories } from "@/components/featured-categories"
import { ProductShowcase } from "@/components/product-showcase"
import { Marquee } from "@/components/marquee"
import { getSiteSettings } from "@/app/actions"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' }
  })

  const settings = await getSiteSettings()

  return (
    <main className="min-h-screen bg-[#FDFCFB] font-sans selection:bg-pink-100 selection:text-pink-900">
      <Navbar />
      <Hero />

      {/* Admin-Controlled Banners */}
      {settings.banner1Visible && (
        <Marquee
          text={settings.banner1Text}
          direction="left"
          className="py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white"
        />
      )}

      {settings.banner2Visible && (
        <Marquee
          text={settings.banner2Text}
          direction="right"
          className="py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        />
      )}

      <FeaturedCategories />

      <ProductShowcase products={products} />

      {/* Why Choose Us - Kept simple but fits the new theme */}
      <section className="py-24 bg-white border-t border-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="p-8 rounded-[2.5rem] bg-pink-50/50 hover:bg-pink-50 transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-6 filter drop-shadow-sm">🫶🏻</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 font-serif">Handcrafted with Love</h3>
              <p className="text-slate-500 leading-relaxed">Every piece is made slowly, with attention to detail and a whole lot of soul.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-purple-50/50 hover:bg-purple-50 transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-6 filter drop-shadow-sm">✨</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 font-serif">Personalised Magic</h3>
              <p className="text-slate-500 leading-relaxed">Customized to tell your unique story. A little bit of you, in every gift.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-yellow-50/50 hover:bg-yellow-50 transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-6 filter drop-shadow-sm">💝</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 font-serif">Perfect for Gifting</h3>
              <p className="text-slate-500 leading-relaxed">Beautifully packaged and ready to make someone's day extra special.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
