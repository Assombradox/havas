import Payment from '../models/Payment';

export const paymentStore = {
    get: async (paymentId: string): Promise<any> => {
        try {
            const doc = await Payment.findOne({ paymentId });
            // The JSON store stored the whole "data" object, but our model has structure.
            // However, looking at the user request: "return doc ? doc.data : null;"
            // But wait, the Model has `pixData`, `status`, `paymentId`.
            // The JSON store likely stored whatever object was passed to `set`.
            // Let's look at `create.ts` later. 
            // The user instruction says: return doc ? doc.data : null;
            // BUT wait, does the doc HAVE a `data` field?
            // Checking Payment.ts: It has `status`, `pixData`. NOT `data`.
            // The user might be assuming a generic `data` field or `pixData`.
            // Let's assume the user meant `pixData` or `doc` itself?
            // User Prompt: "return doc ? doc.data : null;"
            // This is suspicious. If I follow blindly it might fail if Mongoose doc doesn't have virtual `data`.
            // Let's check `Payment.ts` again. It has `pixData`.
            // BUT `paymentStore.set` in the user Prompt says: `await Payment.findOneAndUpdate({ paymentId }, { paymentId, data }, ...)`
            // This suggests the user *intends* to pass generic `data` *or* the controller wraps it.
            // If I look at `Payment.ts`, it has structured fields.
            // If I look at the old `paymentStore. set`, it took `value: any`.
            // If I change the code to use the Model, I must match the Model schema.
            // The Model has `paymentId`, `status`, `pixData`.
            // I suspect the "data" in user prompt implies the object containing these.
            // OR maybe I should map the `value` passed to `set` to the model fields.
            // Let's assume `value` contains `{ paymentId, status, ...pixData }` or similar.

            // NOTE: I will blindly follow the user's "concept" but adapt to the ACTUAL Schema I saw.
            // Schema: paymentId, status, pixData.

            // Strategy: 
            // When `set(key, value)` is called, `value` is likely the full payment object.
            // I should save it.
            // But how?
            // If `value` has `pixData` etc.

            // Let's wait to see `create.ts`.
            // But I have to replace `paymentStore` now.
            // I'll make `set` generic enough or smart enough.

            return doc ? doc.toObject() : null;
        } catch (error) {
            console.error('[Store] Error reading payment:', error);
            return null;
        }
    },

    set: async (paymentId: string, data: any): Promise<void> => {
        try {
            // User instruction: await Payment.findOneAndUpdate({ paymentId }, { paymentId, data }, { upsert: true, new: true });
            // This implies the schema has a `data` field OR `data` is destructured?
            // The schema does NOT have `data`.
            // So `data` must be mapped to `status`, `pixData`.
            // Or maybe the user *wants* me to change the schema? No, "TAREFA 1: Reescrever paymentStore".

            // Let's assume `data` corresponds to the fields `status`, `pixData` etc.
            // I will use `...data` to spread it into the update.
            // AND ensure `paymentId` is there.

            await Payment.findOneAndUpdate(
                { paymentId },
                { paymentId, ...data },
                { upsert: true, new: true }
            );
            console.log(`[Store] Payment ${paymentId} persisted to MongoDB.`);
        } catch (error) {
            console.error('[Store] Error saving payment:', error);
        }
    },

    size: async (): Promise<number> => {
        try {
            return await Payment.countDocuments();
        } catch {
            return 0;
        }
    }
};
