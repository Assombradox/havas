import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BRPIX_API_URL = process.env.BRPIX_API_URL || 'https://api.brpixdigital.com/functions/v1';

const getAuthHeader = () => {
    const secretKey = process.env.BRPIX_SECRET_KEY;
    const companyId = process.env.BRPIX_COMPANY_ID;

    if (!secretKey || !companyId) {
        throw new Error('Configuração BRPIX ausente: Verifique BRPIX_SECRET_KEY e BRPIX_COMPANY_ID no .env');
    }

    const credentials = Buffer.from(`${secretKey}:${companyId}`).toString('base64');
    return `Basic ${credentials}`;
};

interface CreateTransactionPayload {
    amount: number; // in cents
    paymentMethod: 'PIX';
    customer: {
        name: string;
        email: string;
        phone: string;
        document: {
            number: string;
            type: 'CPF' | 'CNPJ';
        };
    };
    items: Array<{
        title: string;
        quantity: number;
        unitPrice: number;
        tangible: boolean;
    }>;
    shipping?: {
        address: {
            street: string;
            streetNumber: string;
            zipCode: string;
            neighborhood: string;
            city: string;
            state: string;
            country: string;
            complement?: string;
        }
    };
    pix?: {
        expiresInDays: number;
    }
}

export const createPixTransaction = async (payload: CreateTransactionPayload) => {
    try {
        console.log(`[BRPIX Service] Criando transação... Valor: ${payload.amount}`);
        console.log(`[BRPIX Service] Payload JSON enviado:`, JSON.stringify(payload, null, 2));

        const response = await axios.post(`${BRPIX_API_URL}/transactions`, payload, {
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error: any) {
        console.error('[BRPIX Service] Erro:', error.response?.data || error.message);
        throw error;
    }
};
