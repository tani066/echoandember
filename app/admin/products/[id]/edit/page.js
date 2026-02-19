import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProductForm } from "@/components/admin/product-form"
import { getCategories } from "@/app/actions"

export default async function EditProductPage({ params }) {
    const { id } = await params
    const [product, categories] = await Promise.all([
        prisma.product.findUnique({ where: { id } }),
        getCategories()
    ])

    if (!product) {
        notFound()
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
            </div>

            <ProductForm product={product} availableCategories={categories} />
        </div>
    )
}
