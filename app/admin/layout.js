import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from "lucide-react"
import { signOut } from "@/auth"

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold font-serif text-foreground">
                            Echo<span className="text-primary">&</span>Ember
                        </span>
                    </Link>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2 block">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <LayoutDashboard className="w-4 h-4" /> Overview
                        </Button>
                    </Link>
                    <Link href="/admin/products">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <Package className="w-4 h-4" /> Products
                        </Button>
                    </Link>
                    <Link href="/admin/orders">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <ShoppingCart className="w-4 h-4" /> Orders
                        </Button>
                    </Link>
                    <Link href="/admin/settings">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <Settings className="w-4 h-4" /> Settings
                        </Button>
                    </Link>
                </nav>

                <div className="p-4 border-t">
                    <form action={async () => {
                        "use server"
                        await signOut({ redirectTo: "/" })
                    }}>
                        <Button variant="outline" className="w-full gap-2 text-red-500 hover:text-red-600 hover:bg-red-50">
                            <LogOut className="w-4 h-4" /> Sign Out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 bg-white border-b flex items-center justify-between px-6 md:hidden">
                    <span className="font-bold">Admin Panel</span>
                    {/* Mobile menu trigger could go here */}
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
