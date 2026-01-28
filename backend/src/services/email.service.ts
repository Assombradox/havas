import { Resend } from 'resend';

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
    }
};
