import { utmifyService } from '../../services/utmify.service';

export const handlePixWebhook = async (req: Request, res: Response) => {
    // ... (existing code)

    // --- UTMIFY TRIGGER ---
    if (payment) {
        await utmifyService.sendConversion(payment);
    }
    // ----------------------
    // Debug Logs for Signature Inspection
    console.log('📨 Webhook Headers Recebidos:', JSON.stringify(req.headers, null, 2));
    console.log('📦 Webhook Body:', JSON.stringify(req.body, null, 2));

    try {
        // 2. Tentar várias chaves para encontrar a assinatura
        const signature = req.headers['x-webhook-signature'] ||
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
                const payment = await Payment.findOneAndUpdate(
                    { paymentId: orderId },
                    { status: 'paid' },
                    { new: true }
                );

                // --- UTMIFY TRIGGER ---
                if (payment?.metadata?.utm) {
                    try {
                        console.log('[Webhook] Triggering UTMify Postback...');
                        // Note: Replace with actual UTMify endpoint if available
                        /*
                        await axios.post('https://api.utmify.com.br/v1/postback', {
                            ...payment.metadata.utm,
                            revenue: payment.totalAmount,
                            transaction_id: orderId
                        });
                        */
                        console.log('[Webhook] UTMify Postback Logic Placeholder Executed.');
                    } catch (utmError) {
                        console.error('[Webhook] UTMify Postback Failed:', utmError);
                    }
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
