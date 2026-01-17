import { Request, Response } from 'express';
import Payment from '../models/Payment';

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        console.log('[Admin API] Fetching all orders...');

        // Fetch all payments/orders sort by newest
        const orders = await Payment.find({})
            .sort({ createdAt: -1 })
            .lean(); // Faster query, returns POJO

        // Map to simplified structure if needed, or return full doc
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            paymentId: order.paymentId,
            status: order.status,
            totalAmount: order.totalAmount || order.pixData?.amount, // Fallback
            customer: order.customer || { name: 'N/A' }, // Fallback for old records
            items: order.items || [],
            createdAt: order.createdAt
        }));

        res.json(formattedOrders);

    } catch (error: any) {
        console.error('[Admin API] Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
