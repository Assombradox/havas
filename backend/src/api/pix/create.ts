import { Request, Response } from 'express';
import Payment from '../../models/Payment';
import { createPixPayment } from '../../services/brPixPaymentsService';
import { paymentStore } from '../../store/paymentStore';
import { emailService } from '../../services/email.service';
import crypto from 'crypto';

export const handleCreatePixPayment = async (req: Request, res: Response) => {
    try {
        // 1. Receber dados
        const { amount, customerName, customerEmail, customerCpf, customerPhone, shippingAddress, items, metadata } = req.body;

        console.log('📦 FULL BODY KEYS:', Object.keys(req.body));
        console.log('📦 SHIPPING ADDRESS PAYLOAD:', JSON.stringify(shippingAddress, null, 2));

        // Validação simples
        if (!amount || !customerName || !customerEmail || !customerCpf) {
            return res.status(400).json({ error: 'Campos obrigatórios: amount, customerName, customerEmail, customerCpf' });
        }

        // 2. Preparar Dados
        // Convert to cents as per standard financial practice
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
        const responseData = {
            paymentId: orderId,
            qrCodeImage: transaction.pix_qr_code,
            pixCode: transaction.pix_code || transaction.pix_qr_code,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            amount: amountInCents
        };

        // 5. Short ID & Persistence
        const lastOrder = await Payment.findOne({ shortId: { $ne: null } }).sort({ shortId: -1 }).select('shortId');
        const nextId = (lastOrder?.shortId || 1000) + 1;

        console.log(`[Create] Saving payment ${orderId} (ShortID: ${nextId}) to MongoDB...`);

        // --- SNAPSHOT LOGIC (Enrich Items) ---
        let enrichedItems: any[] = [];
        let calculatedTotal = 0;

        // Load Product Model dynamically (Lazy Load to prevent circular deps)
        let Product: any;
        try {
            const ProductModule = require('../../models/Product');
            Product = ProductModule.default || ProductModule;

            if (!Product || typeof Product.findById !== 'function') {
                console.error('[Create] 🔥 FATAL: Product Model failed to load correctly!', Product);
                Product = null;
            }
        } catch (loadErr) {
            console.error('[Create] 🔥 FATAL: require("../../models/Product") threw error:', loadErr);
            Product = null;
        }

        if (Array.isArray(items) && items.length > 0) {
            console.log('[Create] Snapshotting items from DB...');

            // Force fetch for ALL items
            enrichedItems = await Promise.all(items.map(async (item: any) => {
                const pId = item.productId || item.product || item.id || item._id;

                if (pId) {
                    try {
                        let product;
                        // Hybrid Search: Check if it's a valid Mongo ObjectId (24 hex chars)
                        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(pId.toString());

                        if (isValidObjectId) {
                            product = await Product.findById(pId);
                        } else {
                            // Assume it's a Short ID (String)
                            console.log(`[Create] Searching Product by Short ID: ${pId}`);
                            product = await Product.findOne({ id: pId });
                        }

                        if (product) {
                            const unitPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price.toString().replace('R$', '').replace('.', '').replace(',', '.'));
                            const qty = item.quantity || 1;

                            calculatedTotal += (unitPrice * qty);

                            return {
                                product: product._id,
                                name: product.name,           // SNAPSHOT NAME
                                quantity: qty,
                                price: product.price,         // SNAPSHOT PRICE (Number from DB)
                                unitPrice: unitPrice,         // Helper for maths
                                image: product.images?.[0] || '', // SNAPSHOT IMAGE
                                tangible: true // Default
                            };
                        }
                    } catch (err) {
                        console.error(`[Create] Error snapshotting product ${pId}:`, err);
                    }
                }

                // Fallback (Should typically not happen if ID is valid)
                return {
                    name: item.name || 'Produto Não Encontrado',
                    quantity: item.quantity || 1,
                    price: item.price || 0,
                    image: item.image || ''
                };
            }));
        }

        // Save using orderId as the key
        await paymentStore.set(orderId, {
            status: 'waiting_payment',
            pixData: responseData,
            externalId: orderId,
            transactionId: transaction.transaction_id,
            shortId: nextId,
            totalAmount: calculatedTotal > 0 ? calculatedTotal : Number(amount), // Prefer calculated, fallback to request
            customer: {
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
                document: customerCpf
            },
            shippingAddress: shippingAddress ? {
                street: shippingAddress.street,
                number: shippingAddress.number,
                neighborhood: shippingAddress.neighborhood,
                city: shippingAddress.city,
                state: shippingAddress.state,
                complement: shippingAddress.complement,
                zipCode: shippingAddress.zip || shippingAddress.zipCode // Explicit Mapping
            } : undefined,
            items: enrichedItems, // SAVE SNAPSHOT
            metadata: metadata // Save UTM/Metadata
        });

        const storeSize = await paymentStore.size();
        console.log(`[Create] Saved. Total payments in store: ${storeSize}`);

        // --- EMAIL NOTIFICATION ---
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
