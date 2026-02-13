import { Request, Response } from 'express';
import { paymentStore } from '../../store/paymentStore';

export const handleGetPixPayment = async (req: Request, res: Response) => {
    try {
        const { paymentId } = req.params;

        const size = await paymentStore.size();
        console.log(`[Get] Searching for payment ${paymentId}. Store size: ${size}`);
        const payment = await paymentStore.get(paymentId);
        console.log(`[Get] Found:`, !!payment);

        if (!payment) {
            return res.status(404).json({ error: 'Pagamento não encontrado' });
        }

        // Return full order data for Receipt Page
        return res.json({
            ...payment.pixData,
            status: payment.status,
            totalAmount: payment.totalAmount,
            items: payment.items,
            shippingAddress: payment.shippingAddress,
            customer: payment.customer
        });

    } catch (error: any) {
        console.error('[API Get] Erro ao buscar PIX:', error.message);
        return res.status(500).json({ error: 'Erro ao buscar pagamento' });
    }
};
