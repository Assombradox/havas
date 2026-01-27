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
    }
};
