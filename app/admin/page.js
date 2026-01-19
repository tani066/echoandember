import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingBag, Users, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

async function getAdminStats() {
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)

    const [
        totalRevenueResult,
        orderCount,
        productCount,
        userCount,
        recentOrders,
        last30DaysOrders,
        topSellingItems,
        topRatedItems
    ] = await Promise.all([
        prisma.order.aggregate({
            _sum: { total: true },
            where: { status: { not: "CANCELLED" } }
        }),
        prisma.order.count(),
        prisma.product.count(),
        prisma.user.count(),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        }),
        // Daily Stats Query
        prisma.order.findMany({
            where: {
                createdAt: { gte: thirtyDaysAgo },
                status: { not: "CANCELLED" }
            },
            select: { createdAt: true, total: true }
        }),
        // Top Selling
        prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5
        }),
        // Top Rated
        prisma.review.groupBy({
            by: ['productId'],
            _avg: { rating: true },
            orderBy: { _avg: { rating: 'desc' } },
            take: 5
        })
    ])

    // Process Daily Stats
    const dailyStats = []
    const statsMap = new Map()

    // Initialize last 30 days
    for (let i = 0; i < 30; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const key = d.toISOString().split('T')[0]
        statsMap.set(key, { date: key, revenue: 0, orders: 0 })
    }

    last30DaysOrders.forEach(order => {
        const key = order.createdAt.toISOString().split('T')[0]
        if (statsMap.has(key)) {
            const stats = statsMap.get(key)
            stats.revenue += order.total
            stats.orders += 1
        }
    })

    const sortedDailyStats = Array.from(statsMap.values()).sort((a, b) => a.date.localeCompare(b.date))

    // Fetch Product Details for Top Selling/Rated
    const topSellingProducts = await prisma.product.findMany({
        where: { id: { in: topSellingItems.map(i => i.productId) } }
    }).then(products => topSellingItems.map(item => ({
        ...products.find(p => p.id === item.productId),
        sold: item._sum.quantity
    })))

    const topRatedProducts = await prisma.product.findMany({
        where: { id: { in: topRatedItems.map(i => i.productId) } }
    }).then(products => topRatedItems.map(item => ({
        ...products.find(p => p.id === item.productId),
        rating: item._avg.rating
    })))

    return {
        totalRevenue: totalRevenueResult._sum.total || 0,
        orderCount,
        productCount,
        userCount,
        recentOrders,
        dailyStats: sortedDailyStats,
        topSellingProducts,
        topRatedProducts
    }
}

export default async function AdminDashboard() {
    const { totalRevenue, orderCount, productCount, userCount, recentOrders, dailyStats, topSellingProducts, topRatedProducts } = await getAdminStats()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <Link href="/admin/settings">
                    <Button variant="outline" className="gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Revenue */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                    </CardContent>
                </Card>

                {/* Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderCount}</div>
                        <p className="text-xs text-muted-foreground">All time orders</p>
                    </CardContent>
                </Card>

                {/* Products */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productCount}</div>
                        <p className="text-xs text-muted-foreground">Products in catalog</p>
                    </CardContent>
                </Card>

                {/* Customers */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount}</div>
                        <p className="text-xs text-muted-foreground">Registered accounts</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Daily Stats (Simple List/Chart Placeholder) */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Daily Overview (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] overflow-y-auto w-full px-4">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2">Date</th>
                                        <th className="px-4 py-2">Orders</th>
                                        <th className="px-4 py-2 text-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...dailyStats].reverse().map((stat) => (
                                        <tr key={stat.date} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-2 font-medium">{new Date(stat.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">{stat.orders}</td>
                                            <td className="px-4 py-2 text-right">₹{stat.revenue.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {topSellingProducts.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No sales yet.</p>
                            ) : (
                                topSellingProducts.map((p) => (
                                    <div key={p.id} className="flex items-center">
                                        <div className="h-9 w-9 relative rounded overflow-hidden border">
                                            <Image src={p.image || "/image1.jpeg"} alt={p.title} fill className="object-cover" />
                                        </div>
                                        <div className="ml-4 space-y-1 flex-1">
                                            <p className="text-sm font-medium leading-none line-clamp-1">{p.title}</p>
                                            <p className="text-xs text-muted-foreground">{p.category}</p>
                                        </div>
                                        <div className="ml-auto font-bold text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">{p.sold} Sold</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentOrders.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No orders yet.</p>
                            ) : (
                                recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center">
                                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                            {order.user?.name ? order.user.name.slice(0, 2).toUpperCase() : 'GU'}
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{order.user?.name || "Guest"}</p>
                                            <p className="text-xs text-muted-foreground">{order.user?.email || "No email"}</p>
                                        </div>
                                        <div className="ml-auto font-medium">+₹{order.total.toFixed(2)}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Top Rated Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {topRatedProducts.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No ratings yet.</p>
                            ) : (
                                topRatedProducts.map((p) => (
                                    <div key={p.id} className="flex items-center">
                                        <div className="h-9 w-9 relative rounded overflow-hidden border">
                                            <Image src={p.image || "/image1.jpeg"} alt={p.title} fill className="object-cover" />
                                        </div>
                                        <div className="ml-4 space-y-1 flex-1">
                                            <p className="text-sm font-medium leading-none line-clamp-1">{p.title}</p>
                                            <div className="flex text-yellow-500 text-xs">
                                                {'★'.repeat(Math.round(p.rating))}
                                            </div>
                                        </div>
                                        <div className="ml-auto font-bold text-sm">{p.rating.toFixed(1)}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

