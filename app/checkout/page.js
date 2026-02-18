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

import Script from "next/script"
import { createOrder, getUserProfile, getSiteSettings, createRazorpayOrder, verifyPayment } from "@/app/actions"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart, shippingAmount, grandTotal } = useCart()

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

    if (!user) {
      toast.error("You must be signed in to place an order.", {
        action: {
          label: "Sign In",
          onClick: () => router.push("/auth/signin?callbackUrl=/checkout"),
        },
      })
      setIsLoading(false)
      return
    }

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
      // 1. Create Order on Server (Razorpay)
      const orderData = await createRazorpayOrder(items, shippingDetails)

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Echo & Ember",
        description: "Order Payment",
        order_id: orderData.id,
        handler: async function (response) {
          // 2. Verify Payment on Server
          try {
            const verification = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            )

            if (verification.success) {
              // 3. Create Order in DB
              const result = await createOrder(items, shippingDetails, response.razorpay_payment_id)

              if (result.success) {
                clearCart()
                toast.success("Payment successful! Order placed. ✨", {
                  description: `Order #${result.orderId} created`,
                })
                router.push("/")
              } else {
                toast.error("Order creation failed after payment. Please contact support.")
              }
            } else {
              toast.error("Payment verification failed.")
            }
          } catch (err) {
            console.error("Verification Error:", err)
            toast.error("Error verifying payment")
          }
        },
        prefill: {
          name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
          email: shippingDetails.email,
          contact: shippingDetails.phone,
        },
        theme: {
          color: "#ec4899", // Pink-500
        },
      }

      const rzp1 = new window.Razorpay(options)
      rzp1.on("payment.failed", function (response) {
        toast.error(response.error.description)
      })
      rzp1.open()

    } catch (err) {
      toast.error("Checkout failed. Please Sign In", {
        description: err.message,
        action: {
          label: "Sign In",
          onClick: () => router.push("/auth/signin?callbackUrl=/checkout"),
        },
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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
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
                <Input name="email" type="email" placeholder="Email" required defaultValue={user?.email} />
                <Input name="phone" placeholder="Phone" required defaultValue={user?.phone} />
                <Input name="address" placeholder="Address" required defaultValue={user?.address} />
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
                <div key={item.cartId} className="flex flex-col text-sm border-b border-dashed border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between font-medium">
                    <span>{item.quantity}× {item.title}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  {/* Display Options */}
                  {item.options && Object.keys(item.options).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(item.options).map(([key, val]) => (
                        <span key={key} className="text-[10px] text-muted-foreground">
                          {key}: {val}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Separator />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                {shippingAmount === 0 ? (
                  <span className="text-green-600 font-medium">Free</span>
                ) : (
                  <span>₹{shippingAmount.toFixed(2)}</span>
                )}
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                form="checkout-form"
                className="w-full h-12 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Pay Now"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
