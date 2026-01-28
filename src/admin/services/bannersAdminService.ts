import type { Banner } from '../../types/Banner';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/banners`;

export const bannersAdminService = {
    getAll: async (): Promise<Banner[]> => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch banners');
        return response.json();
    },

    getPublic: async (location: string): Promise<Banner[]> => {
        const response = await fetch(`${API_URL}/public?location=${location}`);
        if (!response.ok) throw new Error('Failed to fetch public banners');
        return response.json();
    },

    create: async (data: Partial<Banner>): Promise<Banner> => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create banner');
        return response.json();
    },

    update: async (id: string, updates: Partial<Banner>): Promise<Banner> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error('Failed to update banner');
        return response.json();
    },

    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete banner');
    }
};
