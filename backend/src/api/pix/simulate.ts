import { Request, Response } from 'express';
import { paymentStore } from '../../store/paymentStore';

export const handleSimulatePixPay = async (req: Request, res: Response) => {
    // Only allow in mock mode or dev
    if (process.env.USE_MOCK_PAYMENT !== 'true') {
        return res.status(403).json({ error: 'Simulation only available in Mock Mode' });
    }

    const { paymentId } = req.params;

    if (!paymentId) {
        return res.status(400).json({ error: 'Missing paymentId' });
    }

    const payment = await paymentStore.get(paymentId);

    if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
    }

    // Update status to paid
    await paymentStore.set(paymentId, {
        ...payment,
        status: 'paid'
    });

    return res.json({
        success: true,
        message: `Payment ${paymentId} marked as PAID`,
        status: 'paid'
    });
};
