import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting migration from category (String) to categories (String[])...')

    const products = await prisma.product.findMany()

    for (const product of products) {
        if (product.category && (!product.categories || product.categories.length === 0)) {
            console.log(`Migrating product: ${product.title}`)
            await prisma.product.update({
                where: { id: product.id },
                data: {
                    categories: [product.category]
                }
            })
        }
    }

    console.log('Migration complete.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
