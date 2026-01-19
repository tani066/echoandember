"use client"

import { useWishlist } from "@/components/wishlist-provider"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist()
    const { addToCart } = useCart()

    const moveAllToCart = () => {
        wishlist.forEach(item => {
            addToCart(item)
        })
        toast.success("All items added to cart! 🛍️")
    }

    return (
        <div className="container mx-auto px-4 py-12 min-h-[60vh] pt-24">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-50 rounded-full">
                        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold font-serif">Your Wishlist</h1>
                        <p className="text-muted-foreground">{wishlist.length} items saved</p>
                    </div>
                </div>
                {wishlist.length > 0 && (
                    <Button
                        onClick={moveAllToCart}
                        className="rounded-full shadow-lg shadow-pink-200"
                    >
                        <ShoppingBag className="w-4 h-4 mr-2" /> Add All to Cart
                    </Button>
                )}
            </div>

            {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50 text-center">
                    <Heart className="h-16 w-16 text-gray-200 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900">Your wishlist is empty</h3>
                    <p className="text-muted-foreground mt-2 mb-6">Save items you love to find them easily later.</p>
                    <Link href="/shop">
                        <Button variant="outline" className="rounded-full">Explore Collection</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((item) => (
                        <div key={item.id} className="group relative bg-white border rounded-2xl p-4 transition-all hover:shadow-xl hover:shadow-pink-100/50">
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4">
                                <Link href={`/products/${item.id}`}>
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </Link>
                                <button
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold text-pink-500 uppercase tracking-wider">{item.category}</p>
                                <Link href={`/products/${item.id}`}>
                                    <h3 className="font-semibold text-slate-900 leading-tight hover:text-primary transition-colors line-clamp-1">{item.title}</h3>
                                </Link>
                                <div className="flex items-center justify-between pt-2">
                                    <span className="font-bold text-lg">₹{item.price.toFixed(2)}</span>
                                    <Button
                                        size="sm"
                                        className="rounded-full h-8 px-4"
                                        onClick={() => {
                                            addToCart(item)
                                            toast.success("moved to cart ✨")
                                        }}
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
