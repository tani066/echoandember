import Link from "next/link"
import { Facebook, Instagram, Twitter, Heart } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-white border-t border-pink-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-primary">Echo & Ember</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Handcrafted bows, tutus, and accessories designed to add a touch of magic to every moment.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Shop</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/shop?category=Bows" className="hover:text-primary transition-colors">Bows</Link></li>
                            <li><Link href="/shop?category=Tutus" className="hover:text-primary transition-colors">Tutus</Link></li>
                            <li><Link href="/shop?category=Crowns" className="hover:text-primary transition-colors">Crowns</Link></li>
                            <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-pink-50 pt-8 text-center text-sm text-muted-foreground">
                    <p className="flex items-center justify-center gap-1">
                        © {new Date().getFullYear()} Echo & Ember. Made with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> for little ones.
                    </p>
                </div>
            </div>
        </footer>
    )
}
