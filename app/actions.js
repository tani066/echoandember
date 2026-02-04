"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import cloudinary from "@/lib/cloudinary"
import { redirect } from "next/navigation"

// --- Product Actions ---

// Helper to upload file to Cloudinary
async function uploadToCloudinary(file, folder, resourceType = "image") {
    if (!file || file.name === "undefined" || file.size === 0) return null

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, resource_type: resourceType },
            (error, result) => {
                if (error) reject(error)
                else resolve(result.secure_url)
            }
        )
        uploadStream.end(buffer)
    })
}

// --- Product Actions ---

export async function addProduct(formData) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    const title = formData.get("title")
    const description = formData.get("description")
    const price = parseFloat(formData.get("price"))
    const stock = parseInt(formData.get("stock"))
    const category = formData.get("category")
    const optionsJson = formData.get("options")

    // Parse options
    let options = null
    if (optionsJson) {
        try {
            options = JSON.parse(optionsJson)
        } catch (e) {
            console.error("Error parsing options:", e)
        }
    }

    // Handle Images (Multiple)
    const imageFiles = formData.getAll("images")
    const imageUrls = []

    for (const file of imageFiles) {
        const url = await uploadToCloudinary(file, "echo-ember-products", "image")
        if (url) imageUrls.push(url)
    }

    // Handle Videos (Multiple)
    const videoFiles = formData.getAll("videos")
    const videoUrls = []

    for (const file of videoFiles) {
        const url = await uploadToCloudinary(file, "echo-ember-products-videos", "video")
        if (url) videoUrls.push(url)
    }

    // Default image if none uploaded
    let primaryImage = "/image1.jpeg"
    if (imageUrls.length > 0) {
        primaryImage = imageUrls[0]
    }

    await prisma.product.create({
        data: {
            title,
            description,
            price,
            stock,
            category,
            image: primaryImage, // Keep for backward compatibility
            images: imageUrls,
            videos: videoUrls,
            options: options || undefined,
        },
    })

    revalidatePath("/admin/products")
    revalidatePath("/")
    redirect("/admin/products")
}

export async function deleteProduct(id) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    await prisma.product.delete({
        where: { id },
    })

    revalidatePath("/admin/products")
    revalidatePath("/")
    revalidatePath("/admin/products")
    revalidatePath("/")
}

// Helper to delete file from Cloudinary 
// We need to import it. Since `deleteFromCloudinary` is a named export now.
// However, `lib/cloudinary.js` exports default `cloudinary` and named `deleteFromCloudinary`.
// We need to update the import at the top of this file first. But since we are in `replace_file_content` for `updateProduct`...
// I should have updated the import first. 
// I will use a separate `replace_file_content` for layout imports or just use the existing one if I can.
// Actually, I can't change the import lines in this specific call if they are outside lines 114-198.
// I will assume I can update the import in a subsequent step or previous step.
// WAIT, I need to update the import FIRST or concurrently. 
// I'll stick to updating the function logic here and fix the import in another tool call.

export async function updateProduct(id, formData) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    const title = formData.get("title")
    const description = formData.get("description")
    const price = parseFloat(formData.get("price"))
    const stock = parseInt(formData.get("stock"))
    const category = formData.get("category")
    const optionsJson = formData.get("options")

    // Parse Existing Assets (Trusted State from Client)
    const existingImagesJson = formData.get("existingImages")
    const existingVideosJson = formData.get("existingVideos")

    let keptImages = []
    if (existingImagesJson) {
        try { keptImages = JSON.parse(existingImagesJson) } catch (e) { }
    }

    let keptVideos = []
    if (existingVideosJson) {
        try { keptVideos = JSON.parse(existingVideosJson) } catch (e) { }
    }

    // Parse options
    let options = undefined
    if (optionsJson) {
        try {
            options = JSON.parse(optionsJson)
        } catch (e) {
            console.error("Error parsing options:", e)
        }
    }

    const product = await prisma.product.findUnique({ where: { id } })

    // --- DELETION LOGIC ---
    // Identify assets that were in DB but NOT in `keptImages` -> Delete them
    const currentImages = product.images || []
    console.log("DEBUG: Current DB Images:", currentImages)
    console.log("DEBUG: Kept Images from Client:", keptImages)

    const imagesToDelete = currentImages.filter(url => !keptImages.includes(url))
    console.log("DEBUG: Images to Delete:", imagesToDelete)

    //We need to import deleteFromCloudinary. I will do it in next step.
    const { deleteFromCloudinary } = await import("@/lib/cloudinary")

    for (const url of imagesToDelete) {
        await deleteFromCloudinary(url, "image")
    }

    const currentVideos = product.videos || []
    const videosToDelete = currentVideos.filter(url => !keptVideos.includes(url))

    for (const url of videosToDelete) {
        await deleteFromCloudinary(url, "video")
    }
    // ----------------------

    // Handle NEW Images 
    const imageFiles = formData.getAll("images")
    const newImageUrls = []

    for (const file of imageFiles) {
        const url = await uploadToCloudinary(file, "echo-ember-products", "image")
        if (url) newImageUrls.push(url)
    }

    // Handle NEW Videos
    const videoFiles = formData.getAll("videos")
    const newVideoUrls = []

    for (const file of videoFiles) {
        const url = await uploadToCloudinary(file, "echo-ember-products-videos", "video")
        if (url) newVideoUrls.push(url)
    }

    // Final Lists
    const updatedImages = [...keptImages, ...newImageUrls]
    const updatedVideos = [...keptVideos, ...newVideoUrls]

    // If initial migration had empty images array but had 'image' field, ensure sync
    // Logic: If we deleted everything, it should be empty.

    // Update primary image to be the first one
    const primaryImage = updatedImages.length > 0 ? updatedImages[0] : (product.image && keptImages.includes(product.image) ? product.image : "/image1.jpeg")

    await prisma.product.update({
        where: { id },
        data: {
            title,
            description,
            price,
            stock,
            category,
            image: primaryImage,
            images: updatedImages,
            videos: updatedVideos,
            ...(options !== undefined && { options }),
        },
    })

    revalidatePath("/admin/products")
    revalidatePath("/")
    redirect("/admin/products")
}

