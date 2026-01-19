import { getUserOrders } from "@/app/actions"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Package, Calendar, MapPin, ChevronRight, Truck } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default async function OrdersPage() {
    const orders = await getUserOrders()

    return (
        <div className="container mx-auto px-4 py-8 min-h-[60vh] max-w-5xl">
            <h1 className="text-3xl font-bold tracking-tight mb-8 font-serif flex items-center gap-2">
                <Package className="h-8 w-8 text-primary" /> Your Orders
            </h1>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-gray-50 text-center">
                    <Package className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900">No orders yet</h3>
                    <p className="text-muted-foreground mt-2 mb-6">You haven't placed any orders yet. Start shopping to find something you love!</p>
                    <Link href="/shop">
                        <Button className="font-semibold">Start Shopping</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => {
                        const firstItem = order.items[0]
                        const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0)

                        return (
                            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="bg-gray-50/50 p-4 flex flex-row items-center justify-between border-b">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground block text-xs uppercase tracking-wider">Order Placed</span>
                                            <span className="font-medium">{new Date(order.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block text-xs uppercase tracking-wider">Total</span>
                                            <span className="font-medium">₹{order.total.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block text-xs uppercase tracking-wider">Order #</span>
                                            <span className="font-mono">{order.id.slice(-8)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant={
                                            order.status === "CONFIRMED" ? "default" :
                                                order.status === "DELIVERED" ? "success" :
                                                    order.status === "DISPATCHED" ? "secondary" : "outline"
                                        } className={order.status === "DELIVERED" ? "bg-green-500 hover:bg-green-600" : ""}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6 items-start">
                                        <div className="bg-gray-100 rounded-md w-24 h-24 flex items-center justify-center flex-shrink-0">
                                            {/* Ideally a product image here */}
                                            <Package className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{firstItem?.product?.title || "Product"}</h3>
                                            <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                                                {firstItem?.product?.description}
                                            </p>
                                            {order.items.length > 1 && (
                                                <p className="text-sm text-primary mt-2 font-medium">
                                                    + {order.items.length - 1} more item{order.items.length - 1 > 1 ? 's' : ''}
                                                </p>
                                            )}
                                        </div>
                                        <div className="hidden md:block">
                                            <Link href={`/orders/${order.id}`}>
                                                <Button variant="outline">View Order</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 bg-gray-50/30 border-t flex justify-between items-center md:hidden">
                                    <Link href={`/orders/${order.id}`} className="w-full">
                                        <Button variant="outline" className="w-full">View Order Details</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
