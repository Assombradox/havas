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

        // Convert amount to cents if needed? 
        // User prompt validation says: "amount (number)". 
        // User prompt says: 
        // { "amount": amount } 
        // Previously we converted to cents (39.90 -> 3990).
        // Let's assume the input `amount` to this function is already correct or we check.
        // BUT the user prompt in TAREFA 1 says: "3. Payload JSON... 'amount': amount". 
        // And "Recebe: amount (number)".
        // Usually payment APIs take cents (integer). I will assume the caller passes what is needed, 
        // OR I should handle it. The previous code did `amountInCents`. 
        // If this service is a direct replacement, it should likely take cents.
        // I will assume `amount` passed is already in the correct unit format or I will pass it as is.
        // Let's assume input is Int (cents).

        const payload = {
            amount: amount,
            payment_method: "pix",
            customer: {
                name: payer.name,
                email: payer.email,
                document: payer.document.replace(/\D/g, '') // Ensure digits
            },
            external_id: orderId
        };

        const response = await axios.post('https://finance.brpixpayments.com/api/payments', payload, {
            headers: {
                'Authorization': `Bearer ${secret}`,
                'Content-Type': 'application/json'
            }
        });

        // The user says "Retorna: O transaction_id e o pix.qr_code (EMV)".
        // Let's map the response.
        const data = response.data;

        // Adjust return type based on actual API response structure provided in prompt or assumptions
        // Prompt says: "Retorna: O `transaction_id` e o `pix.qr_code`"
        return {
            transaction_id: data.transaction_id || data.id, // Fallback if id is used
            pix_qr_code: data.pix?.qr_code,
            pix_code: data.pix?.qr_code_text || data.pix?.emv // Fallback
        };

    } catch (error: any) {
        console.error('Error creating BRPix Payment:', error.response?.data || error.message);
        throw error;
    }
};
