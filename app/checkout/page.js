
"use client"

import { useState } from "react"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Sparkles, CreditCard, Truck } from "lucide-react"

import { createOrder, getUserProfile, getSiteSettings } from "@/app/actions"
// ...
const [user, setUser] = useState(null)
const [settings, setSettings] = useState({ shippingCost: 0, freeShippingThreshold: 50 })
const router = useRouter()

useEffect(() => {
    getUserProfile().then(setUser)
    getSiteSettings().then(s => {
        if (s) setSettings(s)
    })
}, [])

const handleCheckout = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target)
    const shippingDetails = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        city: formData.get("city"),
        zip: formData.get("zip"),
    }

    try {
        const result = await createOrder(items, shippingDetails)
        if (result.success) {
            clearCart()
            toast.success("Order placed successfully! ✨", {
                description: `Order #${result.orderId} has been created.`,
            })
            router.push("/")
        } else {
            toast.error("Failed to place order", {
                description: result.error || "An unknown error occurred."
            })
        }
    } catch (error) {
        toast.error("Failed to place order", {
            description: error.message
        })
    } finally {
        setIsLoading(false)
    }
}

if (items.length === 0) {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-pink-50">
            <div className="text-center space-y-4">
                <h1 className="text-2xl font-bold">Your cart is empty</h1>
                <p className="text-muted-foreground">Add some items before checking out.</p>
            </div>
        </div>
    )
}

return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50/50">
        <div className="container mx-auto max-w-6xl">
            <h1 className="text-3xl font-bold mb-8 text-center md:text-left flex items-center gap-2">
                <Sparkles className="text-primary" /> Checkout
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Checkout Form */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Truck className="w-5 h-5" /> Shipping Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First name</Label>
                                        <Input id="firstName" name="firstName" required placeholder="Alice" defaultValue={user?.name?.split(' ')[0]} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last name</Label>
                                        <Input id="lastName" name="lastName" required placeholder="Wonderland" defaultValue={user?.name?.split(' ')[1]} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" name="email" type="email" required placeholder="alice@example.com" defaultValue={user?.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" name="phone" type="tel" required placeholder="+91 98765 43210" defaultValue={user?.phone} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" name="address" required placeholder="123 Magic Lane" defaultValue={user?.address} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" name="city" required placeholder="Emerald City" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zip">Zip Code</Label>
                                        <Input id="zip" name="zip" required placeholder="12345" />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 border rounded-lg bg-gray-50 text-sm text-muted-foreground text-center">
                                This is a demo checkout. No payment will be processed.
                            </div>
                            <div className="space-y-2">
                                <Label>Card Number</Label>
                                <Input placeholder="0000 0000 0000 0000" disabled />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Expiry</Label>
                                    <Input placeholder="MM/YY" disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label>CVC</Label>
                                    <Input placeholder="123" disabled />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div>
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 max-h-[300px] overflow-auto pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <div className="flex gap-2">
                                            <span className="font-medium text-foreground">{item.quantity}x</span>
                                            <span className="text-muted-foreground">{item.title}</span>
                                        </div>
                                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <Separator />
                            <div className="space-y-1.5 pt-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    {total >= settings.freeShippingThreshold ? (
                                        <span className="text-green-600 font-medium">Free</span>
                                    ) : (
                                        <span>₹{settings.shippingCost.toFixed(2)}</span>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary">
                                    ₹{(total + (total >= settings.freeShippingThreshold ? 0 : settings.shippingCost)).toFixed(2)}
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                form="checkout-form"
                                className="w-full h-12 text-lg rounded-full shadow-lg shadow-pink-200"
                                disabled={isLoading}
                            >
                                {isLoading ? "Processing..." : `Pay ₹${(total + (total >= settings.freeShippingThreshold ? 0 : settings.shippingCost)).toFixed(2)}`}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    </div>
)
}
