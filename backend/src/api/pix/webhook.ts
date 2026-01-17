import { Request, Response } from 'express';
import crypto from 'crypto';
import Payment from '../../models/Payment';

export const handlePixWebhook = async (req: Request, res: Response) => {
    try {
        const signature = req.headers['x-webhook-signature'] || req.headers['http_x_webhook_signature'];
        const secret = process.env.BRPIX_WEBHOOK_SECRET;

        // 1. Validação de Segurança (HMAC)
        if (!secret) {
            console.error('[Webhook] BRPIX_WEBHOOK_SECRET not configured');
            return res.status(500).send('Configuration Error');
        }

        if (!signature) {
            console.error('[Webhook] Missing signature');
            return res.status(401).send('Missing Signature');
        }

        // Generate HMAC-SHA256 of the body
        const hmac = crypto.createHmac('sha256', secret);
        const digest = hmac.update(JSON.stringify(req.body)).digest('hex');

        // Timing safe compare
        // Note: signature from header might be plain hex or base64? 
        // Docs usually specify. Assuming hex based on "digest('hex')". 
        // If comparison fails, we reject.
        // Let's assume hex. 
        if (signature !== digest) {
            // Secure compare
            const signatureBuffer = Buffer.from(String(signature));
            const digestBuffer = Buffer.from(digest);
            if (signatureBuffer.length !== digestBuffer.length || !crypto.timingSafeEqual(signatureBuffer, digestBuffer)) {
                console.error('[Webhook] Invalid signature');
                return res.status(401).send('Invalid Signature');
            }
        }

        // 2. Lógica de Aprovação
        const { event, payload } = req.body;

        console.log(`[Webhook] Event: ${event}`);

        if (event === 'transaction.paid') {
            const orderId = payload.external_id;

            if (orderId) {
                console.log(`[Webhook] Payment Confirmed for Order: ${orderId}`);

                // Update MongoDB
                await Payment.findOneAndUpdate(
                    { paymentId: orderId },
                    { status: 'paid' },
                    { new: true }
                );
            } else {
                console.warn('[Webhook] Paid event missing external_id');
            }
        }

        return res.status(200).send('OK');

    } catch (error: any) {
        console.error('[Webhook] Error processing:', error.message);
        return res.status(500).send('Internal Error');
    }
};
