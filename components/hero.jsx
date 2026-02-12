"use client"

import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Camera, Music, Gift } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

export function Hero() {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect()
        mouseX.set(clientX - left - width / 2)
        mouseY.set(clientY - top - height / 2)
    }

    return (
        <section
            ref={ref}
            onMouseMove={handleMouseMove}
            className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#FDFCFB]"
        >
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-200/30 rounded-full blur-[100px] animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/30 rounded-full blur-[100px] animate-blob animation-delay-2000" />
                <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-yellow-200/30 rounded-full blur-[100px] animate-blob animation-delay-4000" />
            </div>

            {/* Parallax Background Elements */}
            <motion.div style={{ y, opacity }} className="absolute inset-0 pointer-events-none">
                <FloatingElement className="top-[15%] left-[5%]" delay={0}>
                    <Sparkles className="text-yellow-400 w-8 h-8 opacity-50" />
                </FloatingElement>
                <FloatingElement className="top-[25%] right-[10%]" delay={1}>
                    <div className="w-4 h-4 rounded-full bg-pink-400/30" />
                </FloatingElement>
                <FloatingElement className="bottom-[20%] left-[10%]" delay={2}>
                    <div className="w-6 h-6 rounded-full border-2 border-purple-400/30" />
                </FloatingElement>
            </motion.div>

            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* Text Content */}
                <div className="text-center lg:text-left space-y-6 md:space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-pink-100 shadow-sm"
                    >
                        <span className="animate-pulse">💝</span>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Handcrafted with Love</span>
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                        <span className="block overflow-hidden">
                            <motion.span
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="block"
                            >
                                Turn Moments
                            </motion.span>
                        </span>
                        <span className="block overflow-hidden">
                            <motion.span
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="block"
                            >
                                into <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 relative">
                                    Magic
                                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-pink-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                    </svg>
                                </span>
                            </motion.span>
                        </span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed"
                    >
                        Discover our collection of Polaroids, 3D Miniatures, and Spotify Plaques—gifts that speak the language of your heart.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                    >
                        <Link href="/shop" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200 hover:scale-105 transition-all duration-300">
                                Start Gifting
                            </Button>
                        </Link>
                        <Link href="/#shop-categories" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg border-2 hover:bg-white hover:border-pink-200 text-slate-600 group">
                                View Collection <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="pt-4 md:pt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-sm font-medium">500+ Happy Customers</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-sm font-medium">India-wide Shipping</span>
                        </div>
                    </motion.div>
                </div>

                {/* Mobile Hero Image (Static) - Visible only on small screens */}
                <div className="lg:hidden relative w-full aspect-square max-w-sm mx-auto mt-8">
                    <div className="absolute inset-0 bg-white rounded-[2rem] shadow-xl overflow-hidden border-4 border-white transform rotate-3">
                        <Image
                            src="/image2.jpeg"
                            alt="Hero Gift"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Interactive Hero Image (3D) - Visible only on large screens */}
                <div className="relative hidden lg:block perspective-1000">
                    <HeroCard mouseX={mouseX} mouseY={mouseY} />
                </div>
            </div>
        </section>
    )
}

function HeroCard({ mouseX, mouseY }) {
    const rotateX = useTransform(mouseY, [-300, 300], [5, -5])
    const rotateY = useTransform(mouseX, [-300, 300], [-5, 5])

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full max-w-[500px] mx-auto aspect-[4/5]"
        >
            {/* Main Card */}
            <div className="absolute inset-0 bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white">
                <Image
                    src="/image2.jpeg"
                    alt="Hero Gift"
                    fill
                    className="object-cover"
                    priority
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating Elements */}
            <FloatingBadge
                icon={<Camera className="w-5 h-5 text-pink-500" />}
                text="Polaroids"
                className="top-10 -left-10"
                delay={0.5}
            />
            <FloatingBadge
                icon={<Music className="w-5 h-5 text-purple-500" />}
                text="Spotify Plaques"
                className="bottom-20 -right-10"
                delay={0.7}
            />
            <FloatingBadge
                icon={<Gift className="w-5 h-5 text-yellow-500" />}
                text="Miniatures"
                className="bottom-10 -left-5"
                delay={0.9}
            />
        </motion.div>
    )
}

function FloatingBadge({ icon, text, className, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.5, type: "spring" }}
            whileHover={{ scale: 1.1, y: -5 }}
            className={`absolute ${className} bg-white/90 backdrop-blur-md p-3 pr-5 rounded-2xl shadow-xl flex items-center gap-3 border border-white/50`}
        >
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                {icon}
            </div>
            <span className="font-bold text-slate-800 text-sm">{text}</span>
        </motion.div>
    )
}

function FloatingElement({ children, className, delay }) {
    return (
        <motion.div
            animate={{
                y: [0, -15, 0],
            }}
            transition={{
                duration: 3,
                delay: delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className={`absolute ${className}`}
        >
            {children}
        </motion.div>
    )
}
