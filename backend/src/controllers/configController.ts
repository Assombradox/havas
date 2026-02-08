import { Request, Response } from 'express';
import { StoreConfig, getStoreConfig } from '../models/StoreConfig';
import { emailService } from '../services/email.service';

// GET /api/config
export const getConfig = async (req: Request, res: Response) => {
    try {
        const config = await getStoreConfig();
        res.json(config);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch config' });
    }
};

// PUT /api/config
export const updateConfig = async (req: Request, res: Response) => {
    try {
        const { logoUrl, primaryColor, storeName } = req.body;
        const config = await getStoreConfig();

        if (logoUrl !== undefined) config.logoUrl = logoUrl;
        if (primaryColor !== undefined) config.primaryColor = primaryColor;
        if (storeName !== undefined) config.storeName = storeName;
        if (req.body.emailTitle !== undefined) config.emailTitle = req.body.emailTitle;
        if (req.body.emailMessage !== undefined) config.emailMessage = req.body.emailMessage;
        if (req.body.emailFooter !== undefined) config.emailFooter = req.body.emailFooter;
        if (req.body.utmifyToken !== undefined) config.utmifyToken = req.body.utmifyToken;
        if (req.body.utmifyActive !== undefined) config.utmifyActive = req.body.utmifyActive;

        await config.save();
        res.json(config);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update config' });
    }
};

// POST /api/config/test-preview
export const sendTestPreview = async (req: Request, res: Response) => {
    try {
        const { logoUrl, primaryColor, storeName, emailTitle, emailMessage, emailFooter } = req.body;

        // Mock Payload
        const mockData = {
            customerName: "Preview User",
            orderId: "1001",
            total: "R$ 150,00",
            pixCode: "00020126580014BR.GOV.BCB.PIX0136123e4567-TEST-PREVIEW-6304E2CA",
            qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TEST-PREVIEW",
            isShortId: true,
            items: [
                {
                    name: 'Havaianas Top',
                    quantity: 1,
                    price: 'R$ 49,90',
                    image: 'https://via.placeholder.com/50'
                },
                {
                    name: 'Pingente Cristal',
                    quantity: 2,
                    price: 'R$ 15,00',
                    image: 'https://via.placeholder.com/50'
                }
            ]
        };

        // Override Config just for this send
        const customConfig = {
            logoUrl: logoUrl || '',
            primaryColor: primaryColor || '#000000',
            storeName: storeName || 'Havas Store',
            emailTitle: emailTitle || 'Pedido Recebido!',
            emailMessage: emailMessage || 'Olá {name}, recebemos seu pedido **#{orderId}**.',
            emailFooter: emailFooter || 'Se tiver dúvidas, responda a este email.'
        };

        // Send to hardcoded tester
        const result = await emailService.sendPixNotification('maatheuswork@gmail.com', mockData, customConfig);

        res.json({ message: 'Preview sent!', data: result });
    } catch (error: any) {
        console.error('Preview Error:', error);
        res.status(500).json({ error: error.message || 'Failed to send preview' });
    }
};
