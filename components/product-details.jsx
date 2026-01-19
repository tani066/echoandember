"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, Share2, PlayCircle, ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function ProductDetails({ product }) {
    // Media Logic
    const allMedia = [
        ...(product.images && product.images.length > 0 ? product.images : [product.image || "/image1.jpeg"]),
        ...(product.videos || []).map(v => ({ type: 'video', src: v }))
    ]

    const [selectedIndex, setSelectedIndex] = useState(0)
    const activeMedia = allMedia[selectedIndex]

    // Options Logic
    const initialOptions = {}
    if (product.options && Array.isArray(product.options)) {
        product.options.forEach(opt => {
            if (opt.values && opt.values.length > 0) {
                initialOptions[opt.name] = opt.values[0]
            }
        })
    }
    const [selectedOptions, setSelectedOptions] = useState(initialOptions)

    const { addToCart } = useCart()

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
            options: selectedOptions
        })
        toast.success("Added to cart! ✨")
    }

    const { reviews } = product
    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0

    return (
        <div className="grid md:grid-cols-2 gap-12 mb-20">
            {/* Gallery Section */}
            <div className="space-y-4">
                {/* Main Media */}
                <div className="relative aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 flex items-center justify-center">
                    {activeMedia?.type === 'video' ? (
                        <video
                            src={activeMedia.src}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="relative w-full h-full group">
                            <Image
                                src={typeof activeMedia === 'string' ? activeMedia : activeMedia?.src || "/image1.jpeg"}
                                alt={product.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                {allMedia.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {allMedia.map((media, i) => {
                            const isVideo = media?.type === 'video'
                            const src = isVideo ? media.src : media
                            const isSelected = i === selectedIndex

                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedIndex(i)}
                                    className={cn(
                                        "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                                        isSelected ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                                    )}
                                >
                                    {isVideo ? (
                                        <div className="w-full h-full bg-black flex items-center justify-center">
                                            <PlayCircle className="text-white w-8 h-8" />
                                        </div>
                                    ) : (
                                        <Image src={src} alt="Thumbnail" fill className="object-cover" />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-center space-y-8">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-primary tracking-wider uppercase bg-pink-50 px-3 py-1 rounded-full">{product.category}</span>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-50 hover:text-pink-500">
                                <Heart className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-50 hover:text-pink-500">
                                <Share2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 leading-tight">{product.title}</h1>

                    <div className="flex items-center gap-4 mt-4">
                        <span className="text-3xl font-bold text-slate-900">₹{product.price.toFixed(2)}</span>

                        {/* Rating */}
                        <div className="flex items-center gap-1 text-sm bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span key={star} className={`text-lg ${star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                            ))}
                            <span className="text-gray-500 ml-1 font-medium">({reviews.length} reviews)</span>
                        </div>
                    </div>
                </div>

                <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-pink-100 pl-4">
                    {product.description}
                </p>

                {/* Options Selector */}
                {product.options && Array.isArray(product.options) && product.options.length > 0 && (
                    <div className="space-y-6 pt-4 border-t">
                        {product.options.map((option, idx) => (
                            <div key={idx} className="space-y-3">
                                <label className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                                    {option.name}: <span className="text-primary font-medium normal-case">{selectedOptions[option.name]}</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {option.values.map((val) => {
                                        const isSelected = selectedOptions[option.name] === val
                                        return (
                                            <button
                                                key={val}
                                                onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: val }))}
                                                className={cn(
                                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all border-2",
                                                    isSelected
                                                        ? "border-primary bg-primary text-white shadow-md transform scale-105"
                                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                                )}
                                            >
                                                {val}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="pt-8 flex gap-4">
                    <Button size="lg" onClick={handleAddToCart} className="flex-1 rounded-full text-lg h-14 shadow-lg shadow-pink-200 gap-2">
                        <ShoppingCart className="w-5 h-5" /> Add to Cart
                    </Button>
                </div>
            </div>
        </div>
    )
}