// --- Order Actions ---

export async function createOrder(items, shippingDetails) {
    const session = await auth()
    if (!session) {
        throw new Error("You must be signed in to place an order.")
    }

    // Recalculate total on server for security
    let total = 0
    const orderItemsData = []

    for (const item of items) {
        const product = await prisma.product.findUnique({ where: { id: item.id } })
        if (product) {
            // Check stock (Optional but good)
            // if (product.stock < item.quantity) {
            //     throw new Error(`Insufficient stock for ${product.title}`)
            // }

            total += product.price * item.quantity
            orderItemsData.push({
                productId: item.id,
                quantity: item.quantity,
                price: product.price,
                options: item.options || undefined // Save options
            })

            // Decrement Stock
            await prisma.product.update({
                where: { id: item.id },
                data: { stock: { decrement: item.quantity } }
            })
        }
    }

    const order = await prisma.order.create({
        data: {
            userId: session.user.id,
            total: total,
            status: "CONFIRMED", // Simulating immediate payment
            shippingAddress: JSON.stringify(shippingDetails),
            items: {
                create: orderItemsData,
            },
        },
    })

    // Update User Profile with new Address/Phone if missing or changed
    // This satisfies the requirement to "Save them also"
    // We only update if the user provided new info that is non-empty
    const updateData = {}
    if (shippingDetails.phone) updateData.phone = shippingDetails.phone
    if (shippingDetails.address) updateData.address = shippingDetails.address

    // We can assume we want to overwrite or only write if empty. 
    // The request says "save them also", usually implies keeping the latest.
    if (Object.keys(updateData).length > 0) {
        await prisma.user.update({
            where: { id: session.user.id },
            data: updateData
        })
    }

    revalidatePath("/admin/orders")
    return { success: true, orderId: order.id }
}

export async function getUserOrders() {
    const session = await auth()
    if (!session?.user) {
        return []
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
    return orders
}

export async function updateOrderStatus(orderId, newStatus) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    await prisma.order.update({
        where: { id: orderId },
        data: { status: newStatus }
    })

    revalidatePath("/admin/orders")
    revalidatePath(`/admin/orders/${orderId}`)
    revalidatePath("/orders")
}

// --- Review Actions ---

export async function addReview(productId, rating, comment) {
    const session = await auth()
    if (!session?.user) {
        throw new Error("You must be signed in to leave a review.")
    }

    await prisma.review.create({
        data: {
            userId: session.user.id,
            productId,
            rating,
            comment
        }
    })

    revalidatePath(`/products/${productId}`)
}

// --- User Actions ---

export async function updateUserProfile(formData) {
    const session = await auth()
    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    const name = formData.get("name")
    const phone = formData.get("phone")
    const address = formData.get("address")

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name,
            phone,
            address
        }
    })

    revalidatePath("/profile")
    revalidatePath("/profile")
    revalidatePath("/checkout")
}

// --- Site Settings Actions ---

export async function getSiteSettings() {
    const settings = await prisma.siteSettings.findFirst()
    if (!settings) {
        return await prisma.siteSettings.create({
            data: {} // Use defaults
        })
    }
    return settings
}

export async function updateSiteSettings(formData) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    const storeName = formData.get("storeName")
    const supportEmail = formData.get("supportEmail")
    const shippingCost = parseFloat(formData.get("shippingCost"))
    const freeShippingThreshold = parseFloat(formData.get("freeShippingThreshold"))
    const announcementText = formData.get("announcementText")
    const maintenanceMode = formData.get("maintenanceMode") === "on"

    // We assume there's only one record, or we just update the first found/created
    const uniqueSettings = await getSiteSettings()

    await prisma.siteSettings.update({
        where: { id: uniqueSettings.id },
        data: {
            storeName,
            supportEmail,
            shippingCost,
            freeShippingThreshold,
            announcementText,
            maintenanceMode
        }
    })

    revalidatePath("/")
    revalidatePath("/admin/settings")
    revalidatePath("/checkout")
}

export async function getUserProfile() {
    const session = await auth()
    if (!session?.user) return null

    return await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true, phone: true, address: true }
    })
}
