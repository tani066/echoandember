"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function FeaturedCategories({ categories = [] }) {
    return (
        <section id="shop-categories" className="py-24 bg-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-0 w-96 h-96 bg-purple-50 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-20 left-0 w-72 h-72 bg-pink-50 rounded-full blur-3xl -z-10" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4 font-serif">
                            Shop by Category
                        </h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Find the perfect handcrafted treasure for your loved ones, organized by heart-picked collections.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                    {categories.map((cat, i) => (
                        <CategoryCard key={i} category={cat} index={i} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function CategoryCard({ category, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link
                href={`/shop?category=${category.name}`}
                className="group relative block h-64 md:h-80 rounded-[2rem] overflow-hidden cursor-pointer"
            >
                {/* Background & Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} transition-all duration-700 group-hover:scale-105`} />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                {/* Decorative Circle */}
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <motion.span
                        className="text-6xl md:text-7xl mb-6 filter drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                    >
                        {category.emoji}
                    </motion.span>

                    <div className="relative">
                        <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/50 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                            <span className="text-base md:text-lg font-bold text-slate-900 tracking-wide">
                                {category.name}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Arrow Icon that appears on hover */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-slate-900">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
