import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { Search, SlidersHorizontal, ChevronDown, LayoutGrid } from "lucide-react"
import Link from "next/link"

export default async function ShopPage(props) {
    const searchParams = await props.searchParams
    const category = searchParams.category
    const q = searchParams.q || ""
    const sort = searchParams.sort || "newest"

    const where = {
        AND: [
            category ? { category: { equals: category, mode: 'insensitive' } } : {},
            q ? {
                OR: [
                    { title: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } }
                ]
            } : {}
        ]
    }
    let orderBy = { createdAt: 'desc' }
    if (sort === 'price_asc') orderBy = { price: 'asc' }
    if (sort === 'price_desc') orderBy = { price: 'desc' }

    const products = await prisma.product.findMany({ where, orderBy })

    const categories = ['Bows', 'Tutus', 'Crowns', 'Gifts']

    return (
        <main className="min-h-screen bg-[#FDFCFB] text-slate-900 selection:bg-pink-100">
            <Navbar />

            {/* Elegant Header */}
            <div className="pt-10 pb-6 md:pt-16 md:pb-12 border-b border-slate-100 bg-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-center mb-2">
                        {q ? `Search: ${q}` : (category ? category : 'Shop All')}
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-slate-400">
                        <Link href="/" className="hover:text-pink-500 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-slate-900 font-medium">Collection</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Mobile-First Controls */}
                <div className="flex flex-col gap-6 mb-10">
                    
                    {/* Horizontal Scroll Categories - Better for Mobile */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:justify-center">
                        <Link 
                            href={`/shop${q ? `?q=${q}` : ''}`} 
                            className={`px-5 py-2 rounded-full text-sm transition-all border whitespace-nowrap active:scale-95 ${!category ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600'}`}
                        >
                            All Treasures
                        </Link>
                        {['Bows', 'Tutus', 'Crowns', 'Gifts'].map(cat => (
                            <Link
                                key={cat}
                                href={`/shop?category=${cat}${q ? `&q=${q}` : ''}`}
                                className={`px-5 py-2 rounded-full text-sm transition-all border whitespace-nowrap active:scale-95 ${category === cat ? 'bg-pink-500 border-pink-500 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600'}`}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>

                    {/* Toolbar: Stats and Sorting */}
                    <div className="flex items-center justify-between border-y border-slate-100 py-4">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <LayoutGrid size={16} />
                            <span>{products.length} Items</span>
                        </div>

                        {/* Sort - Large touch target for mobile */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 text-sm font-medium bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                                <span>Sort</span>
                                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                            </button>
                            
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all md:block hidden">
                                <Link href={`/shop?${new URLSearchParams({ ...searchParams, sort: 'newest' })}`} className="block px-4 py-2 text-sm hover:bg-slate-50">Newest</Link>
                                <Link href={`/shop?${new URLSearchParams({ ...searchParams, sort: 'price_asc' })}`} className="block px-4 py-2 text-sm hover:bg-slate-50">Price: Low to High</Link>
                                <Link href={`/shop?${new URLSearchParams({ ...searchParams, sort: 'price_desc' })}`} className="block px-4 py-2 text-sm hover:bg-slate-50">Price: High to Low</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid - 2 columns on mobile, 4 on desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
                    {products.map((product) => (
                        <div key={product.id} className="flex flex-col group">
                           <ProductCard
                                id={product.id}
                                title={product.title}
                                price={product.price}
                                image={product.image || "/image1.jpeg"}
                                category={product.category}
                                isNew={Date.now() - new Date(product.createdAt).getTime() < 604800000}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}