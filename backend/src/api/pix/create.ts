import { Request, Response } from 'express';
import { createPixTransaction } from '../../services/brpixService';
import { paymentStore } from '../../store/paymentStore';

export const handleCreatePixPayment = async (req: Request, res: Response) => {
    try {
        // 1. Receber dados
        const { amount, customerName, customerEmail, customerCpf, customerPhone, customerAddress } = req.body;

        // Validação simples
        if (!amount || !customerName || !customerEmail || !customerCpf) {
            return res.status(400).json({ error: 'Campos obrigatórios: amount, customerName, customerEmail, customerCpf' });
        }

        // 2. Preparar Payload (converter para centavos se vier float, BRPIX espera int em centavos)
        // Assumindo que o frontend envia 39.90, convertemos para 3990
        const amountInCents = Math.round(Number(amount) * 100);

        // Normalize Phone: Ensure digits only
        const phone = customerPhone ? customerPhone.replace(/\D/g, '') : '';
        const cpf = customerCpf ? customerCpf.replace(/\D/g, '') : '';

        // Construct Payload strictly matching the documentation provided
        const payload = {
            amount: amountInCents,
            paymentMethod: 'PIX' as const,
            customer: {
                name: customerName,
                email: customerEmail,
                phone: phone,
                document: {
                    number: cpf,
                    type: 'CPF' as const
                }
            },
            items: [
                {
                    title: "Pedido Checkout",
                    quantity: 1,
                    tangible: true,
                    unitPrice: amountInCents
                }
            ],
            shipping: customerAddress ? {
                address: {
                    street: customerAddress.street,
                    streetNumber: customerAddress.number, // Correct field name
                    zipCode: customerAddress.zip ? customerAddress.zip.replace(/\D/g, '') : '', // Correct field name
                    neighborhood: customerAddress.neighborhood,
                    city: customerAddress.city,
                    state: customerAddress.state,
                    country: 'BR',
                    complement: customerAddress.complement || ''
                }
            } : undefined,
            pix: {
                expiresInDays: 1
            }
        };

        // 3. Chamar BRPIX
        const transaction = await createPixTransaction(payload);

        console.log('✅ PIX CRIADO! ID da Transação:', transaction.id);
        console.log('👉 Use este ID para simular o Webhook!');

        // 4. Normalizar Resposta
        // 5. Persistir dados em memória
        const responseData = {
            paymentId: transaction.id,
            qrCodeImage: transaction.pix?.qrcode,      // Base64 image
            pixCode: transaction.pix?.qrcodeText,      // Copia e Cola
            expiresAt: transaction.pix?.expirationDate
        };

        // Import paymentStore dynamically or assume it's available via module import if not circular
        // To avoid circular dependency issues if create.ts imports app.ts, we might need a separate store file
        // BUT strict separation isn't enforced here yet. Let's try importing paymentStore.

        // Since we cannot easily add imports at top with replace_file_content if we don't include top lines,
        // we'll use a hack or assume imports are handled. WAIT. I should add the import first.

        // Actually, let's look at the file content again. I need to import paymentStore.
        // It's better to do this in two steps or be careful.

        // Let's assume I will add the import in a separate tool call if needed, or if I can edit the top.
        // I will edit the top to add import, then edit the bottom to use it.

        // 5. Persistir em memória/disco
        console.log(`[Create] Saving payment ${transaction.id} to persistent store...`);
        await paymentStore.set(transaction.id, {
            status: 'waiting_payment',
            pixData: responseData
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
