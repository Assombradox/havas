/**
 * Optimizes Cloudinary URLs by injecting transformation parameters.
 * 
 * @param url The source image URL
 * @param width The desired width (default: 400 for thumbnails)
 * @returns The optimized URL or the original if not a Cloudinary asset
 */
export const optimizeImage = (url: string, width: number = 400): string => {
    if (!url) return '';
    url = url.trim(); // Remove whitespace to prevent 400 Bad Request
    if (!url.includes('cloudinary.com')) return url;

    // Check if we already have transformation params
    if (url.includes('/image/upload/f_auto,q_auto')) {
        // If it already has f_auto,q_auto, we might want to just append/update width
        // But for safety/simplicity in this specific task, let's assume we are injecting into raw URLs
        // or replacing existing params if necessary.

        // Simple case: insert/replace width
        return url.replace(/\/image\/upload\/.*?\//, `/image/upload/f_auto,q_auto,w_${width}/`);
    }

    // Standard injection after /upload/
    return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${width}/`);
};
