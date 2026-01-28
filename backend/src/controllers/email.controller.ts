import { Request, Response } from 'express';
import { emailService } from '../services/email.service';

export const handleTestEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const result = await emailService.sendTestEmail(email);
        res.status(200).json({ message: 'Email sent successfully', data: result });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to send email' });
    }
};

export const handleTestPixEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        // Mock Data
        const mockData = {
            customerName: "Cliente Teste",
            orderId: "1234",
            total: "R$ 149,90",
            pixCode: "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540410.005802BR5913Cicrano de Tal6008Brasilia62070503***6304E2CA"
        };

        const result = await emailService.sendPixNotification(email, mockData);
        res.status(200).json({ message: 'Pix Email sent!', data: result });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to send Pix email' });
    }
};
