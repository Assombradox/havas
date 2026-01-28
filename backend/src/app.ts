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

// Auth Routes
import { authRouter } from './routes/auth.routes';
app.use('/api/auth', authRouter);

// Upload Routes
import { uploadRouter } from './routes/upload.routes';
app.use('/api/upload', uploadRouter);

// Banner Routes
import bannerRouter from './routes/banners.routes';
app.use('/api/banners', bannerRouter);

// Email Routes
import emailRouter from './routes/email.routes';
app.use('/api/email', emailRouter);

app.post('/api/pix/create', handleCreatePixPayment);
app.get('/api/pix/:paymentId', handleGetPixPayment);
app.post('/api/pix/webhook', handlePixWebhook);
app.post('/api/pix/simulate-pay/:paymentId', handleSimulatePixPay);

// Admin Routes
import { getAllOrders } from './controllers/orderController';
app.get('/api/orders', getAllOrders);


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
