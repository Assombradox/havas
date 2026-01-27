import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const cloudinaryService = {
    /**
     * Uploads an image from a remote URL to Cloudinary
     * @param imageUrl The external URL of the image
     * @returns The secure URL from Cloudinary
     */
    uploadFromUrl: async (imageUrl: string): Promise<string> => {
        try {
            console.log(`Uploading to Cloudinary from: ${imageUrl}`);

            const result = await cloudinary.uploader.upload(imageUrl, {
                folder: 'havas-products', // Organize uploads
                resource_type: 'image'
            });

            return result.secure_url;

        } catch (error: any) {
            console.error('Cloudinary Upload Error Full Object:', error);
            const msg = error.message || error.error?.message || 'Unknown Error';
            throw new Error(`Cloudinary Error: ${msg}`);
        }
    }
};
