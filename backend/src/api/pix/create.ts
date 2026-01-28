import { Request, Response } from 'express';
import Payment from '../../models/Payment';
import { createPixPayment } from '../../services/brPixPaymentsService';
import { paymentStore } from '../../store/paymentStore';
import { emailService } from '../../services/email.service';
import crypto from 'crypto';

export const handleCreatePixPayment = async (req: Request, res: Response) => {
    try {
        // 1. Receber dados
        const { amount, customerName, customerEmail, customerCpf, customerPhone } = req.body;

        // Validação simples
        if (!amount || !customerName || !customerEmail || !customerCpf) {
            return res.status(400).json({ error: 'Campos obrigatórios: amount, customerName, customerEmail, customerCpf' });
        }

        // 2. Preparar Dados
        // Convert to cents as per standard financial practice and previous legacy behavior
        const amountInCents = Math.round(Number(amount) * 100);

        // Generate Order ID (External ID)
        const orderId = crypto.randomUUID();

        // Prepare Payer
        const payer = {
            name: customerName,
            email: customerEmail,
            document: customerCpf.replace(/\D/g, '') // Ensure digits
        };

        // 3. Chamar BRPix Payments (Nova API)
        const transaction = await createPixPayment(amountInCents, payer, orderId);

        console.log('✅ PIX CRIADO (Nova API)! ID da Transação:', transaction.transaction_id);

        // 4. Normalizar Resposta
        // We use `orderId` as our internal paymentId to match Webhook logic
        const responseData = {
            paymentId: orderId,
            qrCodeImage: transaction.pix_qr_code, // EMV as Image placeholder if needed, or check frontend
            pixCode: transaction.pix_code || transaction.pix_qr_code,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            amount: amountInCents
        };

        // 5. Short ID & Persistence
        const lastOrder = await Payment.findOne({ shortId: { $ne: null } }).sort({ shortId: -1 }).select('shortId');
        const nextId = (lastOrder?.shortId || 1000) + 1;

        console.log(`[Create] Saving payment ${orderId} (ShortID: ${nextId}) to MongoDB...`);

        // --- ENRICH ITEMS (Fetch from DB) ---
        let enrichedItems: any[] = [];
        const rawItems = req.body.items || []; // Frontend should pass items: [{ productId, quantity }]

        if (Array.isArray(rawItems) && rawItems.length > 0) {
            try {
                // Determine if items have full details or just ID
                // Ideally, we fetch fresh data to avoid client-side spoofing of names/prices
                const { Product } = require('../../models/Product');

                enrichedItems = await Promise.all(rawItems.map(async (item: any) => {
                    // Try to find product by ID (assuming item.id or item._id or item.productId)
                    const pId = item.productId || item.id || item._id;
                    if (pId) {
                        const product = await Product.findById(pId).select('name images price');
                        if (product) {
                            return {
                                name: product.name,
                                quantity: item.quantity || 1,
                                price: Number(item.price || product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                                image: product.images?.[0] || null
                            };
                        }
                    }
                    // Fallback if no product found (or if item is just text)
                    return {
                        name: item.name || 'Produto',
                        quantity: item.quantity || 1,
                        price: Number(item.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                        image: item.image || null
                    };
                }));
            } catch (err) {
                console.error('[Create] Failed to enrich items:', err);
                enrichedItems = []; // Fallback to empty
            }
        }

        // Save using orderId as the key
        await paymentStore.set(orderId, {
            status: 'waiting_payment',
            pixData: responseData,
            externalId: orderId,
            transactionId: transaction.transaction_id,
            shortId: nextId,
            totalAmount: Number(amount),
            customer: {
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
                document: customerCpf
            },
            items: enrichedItems
        });

        const storeSize = await paymentStore.size();
        console.log(`[Create] Saved. Total payments in store: ${storeSize}`);

        // --- EMAIL NOTIFICATION (ASYNC/NON-BLOCKING) ---
        try {
            console.log(`[Email] Sending Pix instructions to ${customerEmail}...`);
            const formattedTotal = Number(amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            await emailService.sendPixNotification(customerEmail, {
                customerName: customerName.split(' ')[0],
                orderId: nextId.toString(),
                total: formattedTotal,
                pixCode: responseData.pixCode,
                isShortId: true,
                items: enrichedItems
            });
            console.log(`[Email] Pix instructions sent successfully.`);
        } catch (emailError) {
            console.error(`[Email] Failed to send Pix instructions:`, emailError);
        }
        // ----------------------------------------------

        return res.json(responseData);

    } catch (error: any) {
        console.error('[API Create] Erro ao criar PIX:', error.message);
        return res.status(500).json({
            error: 'Erro ao processar pagamento',
            details: error.response?.data || error.message
        });
    }
};
