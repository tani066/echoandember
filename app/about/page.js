import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, Sparkles, Users } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-20 bg-pink-50 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl -translate-y-12 translate-x-12" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="text-primary font-medium tracking-widest text-xs uppercase mb-4 block">Our Story</span>
                    <h1 className="text-4xl md:text-6xl font-bold font-serif text-gray-900 mb-6">
                        Where Little Details , <br /> <span className="text-primary">Hold Big Emotions</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        We believe it’s the little details that carry the biggest emotions. Every idea, every touch, and every moment we create is thoughtfully crafted to tell a story that feels personal, meaningful, and timeless. Because when details are done right, they don’t just look beautiful—they make you feel something.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto text-primary">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold">Made with Love</h3>
                            <p className="text-muted-foreground">Every piece is handcrafted with attention to detail and a whole lot of love.</p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-600">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold">Quality First</h3>
                            <p className="text-muted-foreground">Crafted with uncompromising quality, so every gift feels truly special.</p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
                                <Users className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold">Community</h3>
                            <p className="text-muted-foreground">We are more than a brand; we are a community creating meaningful gifts that celebrate every single moment.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team/Story Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        {/* Placeholder for an image */}
                        <div className="aspect-video bg-gray-200 rounded-2xl w-full">
                            <Image src="/about3.jpeg" alt="about"  width={700} height={700}/>   
                        </div>
                    </div>
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl font-bold font-serif">A Note from the Founder</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            "Echo & Ember was created with a simple vision—to make gifting more meaningful. We believe a great gift is defined by thoughtful design, premium quality, and the emotions it carries. Every product is crafted with attention to detail, ensuring it feels special no matter the occasion or age. Our goal is to create gifts that are timeless, versatile, and truly memorable. Thank you for choosing Echo & Ember to be a part of your special moments."
                        </p>
                        <div>
                            <p className="font-semibold text-lg">Pari Agrawal</p>
                            <p className="text-sm text-muted-foreground">Founder & Creator</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to find something special?</h2>
                <Link href="/">
                    <Button size="lg" className="rounded-full px-8">Start Shopping</Button>
                </Link>
            </section>
        </main>
    )
}
