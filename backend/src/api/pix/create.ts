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
        // Generate Short ID (Concurrency Safe-ish)
        const lastOrder = await Payment.findOne({ shortId: { $ne: null } }).sort({ shortId: -1 }).select('shortId');
        const nextId = (lastOrder?.shortId || 1000) + 1;

        console.log(`[Create] Saving payment ${orderId} (ShortID: ${nextId}) to MongoDB...`);

        // Save using orderId as the key
        await paymentStore.set(orderId, {
            status: 'waiting_payment',
            pixData: responseData,
            externalId: orderId,
            transactionId: transaction.transaction_id,
            shortId: nextId,

            // New Fields for Admin List
            totalAmount: Number(amount), // Original input (Reais usually, based on context)
            customer: {
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
                document: customerCpf
            },
            items: [
                {
                    title: "Pedido Checkout",
                    quantity: 1,
                    unitPrice: Number(amount),
                    tangible: true
                }
            ]
        });

        const storeSize = await paymentStore.size();
        console.log(`[Create] Saved. Total payments in store: ${storeSize}`);

        // --- EMAIL NOTIFICATION (ASYNC/NON-BLOCKING) ---
        try {
            console.log(`[Email] Sending Pix instructions to ${customerEmail}...`);
            // Format amount (assuming amount is in Reais string or number)
            const formattedTotal = Number(amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            await emailService.sendPixNotification(customerEmail, {
                customerName: customerName.split(' ')[0], // First Name
                orderId: nextId.toString(), // Use Short ID
                total: formattedTotal,
                pixCode: responseData.pixCode,
                isShortId: true
                // qrCodeUrl: responseData.qrCodeImage // Add if available
            });
            console.log(`[Email] Pix instructions sent successfully.`);
        } catch (emailError) {
            console.error(`[Email] Failed to send Pix instructions:`, emailError);
            // Don't fail the request
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
