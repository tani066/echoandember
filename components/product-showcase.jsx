"use client"

import { motion } from "framer-motion"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function ProductShowcase({ products }) {
    return (
        <section className="py-24 bg-[#FDFCFB]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-primary font-bold tracking-widest text-xs uppercase bg-pink-50 px-3 py-1 rounded-full">Weekly Best Sellers</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 font-serif">Sparkling Picks</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-pink-300 to-purple-300 mx-auto rounded-full mt-6" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.length === 0 ? (
                        <div className="col-span-full text-center p-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                            <p className="text-lg">No treasures found just yet. Creating magic... ✨</p>
                        </div>
                    ) : products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <ProductCard
                                id={product.id}
                                title={product.title}
                                price={product.price}
                                image={product.image || "/image1.jpeg"}
                                category={product.category}
                                isNew={Date.now() - new Date(product.createdAt).getTime() < 604800000}
                            />
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 text-center"
                >
                    <Link href="/shop">
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full px-10 py-6 border-2 border-slate-200 hover:border-slate-900 text-slate-600 hover:text-white hover:bg-slate-900 transition-all text-lg group"
                        >
                            View All Treasures <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
