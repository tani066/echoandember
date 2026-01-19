import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/navbar"
import { ReviewSection } from "@/components/review-section"
import { ProductDetails } from "@/components/product-details"
import { notFound } from "next/navigation"

export default async function ProductPage({ params }) {
    const { id } = await params
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            reviews: {
                include: { user: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!product) return notFound()

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="container mx-auto px-4 py-12">
                <ProductDetails product={product} />

                {/* Reviews */}
                <div className="max-w-4xl mx-auto mt-20">
                    <ReviewSection productId={product.id} reviews={product.reviews} />
                </div>
            </div>
        </main>
    )
}
