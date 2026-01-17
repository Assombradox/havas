import { Request, Response } from 'express';
import { createPixPayment } from '../../services/brPixPaymentsService';
import { paymentStore } from '../../store/paymentStore';
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

        // 5. Persistir no MongoDB
        console.log(`[Create] Saving payment ${orderId} (Trans: ${transaction.transaction_id}) to MongoDB...`);

        // Save using orderId as the key
        await paymentStore.set(orderId, {
            status: 'waiting_payment',
            pixData: responseData,
            externalId: orderId,
            transactionId: transaction.transaction_id,

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

        return res.json(responseData);

    } catch (error: any) {
        console.error('[API Create] Erro ao criar PIX:', error.message);
        return res.status(500).json({
            error: 'Erro ao processar pagamento',
            details: error.response?.data || error.message
        });
    }
};
