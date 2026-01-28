const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/upload`;

export const uploadAdminService = {
    uploadFromUrl: async (imageUrl: string): Promise<string> => {
        const response = await fetch(`${API_URL}/from-url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to upload image');
        }

        const data = await response.json();
        return data.url;
    },

    handleCloudinaryUpload: async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                try {
                    const base64 = reader.result as string;
                    // Reuse existing endpoint which handles string URLs (and Data URIs)
                    const url = await uploadAdminService.uploadFromUrl(base64);
                    resolve(url);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = (error) => reject(error);
        });
    }
};
