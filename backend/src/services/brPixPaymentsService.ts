import axios from 'axios';

interface Payer {
    name: string;
    email: string;
    document: string; // CPF/CNPJ numbers only
}

interface CreatePixResponse {
    transaction_id: string;
    pix: {
        qr_code: string;
        qr_code_text: string; // Assuming API returns text version too, usually 'emv' or 'qrcode_text'
    };
}

export const createPixPayment = async (amount: number, payer: Payer, orderId: string) => {
    try {
        const secret = process.env.BRPIX_PAYMENTS_SECRET;
        if (!secret) {
            throw new Error('BRPIX_PAYMENTS_SECRET not defined');
        }

        // Sanitization
        const cleanDocument = payer.document.replace(/\D/g, '');

        // Converte centavos (2990) para reais (29.90)
        const amountInReais = Number(amount) / 100;

        // Formata para garantir 2 casas decimais e volta para numero
        const cleanAmount = parseFloat(amountInReais.toFixed(2));

        const payload = {
            amount: cleanAmount, // API expects number/decimal

            payment_method: "pix",
            customer: {
                name: payer.name,
                email: payer.email.trim(),
                document: cleanDocument
            },
            external_id: orderId
        };

        const response = await axios.post('https://finance.brpixpayments.com/api/payments', payload, {
            headers: {
                'Authorization': `Bearer ${secret}`,
                'Content-Type': 'application/json'
            }
        });

        const data = response.data;

        return {
            transaction_id: data.transaction_id || data.id,
            pix_qr_code: data.pix?.qr_code,
            pix_code: data.pix?.qr_code_text || data.pix?.emv
        };

    } catch (error: any) {
        console.error('❌ BRPix Error Dump:', {
            status: error.response?.status,
            data: error.response?.data,
            payloadSent: {
                ...error.config?.data ? JSON.parse(error.config.data) : 'N/A'
            }
        });
        throw new Error(`Erro BRPix: ${JSON.stringify(error.response?.data || error.message)}`);
    }
};
