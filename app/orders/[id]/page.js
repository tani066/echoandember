import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Clock, Truck, Package, MapPin, CalendarDays, Receipt, XCircle } from "lucide-react"

export default async function OrderDetailPage({ params }) {
    const { id } = await params

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    })

    if (!order) {
        notFound()
    }

    // Tracking Timeline Logic
    const steps = [
        { status: "PENDING", label: "Pending", icon: Clock, description: "Awaiting confirmation" },
        { status: "CONFIRMED", label: "Confirmed", icon: CheckCircle2, description: "Order confirmed" },
        { status: "DISPATCHED", label: "Dispatched", icon: Package, description: "Packed & ready" },
        { status: "ON_THE_WAY", label: "On The Way", icon: Truck, description: "Out for delivery" },
        { status: "DELIVERED", label: "Delivered", icon: MapPin, description: "Arrived" },
        { status: "CANCELLED", label: "Cancelled", icon: XCircle, description: "Order cancelled" }
    ]

    const currentStepIndex = steps.findIndex(step => step.status === order.status)
    const isCancelled = order.status === "CANCELLED"
    // If cancelled, show progress up to where it was (or 0) but mark as cancelled visually? 
    // Actually, widespread practice is to show order as cancelled. 
    // For this specific linear timeline, we'll set active to -1 if cancelled to uncheck everything except maybe a special cancelled step if we added it?
    // User asked to add cancelled TO THE SCALE.

    if (isCancelled) {
        // Special handling: Add Cancelled step at the end for visualization if it's cancelled?
        // Or just let it be handled by logic below.
    }

    const activeStepIndex = isCancelled ? -1 : (currentStepIndex === -1 ? 0 : currentStepIndex)

    let shippingAddress = null
    try {
        if (order.shippingAddress) {
            shippingAddress = JSON.parse(order.shippingAddress)
        }
    } catch (e) { }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href="/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-serif">Order Details</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mt-2 text-sm">
                        <span>Order #{order.id.slice(-8)}</span>
                        <span>•</span>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                {shippingAddress && (
                    <Button variant="outline" className="gap-2">
                        <Receipt className="w-4 h-4" /> Invoice
                    </Button>
                )}
            </div>

            {/* Tracking Steps */}
            <div className="mb-10 py-8 px-4 bg-gray-50/50 rounded-xl border relative overflow-hidden">
                {isCancelled && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">✕</span>
                            </div>
                            <h3 className="text-xl font-bold text-red-600">Order Cancelled</h3>
                            <p className="text-muted-foreground">This order has been cancelled.</p>
                        </div>
                    </div>
                )}

                <div className={`relative flex items-center justify-between w-full max-w-2xl mx-auto ${isCancelled ? 'opacity-20' : ''}`}>
                    {/* Connecting Line */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0" />
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-500 ease-in-out"
                        style={{ width: `${(activeStepIndex / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((step, index) => {
                        const isActive = index <= activeStepIndex
                        const isCurrent = index === activeStepIndex
                        const Icon = step.icon

                        return (
                            <div key={step.status} className="relative z-10 flex flex-col items-center group">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isActive
                                    ? "bg-primary border-primary text-white scale-110"
                                    : "bg-white border-gray-200 text-gray-300"
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="absolute top-14 text-center w-32 -left-11 space-y-1">
                                    <p className={`text-sm font-semibold transition-colors ${isActive ? "text-primary" : "text-gray-400"}`}>
                                        {step.label}
                                    </p>
                                    {isCurrent && (
                                        <p className="text-xs text-muted-foreground animate-in fade-in slide-in-from-top-1">
                                            {step.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Items */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                                                <Package className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{item.product?.title || "Product"}</h4>
                                                <p className="text-sm text-muted-foreground">{item.product?.category}</p>
                                                <p className="text-sm mt-1">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Address & Summary */}
                <div className="space-y-6">
                    {shippingAddress && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <MapPin className="w-4 h-4" /> Shipping Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm space-y-1">
                                    <p className="font-medium">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                                    <p className="text-muted-foreground">{shippingAddress.address}</p>
                                    <p className="text-muted-foreground">{shippingAddress.city}, {shippingAddress.zip}</p>
                                    <p className="text-muted-foreground mt-2 text-xs">{shippingAddress.email}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CalendarDays className="w-4 h-4" /> Order Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Order ID</span>
                                <span className="font-mono text-xs">{order.id}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Status</span>
                                <Badge variant="outline">{order.status}</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Last Updated</span>
                                <span>{new Date(order.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
