"use client"

import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet"
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function CartDrawer() {
    const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, total } = useCart()

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="flex flex-col w-full sm:max-w-md bg-white">
                <SheetHeader className="border-b pb-4">
                    <SheetTitle className="flex items-center gap-2 text-xl font-serif text-foreground">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        Your Sparkle Basket
                    </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center p-8">
                        <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag className="w-16 h-16 text-pink-200" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Your basket is empty!</h3>
                        <p className="text-muted-foreground">Time to fill it with some magical treasures.</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setIsOpen(false)}
                        >
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto py-6 -mx-6 px-6 space-y-6">
                        {items.map((item) => (
                            <div key={item.cartId} className="flex gap-4">
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-pink-100 bg-pink-50 flex-shrink-0">
                                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-foreground line-clamp-1">{item.title}</h4>
                                            <p className="text-xs text-muted-foreground">{item.category}</p>
                                            {/* Display Options */}
                                            {item.options && Object.keys(item.options).length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {Object.entries(item.options).map(([key, val]) => (
                                                        <span key={key} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                                                            {key}: {val}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.cartId)}
                                            className="text-muted-foreground hover:text-red-400 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1">
                                            <button
                                                className="w-6 h-6 rounded-full flex items-center justify-center bg-white shadow hover:bg-gray-100 text-xs"
                                                onClick={() => updateQuantity(item.cartId, -1)}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <button
                                                className="w-6 h-6 rounded-full flex items-center justify-center bg-white shadow hover:bg-gray-100 text-xs"
                                                onClick={() => updateQuantity(item.cartId, 1)}
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <span className="font-semibold text-primary">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {items.length > 0 && (
                    <SheetFooter className="border-t pt-6 bg-white space-y-4">
                        <div className="w-full space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-semibold">₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Link href="/checkout" onClick={() => setIsOpen(false)}>
                                <Button className="w-full rounded-full h-12 text-lg shadow-lg hover:shadow-primary/20">
                                    Checkout Securely
                                </Button>
                            </Link>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}
