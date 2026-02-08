import axios from 'axios';
import { getStoreConfig } from '../models/StoreConfig';
import { IPayment } from '../models/Payment';

export const utmifyService = {
    /**
     * Sends a conversion event to UTMify
     */
    sendConversion: async (payment: IPayment, status: 'paid' | 'waiting_payment' = 'paid') => {
        try {
            const config = await getStoreConfig();

            if (!config.utmifyActive || !config.utmifyToken) {
                console.log('[UTMify] Integration disabled or token missing.');
                return;
            }

            console.log(`[UTMify] Sending Validated Conversion (${status}) for Order ${payment.paymentId}...`);

            // Prepare Items
            const products = (payment.items || []).map(item => ({
                name: item.name || 'Produto',
                unitPriceInCents: Math.round(Number(item.price || item.unitPrice || 0) * 100),
                quantity: item.quantity
            }));

            // Prepare Payload based on Documentation
            const payload = {
                orderId: payment.paymentId,
                platform: "HavaianasProprio",
                paymentMethod: "pix",
                status: status,
                createdAt: payment.createdAt ? new Date(payment.createdAt).toISOString().replace('T', ' ').split('.')[0] : new Date().toISOString().replace('T', ' ').split('.')[0],
                approvedDate: status === 'waiting_payment' ? null : new Date().toISOString().replace('T', ' ').split('.')[0],
                customer: {
                    name: payment.customer?.name || "Cliente",
                    email: payment.customer?.email || "email@email.com",
                    phone: payment.customer?.phone || "00000000000",
                    document: payment.customer?.document || "00000000000",
                    ip: "127.0.0.1" // We don't track IP in Payment model yet, using placeholder
                },
                products: products,
                trackingParameters: payment.metadata?.utm || {},
                commission: {
                    totalPriceInCents: Math.round(Number(payment.totalAmount || 0) * 100),
                    gatewayFeeInCents: 0,
                    userCommissionInCents: Math.round(Number(payment.totalAmount || 0) * 100)
                }
            };

            const response = await axios.post('https://api.utmify.com.br/api-credentials/orders', payload, {
                headers: {
                    'x-api-token': config.utmifyToken
                }
            });

            console.log('[UTMify] Success:', response.data);

        } catch (error: any) {
            console.error('[UTMify] Failed to send conversion:', error.response?.data || error.message);
            // Don't throw to prevent webhook failure
        }
    }
};
