import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { CATEGORIES } from "@/lib/constants"

// --- Categories ---

export async function getCategoriesData() {
    const count = await prisma.category.count()

    if (count === 0) {
        console.log("Seeding initial categories...")
        await prisma.category.createMany({
            data: CATEGORIES.map(c => ({
                name: c.name,
                emoji: c.emoji,
                color: c.color
            }))
        })
    }

    return await prisma.category.findMany({
        orderBy: { createdAt: 'asc' }
    })
}

// --- Site Settings ---

export async function getSiteSettingsData() {
    const settings = await prisma.siteSettings.findFirst()
    if (!settings) {
        return await prisma.siteSettings.create({
            data: {} // Use defaults
        })
    }
    return settings
}

// --- User Profile ---

export async function getUserProfileData() {
    const session = await auth()
    if (!session?.user) return null

    return await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true, phone: true, address: true }
    })
}
