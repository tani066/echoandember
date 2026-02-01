"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { Search, ShoppingBag, User, Menu, Sparkles, LogOut, LayoutDashboard, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { useCart } from "@/components/cart-provider"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { BackButton } from "@/components/back-button"

import { Button } from "@/components/ui/button"
import { getSiteSettings } from "@/app/actions"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const { data: session } = useSession()
  const { count, setIsOpen } = useCart()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const [announcement, setAnnouncement] = React.useState("✨ FREE SHIPPING ON ORDERS OVER ₹50 ✨")

  React.useEffect(() => {
    getSiteSettings().then(settings => {
      if (settings?.announcementText) setAnnouncement(settings.announcementText)
    })
  }, [])



  // ...

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-pink-100"
        : "bg-transparent"
        }`}
    >
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-xs font-medium tracking-wide">
        {announcement}
      </div>

      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          <BackButton />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-pink-50">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background border-r-pink-200">
              <nav className="flex flex-col gap-6 mt-10">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-3 pr-8 w-full"
                  />
                  <Search className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </form>
                <Link href="/" className="text-xl font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/shop" className="text-xl font-medium hover:text-primary transition-colors">
                  Shop
                </Link>
                <Link href="/about" className="text-xl font-medium hover:text-primary transition-colors">
                  About Us
                </Link>
                <Link href="/contact" className="text-xl font-medium hover:text-primary transition-colors">
                  Contact
                </Link>
                <Link href="/wishlist" className="text-xl font-medium hover:text-primary transition-colors">
                  Wishlist
                </Link>
                {session && (
                  <Link href="/orders" className="text-xl font-medium hover:text-primary transition-colors">
                    Your Orders
                  </Link>
                )}
                {session?.user?.role === "ADMIN" && (
                  <Link href="/admin" className="text-xl font-medium text-primary hover:text-primary/80 transition-colors">
                    Admin Dashboard
                  </Link>
                )}
                {session ? (
                  <button onClick={() => signOut()} className="text-xl font-medium text-left hover:text-primary transition-colors">
                    Log out
                  </button>
                ) : (
                  <Link href="/auth/signin" className="text-xl font-medium hover:text-primary transition-colors">
                    Sign In
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            {/* <Sparkles className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300" /> */}
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground font-serif">
            Echo<span className="text-primary">&</span>Ember
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/shop">Shop</NavLink>
          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          {session && (
            <NavLink href="/orders">Orders</NavLink>
          )}
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="text-sm font-bold text-primary hover:underline">
              Admin Dashboard
            </Link>
          )}
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center relative mr-[-20px]">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-3 pr-8 py-1.5 h-9 text-sm border rounded-full focus:outline-none focus:border-primary w-[160px] bg-gray-50/50 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute right-3 pointer-events-none" />
        </form>

        {/* Icons */}
        <div className="flex items-center gap-2">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image} alt={session.user.name} />
                    <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <Link href="/orders">
                  <DropdownMenuItem>Your Orders</DropdownMenuItem>
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin">
                    <DropdownMenuItem><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/signin">
              <Button variant="ghost" size="icon" className="hover:bg-pink-50 hover:text-primary transition-colors">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}


          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="hover:bg-pink-50 hover:text-primary transition-colors relative">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-pink-50 hover:text-primary transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white text-[10px] hover:bg-primary/90 animate-bounce-short">
                {count}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
    </Link>
  )
}
