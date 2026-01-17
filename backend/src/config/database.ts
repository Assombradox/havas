import mongoose from 'mongoose';

export const connectDB = async () => {
    // A leitura acontece APENAS quando a função é chamada, garantindo que o dotenv já carregou
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error('❌ MONGODB_URI não definida no .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log('🔥 MongoDB Conectado!');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1);
    }
};
