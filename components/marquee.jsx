"use client"

import { motion } from "framer-motion"

export function Marquee({ text, className, direction = "left", speed = 30 }) {
    // For seamless infinite scroll, we need the animation to go from 0% to -100%
    // This moves the content completely off screen, then loops
    const animate = direction === "left"
        ? { x: [0, "-100%"] }
        : { x: ["-100%", 0] }

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <motion.div
                className="flex whitespace-nowrap gap-12"
                animate={animate}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: speed,
                        ease: "linear"
                    }
                }}
            >
                {/* Repeat the text multiple times for seamless loop */}
                {[...Array(10)].map((_, i) => (
                    <span key={i} className="flex items-center gap-12 text-sm font-bold tracking-widest uppercase">
                        {text}
                        <span className="opacity-30">•</span>
                    </span>
                ))}
            </motion.div>
        </div>
    )
}
