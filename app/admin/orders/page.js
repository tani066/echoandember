import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { updateOrderStatus } from "@/app/actions"
import Link from "next/link"

import { OrdersToolbar } from "@/components/admin/orders-toolbar"

export default async function AdminOrders({ searchParams }) {
    const params = await searchParams
    const query = params.q || ""
    const status = params.status || undefined
    const sort = params.sort || "desc"
    const date = params.date || undefined

    // Construct Where Clause
    const where = {}
    if (status && status !== "ALL") {
        where.status = status
    }
    if (date) {
        // Filter by specific date (ignoring time)
        const startDate = new Date(date)
        const endDate = new Date(date)
        endDate.setDate(endDate.getDate() + 1)

        where.createdAt = {
            gte: startDate,
            lt: endDate
        }
    }
    if (query) {
        where.OR = [
            { id: { contains: query, mode: 'insensitive' } },
            { user: { name: { contains: query, mode: 'insensitive' } } },
            { user: { email: { contains: query, mode: 'insensitive' } } },
        ]
    }

    // Construct OrderBy Clause
    let orderBy = { createdAt: 'desc' }
    if (sort === 'asc') orderBy = { createdAt: 'asc' }
    if (sort === 'amount_desc') orderBy = { total: 'desc' }
    if (sort === 'amount_asc') orderBy = { total: 'asc' }

    const orders = await prisma.order.findMany({
        where,
        include: { user: true },
        orderBy
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            </div>

            <OrdersToolbar />

            {/* Filtered Summary */}
            {(query || status || date) && (
                <div className="bg-muted/50 p-4 rounded-lg mb-6 flex gap-8 border">
                    <div>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Orders Found</span>
                        <p className="text-2xl font-bold">{orders.length}</p>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Value</span>
                        <p className="text-2xl font-bold text-primary">₹{orders.reduce((acc, o) => acc + o.total, 0).toFixed(2)}</p>
                    </div>
                </div>
            )}

            <div className="border rounded-lg bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No orders yet.
                                </TableCell>
                            </TableRow>
                        ) : orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium font-mono text-xs">{order.id.slice(-8)}</TableCell>
                                <TableCell>
                                    <div>{order.user?.name || "Guest"}</div>
                                    <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                                    <div className="text-xs text-muted-foreground">{(() => {
                                        try {
                                            const details = JSON.parse(order.shippingAddress || "{}")
                                            return details.phone || order.user?.phone || "No Phone"
                                        } catch (e) { return "No Phone" }
                                    })()}</div>
                                </TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        order.status === "PAID" ? "default" :
                                            order.status === "SHIPPED" ? "secondary" : "outline"
                                    }>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/admin/orders/${order.id}`}>
                                        <Button variant="ghost" size="sm"><Eye className="w-4 h-4 mr-1" /> View</Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
