import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface StoreConfig {
    logoUrl?: string;
    primaryColor: string;
    storeName: string;
}

export const configService = {
    getConfig: async () => {
        const response = await axios.get(`${API_URL}/api/config`);
        return response.data;
    },

    updateConfig: async (config: StoreConfig) => {
        const response = await axios.put(`${API_URL}/api/config`, config);
        return response.data;
    },

    sendTestPreview: async (config: StoreConfig) => {
        const response = await axios.post(`${API_URL}/api/config/test-preview`, config);
        return response.data;
    }
};
