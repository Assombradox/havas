import path from 'path';
import dotenv from 'dotenv';

// FORÇAR O CARREGAMENTO COM CAMINHO EXPLÍCITO E DEBUG
const envPath = path.resolve(__dirname, '../.env'); // Assume que server.ts está em src/
const result = dotenv.config({ path: envPath });

console.log('🔍 DEBUG DE AMBIENTE:');
console.log('📂 Diretório atual (CWD):', process.cwd());
console.log('📂 Procurando .env em:', envPath);

if (result.error) {
    console.error('❌ Erro ao carregar .env:', result.error);
} else {
    console.log('✅ Arquivo .env carregado!');
}

console.log('🔑 MONGODB_URI encontrada?', !!process.env.MONGODB_URI ? 'SIM' : 'NÃO');
console.log('---------------------------------------------------');

import app from './app';
import { connectDB } from './config/database';

import healthRouter from './routes/health.routes';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Health Check Route
    app.use('/health', healthRouter);

    // 3. Start Express Server
    app.listen(PORT, () => {
        console.log(`🚀 Backend rodando na porta ${PORT}`);
        console.log(`👉 API Docs (Exemplo): http://localhost:${PORT}/api/pix/create`);
    });
};

startServer();
