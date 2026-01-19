"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { toast } from "sonner"
import { Sparkles, CreditCard, Truck } from "lucide-react"

import { createOrder, getUserProfile, getSiteSettings } from "@/app/actions"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()

  const [user, setUser] = useState(null)
  const [settings, setSettings] = useState({
    shippingCost: 0,
    freeShippingThreshold: 50,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getUserProfile().then(setUser)
    getSiteSettings().then((s) => {
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
        toast.success("Order placed successfully ✨", {
          description: `Order #${result.orderId} created`,
        })
        router.push("/")
      } else {
        toast.error("Checkout failed", {
          description: result.error || "Something went wrong",
        })
      }
    } catch (err) {
      toast.error("Checkout failed", {
        description: err.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">
            Add some items before checking out.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50/50">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Sparkles className="text-primary" /> Checkout
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FORM */}
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2">
                <Truck className="w-5 h-5" /> Shipping Information
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input name="firstName" placeholder="First Name" required />
                  <Input name="lastName" placeholder="Last Name" required />
                </div>
                <Input name="email" type="email" placeholder="Email" required />
                <Input name="phone" placeholder="Phone" required />
                <Input name="address" placeholder="Address" required />
                <div className="grid grid-cols-2 gap-4">
                  <Input name="city" placeholder="City" required />
                  <Input name="zip" placeholder="ZIP" required />
                </div>
              </form>
            </CardContent>
          </Card>

          {/* SUMMARY */}
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}× {item.title}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                form="checkout-form"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Place Order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
