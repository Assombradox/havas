
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/orders`;

export interface DashboardOrder {
    _id: string;
    paymentId: string;
    status: 'pending' | 'paid' | 'waiting_payment' | 'failed' | 'shipped' | 'delivered' | 'canceled';
    totalAmount: number;
    customer: {
        name: string;
        email: string;
        phone?: string;
        document?: string;
    } | null;
    items: Array<{
        name?: string;  // New Backend
        title?: string; // Fallback
        quantity: number;
        price?: string | number; // Can be "R$ 50,00" or number
        unitPrice?: number;
        image?: string;
        tangible: boolean;
        color?: string;
        size?: string;
    }>;
    shippingAddress?: {
        street: string;
        number: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
    createdAt: string;
}

export const ordersAdminService = {
    getAll: async (): Promise<DashboardOrder[]> => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data: DashboardOrder[] = await response.json();
        // Sort by newest first
        return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
};
