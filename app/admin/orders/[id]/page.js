import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AdminOrderStatus } from "@/components/admin-order-status"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, User, MapPin } from "lucide-react"

export default async function AdminOrderDetailPage({ params }) {
    const { id } = await params

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: true,
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

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/orders">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
                    <p className="text-muted-foreground font-mono text-sm">ID: {order.id}</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Order Status Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Status</CardTitle>
                        <CardDescription>Manage the current status of this order</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Current Status:</span>
                                <Badge variant={
                                    order.status === "CONFIRMED" ? "default" :
                                        order.status === "DELIVERED" ? "success" :
                                            order.status === "DISPATCHED" ? "secondary" : "outline"
                                } className={order.status === "DELIVERED" ? "bg-green-500 hover:bg-green-600" : ""}>
                                    {order.status}
                                </Badge>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-sm font-medium">Update Status:</span>
                                <AdminOrderStatus orderId={order.id} currentStatus={order.status} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">{order.user?.name || "Guest User"}</p>
                                <p className="text-sm text-muted-foreground">{order.user?.email}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Shipping Address</p>
                                <p className="text-sm text-muted-foreground">
                                    {(() => {
                                        if (!order.shippingAddress) return "No address provided."
                                        try {
                                            const address = JSON.parse(order.shippingAddress)
                                            return (
                                                <div className="text-sm text-foreground">
                                                    {address.firstName} {address.lastName}<br />
                                                    {address.address}<br />
                                                    {address.city}, {address.zip}<br />
                                                    {address.email}
                                                </div>
                                            )
                                        } catch (e) {
                                            return order.shippingAddress // Fallback for plain text
                                        }
                                    })()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Order Items */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="font-medium">{item.product?.title || "Unknown Product"}</div>
                                        <div className="text-xs text-muted-foreground">ID: {item.productId}</div>
                                    </TableCell>
                                    <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={3} className="text-right font-medium">Grand Total</TableCell>
                                <TableCell className="text-right font-bold text-lg">₹{order.total.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
