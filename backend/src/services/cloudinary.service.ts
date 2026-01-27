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

            // Smart Retry Logic for Shopify Large Images
            // Cloudinary Free tier limit is usually 10MB
            if (msg.includes('File size too large') && (imageUrl.includes('/cdn/shop/') || imageUrl.includes('cdn.shopify.com'))) {
                console.warn('⚠️ File too large. Attempting Smart Retry with resized Shopify image (width=1600)...');
                try {
                    // Check if url already has query params
                    const separator = imageUrl.includes('?') ? '&' : '?';
                    const resizedUrl = `${imageUrl}${separator}width=1600`;

                    const result = await cloudinary.uploader.upload(resizedUrl, {
                        folder: 'havas-products',
                        resource_type: 'image'
                    });
                    return result.secure_url;
                } catch (retryError: any) {
                    console.error('❌ Smart Retry Failed:', retryError);
                    // Fall through to throw friendly error
                }
            }

            if (msg.includes('File size too large')) {
                throw new Error('Imagem muito grande (>10MB). Tente uma menor ou use uma URL do Shopify (que otimizamos automaticamente).');
            }

            throw new Error(`Cloudinary Error: ${msg}`);
        }
    }
};
