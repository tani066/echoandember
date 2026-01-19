import { prisma } from "@/lib/prisma"
import { Hero } from "@/components/hero"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Bows', 'Tutus', 'Crowns', 'Gifts'].map((cat, i) => (
              <Link href={`/shop?category=${cat}`} key={i} className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${i === 0 ? 'from-pink-100 to-pink-50' :
                    i === 1 ? 'from-purple-100 to-purple-50' :
                      i === 2 ? 'from-yellow-100 to-yellow-50' :
                        'from-blue-100 to-blue-50'
                  } opacity-100 transition-transform group-hover:scale-110`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <span className="text-6xl mb-4 group-hover:-translate-y-2 transition-transform duration-300 drop-shadow-sm">
                    {i === 0 ? '🎀' : i === 1 ? '👗' : i === 2 ? '👑' : '🎁'}
                  </span>
                  <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors bg-white/50 backdrop-blur-sm px-4 py-1 rounded-full">{cat}</span>
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
