import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export async function deleteFromCloudinary(url, resourceType = "image") {
    if (!url) return;

    // Extract public_id from URL
    // Example: https://res.cloudinary.com/demo/image/upload/v1614027763/folder/sample.jpg
    // public_id: folder/sample
    try {
        const regex = /\/v\d+\/(.+)\.\w+$/;
        const match = url.match(regex);
        if (match && match[1]) {
            const publicId = match[1];
            await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        }
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
    }
}

export default cloudinary;
