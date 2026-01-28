import { Resend } from 'resend';
import { render } from '@react-email/render';
import React from 'react';
import { OrderPixTemplate } from '../emails/OrderPixTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailService = {
    sendTestEmail: async (toEmail: string) => {
        try {
            const data = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: toEmail,
                subject: 'Teste de Conexão Havas Store 🚀',
                html: '<p>Seu sistema de email está <strong>funcionando</strong>!</p>'
            });

            if (data.error) {
                console.error('Email service error:', data.error);
                throw new Error(data.error.message);
            }

            return data;
        } catch (error) {
            console.error('Failed to send test email:', error);
            throw error;
        }
    },

    sendPixNotification: async (toEmail: string, data: {
        customerName: string;
        orderId: string;
        total: string;
        pixCode: string;
        qrCodeUrl?: string;
        isShortId?: boolean;
        items?: any[];
    }, overrideConfig?: any) => {
        try {
            // Fetch Config (DB) or use Override (Preview)
            let config = overrideConfig;
            if (!config) {
                const { getStoreConfig } = require('../models/StoreConfig');
                config = await getStoreConfig();
            }

            const qrUrl = data.qrCodeUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(data.pixCode);

            // --- BRUTE FORCE PRODUCT DATA FETCHING ---
            // The user reported items coming empty. We will force fetch them here to be absolutely sure.
            let finalItems = data.items || [];
            if (finalItems.length > 0) {
                try {
                    const { Product } = require('../models/Product');
                    console.log('[EmailService] Starting Brute Force Item Enrichment...');

                    finalItems = await Promise.all(finalItems.map(async (item: any) => {
                        const pId = item.productId || item.product || item.id || item._id;
                        if (pId) {
                            try {
                                const productDetails = await Product.findById(pId).select('name price images');
                                if (productDetails) {
                                    console.log(`[EmailService] Found Product: ${productDetails.name}`);
                                    return {
                                        name: productDetails.name,
                                        quantity: item.quantity,
                                        price: typeof item.price === 'string' ? item.price : Number(productDetails.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                                        image: productDetails.images?.[0] || item.image || ''
                                    };
                                }
                            } catch (pErr) {
                                console.warn(`[EmailService] Product lookup failed for ${pId}`, pErr);
                            }
                        }
                        return item;
                    }));
                } catch (err) {
                    console.error('[EmailService] Brute force enrichment failed:', err);
                }
            }
            // ------------------------------------------

            console.log('[EmailService] Final Items passed to template:', JSON.stringify(finalItems, null, 2));

            const emailHtml = await render(React.createElement(OrderPixTemplate, {
                customerName: data.customerName,
                orderId: data.orderId,
                total: data.total,
                pixCode: data.pixCode,
                qrCodeUrl: qrUrl,
                brandColor: config.primaryColor,
                logoUrl: config.logoUrl,
                storeName: config.storeName,
                // Rich Content
                items: finalItems,
                emailTitle: config.emailTitle,
                emailMessage: config.emailMessage,
                emailFooter: config.emailFooter
            }));

            const subject = data.isShortId
                ? `${config.storeName}: Pedido #${data.orderId} Recebido!`
                : `${config.storeName}: Pedido Recebido!`;

            const result = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: toEmail,
                subject: subject,
                html: emailHtml
            });

            if (result.error) throw new Error(result.error.message || 'Unknown Error');
            return result;


        } catch (error) {
            console.error('Failed to send Pix email:', error);
            throw error;
        }
    }
};
