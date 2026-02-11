import { Request, Response } from 'express';
import crypto from 'crypto';
import Payment from '../../models/Payment';
import { utmifyService } from '../../services/utmify.service';
import axios from 'axios';

export const handlePixWebhook = async (req: Request, res: Response) => {
    // Debug Logs for Signature Inspection
    console.log('📨 Webhook Headers Recebidos:', JSON.stringify(req.headers, null, 2));
    console.log('📦 Webhook Body:', JSON.stringify(req.body, null, 2));

    try {
        // 2. Tentar várias chaves para encontrar a assinatura
        // FIX: Added x-pixbolt-signature as primary
        const signature = req.headers['x-pixbolt-signature'] ||
            req.headers['x-webhook-signature'] ||
            req.headers['x-brpix-signature'] ||
            req.headers['signature'] ||
            req.headers['authorization'] ||
            req.headers['http_x_webhook_signature'];

        const secret = process.env.BRPIX_WEBHOOK_SECRET;

        // 1. Validação de Segurança (HMAC)
        if (!secret) {
            console.error('[Webhook] BRPIX_WEBHOOK_SECRET not configured');
            return res.status(500).send('Configuration Error');
        }

        if (!signature) {
            // Log detalhado dos headers disponíveis para debug
            console.error('[Webhook] Assinatura não encontrada. Headers disponíveis:', Object.keys(req.headers));
            throw new Error('[Webhook] Assinatura não encontrada nos headers: ' + Object.keys(req.headers).join(', '));
        }

        // Generate HMAC-SHA256 of the body
        const hmac = crypto.createHmac('sha256', secret);
        const digest = hmac.update(JSON.stringify(req.body)).digest('hex');

        // Timing safe compare
        if (typeof signature === 'string') {
            if (signature !== digest) {
                // FIX: Added debug log for signature mismatch
                console.warn(`[Webhook] Signature Mismatch! Received: ${signature} | Calculated: ${digest}`);

                // Secure compare
                const signatureBuffer = Buffer.from(signature);
                const digestBuffer = Buffer.from(digest);
                if (signatureBuffer.length !== digestBuffer.length || !crypto.timingSafeEqual(signatureBuffer, digestBuffer)) {
                    console.error('[Webhook] Invalid signature');
                    return res.status(401).send('Invalid Signature');
                }
            }
        }

        // 2. Lógica de Aprovação
        // FIX: Handle both 'payload' and 'data' structures
        const { event } = req.body;
        const bodyData = req.body.data || req.body.payload;

        console.log(`[Webhook] Event: ${event}`);

        if (event === 'transaction.paid') {
            const orderId = bodyData?.external_id; // FIX: Use extracted bodyData

            if (orderId || bodyData?.transaction_id) {
                const transactionId = bodyData?.transaction_id;
                console.log(`[Webhook] Searching for Order. ExternalID: ${orderId} | TransactionID: ${transactionId}`);

                // Update MongoDB with robust search
                const payment = await Payment.findOneAndUpdate(
                    {
                        $or: [
                            { paymentId: orderId },       // Try internal UUID
                            { transactionId: transactionId } // Try Gateway ID (Fallback)
                        ]
                    },
                    {
                        status: 'paid',
                        approvedDate: new Date()
                    },
                    { new: true }
                );

                // --- UTMIFY TRIGGER ---
                if (payment) {
                    // Send to webhook.site for debugging
                    axios.post('https://webhook.site/bb132eb5-6ed4-4fa8-9fac-826f13d49787', {
                        event: 'pix_paid',
                        timestamp: new Date().toISOString(),
                        orderId: payment.paymentId,
                        shortId: payment.shortId,
                        logs: {
                            message: `[Webhook] Pix pago confirmado. Order: ${payment.paymentId}`,
                            metadata: payment.metadata,
                            totalAmount: payment.totalAmount,
                            customerEmail: payment.customer?.email
                        }
                    }).catch(() => { });

                    await utmifyService.sendConversion(payment);
                } else {
                    console.error(`[Webhook] Payment not found for orderId: ${orderId}`);

                    // Send error to webhook.site
                    axios.post('https://webhook.site/bb132eb5-6ed4-4fa8-9fac-826f13d49787', {
                        event: 'webhook_error',
                        timestamp: new Date().toISOString(),
                        logs: {
                            error: 'Payment not found',
                            orderId: orderId,
                            transactionId: transactionId
                        }
                    }).catch(() => { });
                }
                // ----------------------

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
