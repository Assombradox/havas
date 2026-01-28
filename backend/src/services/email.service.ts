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
                items: data.items,
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
