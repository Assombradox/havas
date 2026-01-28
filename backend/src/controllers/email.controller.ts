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
