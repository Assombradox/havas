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
                sck: rawUtm.sck || null, // ADD: Required by Utmify API
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
                refundedAt: null, // ADD: Required by Utmify API (always null for pix unless refunded)
                customer: {
                    name: payment.customer?.name || "Cliente",
                    email: payment.customer?.email || "email@email.com",
                    phone: payment.customer?.phone || "00000000000",
                    document: payment.customer?.document || "00000000000",
                    country: "BR",
                    ip: payment.customer?.ip || "127.0.0.1"
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
            console.log('[UTMify] Sending Payload:', JSON.stringify(payload, null, 2));

            // Send to Utmify API
            const response = await axios.post('https://api.utmify.com.br/api-credentials/orders', payload, {
                headers: {
                    'x-api-token': config.utmifyToken
                }
            });

            console.log('[UTMify] Success Response:', JSON.stringify(response.data, null, 2));

            // DEBUG: Send copy to webhook.site for inspection
            try {
                await axios.post('https://webhook.site/bb132eb5-6ed4-4fa8-9fac-826f13d49787', {
                    event: 'utmify_success',
                    timestamp: new Date().toISOString(),
                    eventType: status,
                    orderId: payment.paymentId,
                    logs: {
                        message: `[UTMify] Conversion sent successfully for order ${payment.paymentId}`,
                        status: status,
                        utmData: trackingParameters
                    },
                    payload: payload,
                    utmifyResponse: response.data
                });
            } catch (webhookError) {
                console.log('[UTMify] Debug webhook failed (non-critical)');
            }

        } catch (error: any) {
            console.error('[UTMify] Failed to send conversion:', error.response?.data || error.message);
            if (error.response?.data) {
                console.error('[UTMify] Validation Errors:', JSON.stringify(error.response.data, null, 2));
            }

            // DEBUG: Send error to webhook.site
            try {
                await axios.post('https://webhook.site/bb132eb5-6ed4-4fa8-9fac-826f13d49787', {
                    event: 'utmify_error',
                    timestamp: new Date().toISOString(),
                    eventType: status,
                    orderId: payment.paymentId,
                    logs: {
                        error: error.message,
                        validationErrors: error.response?.data,
                        stack: error.stack,
                        rawUtm: payment.metadata?.utm
                    }
                });
            } catch (webhookError) {
                console.log('[UTMify] Debug webhook failed (non-critical)');
            }
        }
    }
};
