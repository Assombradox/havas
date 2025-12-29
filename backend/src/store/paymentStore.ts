import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'payments.json');

// Ensure data directory exists
const init = async () => {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify({}), 'utf-8');
    }
};

// Initialize immediately
init();

export const paymentStore = {
    get: async (key: string): Promise<any> => {
        try {
            const data = await fs.readFile(DATA_FILE, 'utf-8');
            const payments = JSON.parse(data);
            return payments[key];
        } catch (error) {
            console.error('[Store] Error reading payment:', error);
            return null;
        }
    },

    set: async (key: string, value: any): Promise<void> => {
        try {
            // Read current data to preserve other payments
            let payments: Record<string, any> = {};
            try {
                const data = await fs.readFile(DATA_FILE, 'utf-8');
                payments = JSON.parse(data);
            } catch {
                // Ignore read error, start with empty
            }

            payments[key] = value;

            await fs.writeFile(DATA_FILE, JSON.stringify(payments, null, 2), 'utf-8');
            console.log(`[Store] Payment ${key} persisted to disk.`);
        } catch (error) {
            console.error('[Store] Error saving payment:', error);
        }
    },

    size: async (): Promise<number> => {
        try {
            const data = await fs.readFile(DATA_FILE, 'utf-8');
            const payments = JSON.parse(data);
            return Object.keys(payments).length;
        } catch {
            return 0;
        }
    }
};
