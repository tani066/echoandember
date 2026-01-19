import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateUserProfile } from "@/app/actions"
import { redirect } from "next/navigation"
import { Package, User as UserIcon, MapPin, Phone } from "lucide-react"

export default async function ProfilePage() {
    const session = await auth()
    if (!session) redirect("/auth/signin")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            orders: {
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    })

    return (
        <main className="min-h-screen bg-gray-50/50">
            <Navbar />

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold font-serif mb-8">My Account</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sidebar / Profile Card */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center text-3xl font-bold text-primary">
                                    {user.name?.[0]?.toUpperCase() || <UserIcon className="w-10 h-10" />}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{user.name}</h2>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Personal Details Form */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                                <UserIcon className="w-5 h-5 text-primary" /> Personal Details
                            </h2>
                            <form action={updateUserProfile} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" defaultValue={user.name} required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input id="phone" name="phone" className="pl-9" defaultValue={user.phone} placeholder="+1 234 567 890" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Default Shipping Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Textarea
                                            id="address"
                                            name="address"
                                            className="pl-9 min-h-[100px]"
                                            defaultValue={user.address}
                                            placeholder="123 Dreamy Lane, Cloud City..."
                                        />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <Button type="submit">Save Changes</Button>
                                </div>
                            </form>
                        </div>

                        {/* Recent Orders Preview */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Package className="w-5 h-5 text-primary" /> Recent Orders
                                </h2>
                                <a href="/orders" className="text-sm text-primary hover:underline">View All</a>
                            </div>

                            <div className="space-y-4">
                                {user.orders.length === 0 ? (
                                    <p className="text-gray-500 italic">No orders yet.</p>
                                ) : (
                                    user.orders.map(order => (
                                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                                            <div>
                                                <p className="font-semibold">Order #{order.id.slice(-6)}</p>
                                                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">${order.total.toFixed(2)}</p>
                                                <span className={`text-[10px] px-2 py-1 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    )
}
