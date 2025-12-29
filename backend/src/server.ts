import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Backend rodando na porta ${PORT}`);
    console.log(`👉 API Docs (Exemplo): http://localhost:${PORT}/api/pix/create`);
});
