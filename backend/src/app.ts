import express = require('express');
import cors from 'cors';
import { handleCreatePixPayment } from './api/pix/create';
import { handlePixWebhook } from './api/pix/webhook';
import { handleSimulatePixPay } from './api/pix/simulate';

const app = express();

// Middlewares
app.use(cors()); // Allow Frontend to access
app.use(express.json());

import { paymentStore } from './store/paymentStore';

import { handleGetPixPayment } from './api/pix/get';
import { productsRouter } from './routes/products.routes';
import { categoriesRouter } from './routes/categories.routes';

// Routes
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);

app.post('/api/pix/create', handleCreatePixPayment);
app.get('/api/pix/:paymentId', handleGetPixPayment);
app.post('/api/pix/webhook', handlePixWebhook);
app.post('/api/pix/simulate-pay/:paymentId', handleSimulatePixPay);

// Status Endpoint
app.get('/api/pix/status/:paymentId', async (req, res) => {
    const { paymentId } = req.params;
    const payment = await paymentStore.get(paymentId);
    const status = payment?.status || 'waiting_payment';
    res.json({ status });
});

// Health Check
app.get('/', (req, res) => {
    res.json({ status: 'Backend Online', service: 'BRPIX Integration' });
});

export default app;
