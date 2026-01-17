/**
 * Service to handle PIX payment operations.
 * This service acts as an abstraction layer between the UI and the Backend API.
 */

export interface PixPaymentPayload {
    customerName: string;
    customerEmail: string;
    customerCpf: string;
    customerPhone: string;
    customerAddress: {
        zip: string;
        street: string;
        number: string;
        neighborhood: string;
        city: string;
        state: string;
        complement?: string;
    };
    amount: number;
}

export interface PixPaymentResponse {
    paymentId: string;
    qrCodeImage: string; // Base64 or URL
    pixCode: string;     // Copy and Paste code
    expiresAt: string;   // ISO 8601 Date
    amount: number;      // in cents
}

/**
 * Creates a new PIX payment.
 * 
 * @param payload - The payment details
 * @returns Promise<PixPaymentResponse>
 */
export const createPixPayment = async (payload: PixPaymentPayload): Promise<PixPaymentResponse> => {
    console.log('[PixService] Initiating PIX payment...', payload);

    try {
        const response = await fetch('http://localhost:3000/api/pix/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Erro ao criar PIX: ${error}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('[PixService] Erro de comunicação:', error);
        throw error;
    }
};
