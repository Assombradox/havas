
// Basic fetch wrapper since we didn't find a centralized api instance
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface StoreConfig {
    logoUrl?: string;
    primaryColor?: string;
    storeName?: string;
    emailTitle?: string;
    emailMessage?: string;
    emailFooter?: string;
    utmifyToken?: string;
    utmifyActive?: boolean;
}

export const configService = {
    getPublicConfig: async (): Promise<StoreConfig> => {
        try {
            const response = await fetch(`${API_URL}/api/config`);
            if (!response.ok) throw new Error('Failed to fetch config');
            return await response.json();
        } catch (error) {
            console.error('Config Service Error:', error);
            throw error;
        }
    },

    updateConfig: async (data: Partial<StoreConfig>): Promise<StoreConfig> => {
        try {
            const response = await fetch(`${API_URL}/api/config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Add Authorization header if you have admin auth token stored
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Failed to update config');
            return await response.json();
        } catch (error) {
            console.error('Config Service Update Error:', error);
            throw error;
        }
    },

    // Aliases requested by the prompt, mapping to the same endpoints relative to current implementation
    getUtmifyConfig: async () => {
        return configService.getPublicConfig();
    },

    updateUtmifyConfig: async (data: { token: string, active: boolean }) => {
        return configService.updateConfig({
            utmifyToken: data.token,
            utmifyActive: data.active
        });
    }
};
