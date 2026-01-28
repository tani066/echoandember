"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
    return (
        <section className="relative w-full min-h-[600px] md:h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-pink-50 to-white">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <FloatingElement className="top-[10%] left-[5%] text-primary/20" size={40} delay={0} />
                <FloatingElement className="top-[20%] right-[10%] text-secondary/40" size={60} delay={1} />
                <FloatingElement className="bottom-[15%] left-[15%] text-accent/60" size={30} delay={2} />

                {/* Large Circles */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute top-40 -left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">

                {/* Text Content */}
                <div className="text-center md:text-left space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-pink-100 shadow-sm mb-4">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Handcrafted with Love</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                            Turn Moments into <br />
                            <span className="text-primary relative">
                                Lasting
                                <svg className="absolute -bottom-2 w-full left-0 text-accent opacity-50 -z-10 h-6" viewBox="0 0 100 20" preserveAspectRatio="none">
                                    <path d="M0 15 Q 50 25 100 15" stroke="currentColor" strokeWidth="12" fill="none" />
                                </svg>
                            </span>
                            <br /> Memories
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg text-muted-foreground max-w-lg mx-auto md:mx-0"
                    >
                        Explore Polaroids, 3D Miniature Boxes, Crochet Blooms & Spotify Music Plaques and much more — cute little gifts filled with big love 💕
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start"
                    >
                        <Link href="/shop">
                            <Button size="lg" className="rounded-full px-8 text-lg h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                Shop Now
                            </Button>
                        </Link>
                        <Link href="/#shop-categories">
                            <Button size="lg" variant="outline" className="rounded-full px-8 text-lg h-12 border-primary/20 hover:bg-pink-50 text-foreground group">
                                View Lookbook <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Image Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative hidden md:block"
                >
                    <div className="relative w-full aspect-square max-w-md mx-auto">
                        {/* Main Image Frame */}
                        <div className="absolute inset-0 bg-white p-4 rounded-3xl shadow-xl transform rotate-3 transition-transform hover:rotate-0 duration-500">
                            <div className="w-full h-full bg-pink-100 rounded-2xl overflow-hidden relative">

                                <div className="w-full h-full flex items-center justify-center text-primary/40 bg-pink-50">
                                    {/* <span className="text-sm">Product Image</span> */}
                                    <Image src="/image1.jpeg" alt="Product Image" fill className="object-contain" />
                                </div>
                            </div>
                        </div>

                        {/* Floating Mini Card */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -bottom-8 -left-8 bg-white p-3 rounded-2xl shadow-lg w-48"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">Sparkle Bow</p>
                                    <p className="text-xs text-muted-foreground">$12.00</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

function FloatingElement({ className, size, delay }) {
    return (
        <motion.div
            animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.5, 1, 0.5]
            }}
            transition={{
                duration: 5,
                delay: delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className={`absolute ${className}`}
        >
            <Sparkles style={{ width: size, height: size }} />
        </motion.div>
    )
}
