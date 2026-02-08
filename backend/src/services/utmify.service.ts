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

            // Sanitization: Tracking Parameters (UTMs)
            const rawUtm = payment.metadata?.utm || {};
            const trackingParameters = {
                src: rawUtm.src || null,
                utm_source: rawUtm.utm_source || null,
                utm_medium: rawUtm.utm_medium || null,
                utm_campaign: rawUtm.utm_campaign || null,
                utm_content: rawUtm.utm_content || null,
                utm_term: rawUtm.utm_term || null
            };

            // Sanitization: Items
            const products = (payment.items || []).map((item: any, index: number) => {
                const getPrice = () => {
                    if (item.priceInCents) return item.priceInCents; // If already calculated
                    if (item.unitPrice) return Math.round(Number(item.unitPrice) * 100);
                    if (item.price) return Math.round(Number(item.price) * 100);
                    return 0;
                };

                return {
                    id: item.product?.toString() || item.productId || item._id || `item-${index + 1}`,
                    name: item.name || 'Produto Indefinido',
                    priceInCents: getPrice(),
                    planId: null,
                    planName: null,
                    quantity: Number(item.quantity || 1)
                };
            });

            // Ensure at least one product exists to satisfy schema
            if (products.length === 0) {
                products.push({
                    id: 'fallback-item',
                    name: 'Pedido Geral',
                    priceInCents: Math.round(Number(payment.totalAmount || 0) * 100),
                    planId: null,
                    planName: null,
                    quantity: 1
                });
            }

            // Prepare Payload based on Documentation
            const payload = {
                orderId: payment.paymentId,
                paymentMethod: "pix",
                platform: "HavaianasProprio",
                status: status,
                createdAt: payment.createdAt ? new Date(payment.createdAt).toISOString().replace('T', ' ').split('.')[0] : new Date().toISOString().replace('T', ' ').split('.')[0],
                approvedDate: status === 'waiting_payment' ? null : new Date().toISOString().replace('T', ' ').split('.')[0],
                customer: {
                    name: payment.customer?.name || "Cliente",
                    email: payment.customer?.email || "email@email.com",
                    phone: payment.customer?.phone || "00000000000",
                    document: payment.customer?.document || "00000000000",
                    ip: "127.0.0.1"
                },
                products: products,
                trackingParameters: trackingParameters,
                commission: {
                    totalPriceInCents: Math.round(Number(payment.totalAmount || 0) * 100),
                    gatewayFeeInCents: 0,
                    userCommissionInCents: Math.round(Number(payment.totalAmount || 0) * 100)
                }
            };

            // Debug Payload
            // console.log('[UTMify] DEBUG Payload:', JSON.stringify(payload, null, 2));

            const response = await axios.post('https://api.utmify.com.br/api-credentials/orders', payload, {
                headers: {
                    'x-api-token': config.utmifyToken
                }
            });

            console.log('[UTMify] Success:', response.data);

        } catch (error: any) {
            console.error('[UTMify] Failed to send conversion:', error.response?.data || error.message);
            if (error.response?.data) {
                console.error('[UTMify] Validation Errors:', JSON.stringify(error.response.data, null, 2));
            }
        }
    }
};
