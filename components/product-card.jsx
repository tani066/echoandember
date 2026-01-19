"use client"

import { Heart, ShoppingCart, Sparkles, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
import { toast } from "sonner"

export function ProductCard({
    id,
    title,
    price,
    image = "/image1.jpeg",
    category = "Accessories",
    isNew = false
}) {
    const { addToCart } = useCart()
    const { toggleWishlist, isInWishlist } = useWishlist()
    const inWishlist = isInWishlist(id)

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart({ id, title, price, image, category })
        toast.success("Added to your collection ✨")
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative bg-white rounded-[2.5rem] p-3 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-transparent hover:border-slate-50"
        >
            {/* Image Section */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-50">
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    {isNew && (
                        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/20">
                            <Sparkles className="w-3 h-3 text-pink-500 fill-pink-500" />
                            <span className="text-[10px] font-bold tracking-tight text-slate-800 uppercase">New</span>
                        </div>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist({ id, title, price, image, category })
                    }}
                    className="absolute top-4 right-4 z-40 h-10 w-10 rounded-full bg-black/5 hover:bg-white transition-all duration-300 flex items-center justify-center group/heart backdrop-blur-sm"
                >
                    <Heart className={`h-5 w-5 transition-colors ${inWishlist ? "text-red-500 fill-red-500" : "text-slate-700 group-hover/heart:text-red-500 group-hover/heart:fill-red-500"}`} />
                </button>

                {/* Main Product Image */}
                <Link href={`/products/${id}`} className="block w-full h-full">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 25vw"
                    />
                </Link>

                {/* Hover Quick Add (Desktop) */}
                <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none md:pointer-events-auto hidden md:flex">
                    <Button
                        onClick={handleAddToCart}
                        className="bg-white/90 backdrop-blur-xl text-slate-900 border-none px-6 py-6 rounded-2xl font-bold shadow-2xl hover:bg-white hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Quick Add to Cart
                    </Button>
                </div>

                {/* Mobile FAB (Permanent) */}
                <div className="absolute bottom-4 right-4 z-30 md:hidden">
                    <button
                        onClick={handleAddToCart}
                        className="h-12 w-12 rounded-full bg-white shadow-xl flex items-center justify-center active:scale-90 transition-transform text-slate-900 border border-slate-100"
                    >
                        <Plus className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="mt-6 px-4 pb-4">
                <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-pink-500 uppercase tracking-widest opacity-80">
                        {category}
                    </span>
                    <Link href={`/products/${id}`}>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-snug hover:text-pink-600 transition-colors">
                            {title}
                        </h3>
                    </Link>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xl font-black text-slate-900">
                            ₹{price.toFixed(2)}
                        </span>

                        {/* Rating Dots */}
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <div
                                    key={s}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${s < 5 ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]' : 'bg-slate-200'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Decorative Slider Dots (Visual Flair like the image) */}
                <div className="flex justify-center gap-1.5 mt-6 opacity-20">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`h-1 rounded-full ${i === 1 ? 'w-4 bg-slate-900' : 'w-1 bg-slate-400'}`} />
                    ))}
                </div>
            </div>
        </motion.div>
    )
}