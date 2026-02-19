"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, Share2, PlayCircle, ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
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
    const [selectedOptions, setSelectedOptions] = useState({})

    // Calculate Price dynamically
    let currentPrice = product.price
    if (product.options && Array.isArray(product.options)) {
        product.options.forEach(opt => {
            const selectedVal = selectedOptions[opt.name]
            if (selectedVal) {
                // Find the value object/string
                const matchedVal = opt.values.find(v => (typeof v === 'string' ? v : v.label) === selectedVal)
                // If it's an object with a specific price, use it
                if (matchedVal && typeof matchedVal === 'object' && matchedVal.price > 0) {
                    currentPrice = matchedVal.price
                }
            }
        })
    }

    const { addToCart } = useCart()
    const { toggleWishlist, isInWishlist } = useWishlist()

    const handleAddToCart = () => {
        // Validation Removed as per request
        addToCart({
            id: product.id,
            title: product.title,
            price: currentPrice,
            image: product.image,
            category: product.category,
            options: selectedOptions
        })
        toast.success("Added to cart! ✨")
    }

    const handleWishlistToggle = () => {
        toggleWishlist({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category
        })
    }

    const handleShare = async () => {
        const shareData = {
            title: product.title,
            text: `Check out ${product.title} on Echo & Ember!`,
            url: window.location.href
        }

        try {
            // Check if Web Share API is supported
            if (navigator.share) {
                await navigator.share(shareData)
                toast.success("Shared successfully! 🎉")
            } else {
                // Fallback: Copy link to clipboard
                await navigator.clipboard.writeText(window.location.href)
                toast.success("Link copied to clipboard! 📋")
            }
        } catch (error) {
            // User cancelled share or clipboard denied
            if (error.name !== 'AbortError') {
                toast.error("Failed to share")
            }
        }
    }

    const { reviews } = product
    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0

    const isLiked = isInWishlist(product.id)

    return (
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-20">
            {/* Gallery Section */}
            {/* ✨ The fix: Added min-w-0 and w-full here to prevent horizontal screen stretch on mobile */}
            <div className="space-y-4 w-full min-w-0">

                {/* Main Media */}
                <div className="relative w-full aspect-[4/5] md:aspect-square bg-slate-50 rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100">
                    {activeMedia?.type === 'video' ? (
                        <video
                            src={activeMedia.src}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <Image
                            src={typeof activeMedia === 'string' ? activeMedia : activeMedia?.src || "/image1.jpeg"}
                            alt={product.title}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain p-2 md:p-0 transition-transform duration-500 md:hover:scale-110"
                        />
                    )}
                </div>

                {/* Thumbnails */}
                {allMedia.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide w-full snap-x">
                        {allMedia.map((media, i) => {
                            const isVideo = media?.type === 'video'
                            const src = isVideo ? media.src : media
                            const isSelected = i === selectedIndex

                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedIndex(i)}
                                    className={cn(
                                        "relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all snap-start",
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
                        <div className="flex flex-wrap gap-2">
                            {(product.categories && product.categories.length > 0 ? product.categories : [product.category]).map((cat, idx) => (
                                <span key={idx} className="text-xs md:text-sm font-bold text-primary tracking-wider uppercase bg-pink-50 px-3 py-1 rounded-full">
                                    {cat}
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleWishlistToggle}
                                className={cn(
                                    "rounded-full transition-all h-8 w-8 md:h-10 md:w-10",
                                    isLiked
                                        ? "bg-pink-50 text-pink-500 hover:bg-pink-100"
                                        : "hover:bg-pink-50 hover:text-pink-500"
                                )}
                            >
                                <Heart className={cn("w-4 h-4 md:w-5 md:h-5", isLiked && "fill-pink-500")} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleShare}
                                className="rounded-full hover:bg-pink-50 hover:text-pink-500 h-8 w-8 md:h-10 md:w-10"
                            >
                                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 leading-tight">{product.title}</h1>

                    <div className="flex items-center gap-4 mt-4">
                        <span className="text-3xl font-bold text-slate-900">₹{currentPrice.toFixed(2)}</span>

                        {product.stock <= 0 && (
                            <span className="bg-red-100 text-red-600 text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Out of Stock
                            </span>
                        )}

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
                                        const label = typeof val === 'string' ? val : val.label
                                        const isSelected = selectedOptions[option.name] === label
                                        const isInStock = typeof val === 'object' ? (val.inStock !== false) : true

                                        return (
                                            <button
                                                key={label}
                                                disabled={!isInStock}
                                                title={!isInStock ? "Out of Stock" : ""}
                                                onClick={() => setSelectedOptions(prev => {
                                                    const newOptions = { ...prev }
                                                    if (prev[option.name] === label) {
                                                        delete newOptions[option.name]
                                                    } else {
                                                        newOptions[option.name] = label
                                                    }
                                                    return newOptions
                                                })}
                                                className={cn(
                                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 relative",
                                                    !isInStock
                                                        ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-100 decoration-slate-400"
                                                        : isSelected
                                                            ? "border-primary bg-primary text-white shadow-md transform scale-105"
                                                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                                )}
                                            >
                                                {label}
                                                {typeof val === 'object' && val.price > 0 && (
                                                    <span className="ml-1 text-xs opacity-80">(₹{val.price})</span>
                                                )}
                                                {!isInStock && (
                                                    <span className="absolute inset-0 flex items-center justify-center">
                                                        <span className="w-full h-0.5 bg-slate-400 rotate-[-12deg]" />
                                                    </span>
                                                )}
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
                    <Button
                        size="lg"
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className={cn(
                            "flex-1 rounded-full text-lg h-14 shadow-lg transition-all gap-2",
                            product.stock <= 0
                                ? "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed hover:bg-slate-200"
                                : "shadow-pink-200"
                        )}
                    >
                        {product.stock <= 0 ? (
                            "Out of Stock"
                        ) : (
                            <>
                                <ShoppingCart className="w-5 h-5" /> Add to Cart
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
