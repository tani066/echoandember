import { prisma } from "@/lib/prisma"
import { Hero } from "@/components/hero"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"


import { CATEGORIES } from "@/lib/constants"
export default async function Home() {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' }
  })
  return (
    <main className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <Hero />

      {/* Category Section - Floating Cards */}
      <section id="shop-categories" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Shop by Category
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl text-center">
              Find the perfect handcrafted treasure for your loved ones, organized by heart-picked collections.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {CATEGORIES.map((cat, i) => (
              <Link
                href={`/shop?category=${cat.name}`}
                key={i}
                className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer border border-transparent hover:border-primary/10 transition-all duration-500 hover:-translate-y-2 shadow-sm hover:shadow-2xl"
              >
                {/* Background Gradient Layer */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} transition-transform duration-700 group-hover:scale-110`} />

                {/* Decorative Circle Background */}
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:bg-white/40 transition-colors" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <span className="text-7xl mb-6 transform group-hover:scale-125 transition-transform duration-500 ease-out drop-shadow-md">
                    {cat.emoji}
                  </span>

                  <div className="bg-white/70 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/50 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <span className="text-base md:text-lg font-bold tracking-wide">
                      {cat.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section className="py-24 bg-gradient-to-b from-white to-pink-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <span className="text-primary font-semibold tracking-wider text-sm uppercase">Weekly Best Sellers</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Sparkling Picks</h2>
            <div className="w-24 h-1 bg-primary/20 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.length === 0 ? (
              <div className="col-span-full text-center p-8 text-muted-foreground border-2 border-dashed rounded-xl">
                <p>No products available yet. Admins, please add some!</p>
              </div>
            ) : products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image || "/image1.jpeg"}
                category={product.category}
                isNew={Date.now() - new Date(product.createdAt).getTime() < 604800000} // New if < 7 days
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/shop">
              <Button variant="outline" size="lg" className="rounded-full px-8 border-2 border-primary/20 hover:border-primary text-primary hover:bg-primary hover:text-white transition-all text-lg h-12">
                View All Treasures
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-2xl bg-pink-50/50 hover:bg-pink-50 transition-colors">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2">Handcrafted with Love</h3>
              <p className="text-muted-foreground">Every stitch and sparkle is added by hand to ensure unique quality.</p>
            </div>
            <div className="p-8 rounded-2xl bg-purple-50/50 hover:bg-purple-50 transition-colors">
              <div className="text-4xl mb-4">🦄</div>
              <h3 className="text-xl font-bold mb-2">Unique Designs</h3>
              <p className="text-muted-foreground">Whimsical styles you won't find anywhere else, perfect for your little one.</p>
            </div>
            <div className="p-8 rounded-2xl bg-yellow-50/50 hover:bg-yellow-50 transition-colors">
              <div className="text-4xl mb-4">💝</div>
              <h3 className="text-xl font-bold mb-2">Perfect for Gifting</h3>
              <p className="text-muted-foreground">Beautifully packaged and ready to make someone's day extra special.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
