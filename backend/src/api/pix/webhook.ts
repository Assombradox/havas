import { Request, Response } from 'express';
import { paymentStore } from '../../store/paymentStore';

export const handlePixWebhook = async (req: Request, res: Response) => {
    // Placeholder for webhook logic
    // Will need to validate signature and update paymentStore
    console.log('[Webhook] Received:', req.body);
    res.status(200).send('OK');
};
