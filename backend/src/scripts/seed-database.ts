import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import Product from '../models/Product';
import Category from '../models/Category';

// Import raw JSON data
import productsDataRaw from '../../data/products.json';
import categoriesDataRaw from '../../data/categories.json';

dotenv.config();

const generateId = () => Math.random().toString(36).substr(2, 9);

const sanitizeCategories = (data: any[]): any[] => {
    return data.map((item, index) => {
        if (typeof item === 'string') {
            const slug = item.toLowerCase().replace(/\s+/g, '-');
            return {
                id: slug,
                name: item,
                slug: slug,
                image: 'default-placeholder', // Field required by schema
                type: 'category'
            };
        }

        // Handle generic object
        const cat = { ...item };

        // Fix ID
        if (!cat.id) {
            cat.id = cat.slug || generateId();
        }

        // Fix Name (Schema uses 'name', JSON uses 'title')
        if (!cat.name && cat.title) {
            cat.name = cat.title;
        }
        if (!cat.name) {
            cat.name = `Category ${index + 1}`;
        }

        // Fix Type (Schema enum: 'category' | 'collection')
        if (!['category', 'collection'].includes(cat.type)) {
            cat.type = 'category';
        }

        // Ensure Image (Required)
        if (!cat.image) {
            cat.image = 'category-default';
        }

        return {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            image: cat.image, // <--- OBRIGATÓRIO INCLUIR ISSO
            type: cat.type
        };
    });
};

const sanitizeProducts = (data: any[]): any[] => {
    return data.map(item => {
        const prod = { ...item };

        // Ensure ID is string
        if (prod.id) prod.id = String(prod.id);

        // Ensure numbers
        if (prod.price) prod.price = Number(prod.price);
        if (prod.originalPrice) prod.originalPrice = Number(prod.originalPrice);
        if (prod.rating) prod.rating = Number(prod.rating);
        if (prod.reviewCount) prod.reviewCount = Number(prod.reviewCount);

        // Sanitize Colors and Sizes if necessary
        // (Assuming checking for basic required fields is enough for now)

        return prod;
    });
};

const importData = async () => {
    try {
        console.log('🚀 Iniciando Migração para MongoDB (Com Sanitização)...');
        await connectDB();

        // 1. Diagnostics
        console.log('🔍 Exemplo de Categoria (Raw):', JSON.stringify(categoriesDataRaw[0], null, 2));

        // 2. Sanitization
        // Check for .default wrapping just in case of weird import behavior
        const catsPayload = (categoriesDataRaw as any).default || categoriesDataRaw;
        const prodsPayload = (productsDataRaw as any).default || productsDataRaw;

        const sanitizedCategories = sanitizeCategories(Array.isArray(catsPayload) ? catsPayload : []);
        const sanitizedProducts = sanitizeProducts(Array.isArray(prodsPayload) ? prodsPayload : []);

        console.log(`📝 Preparado para inserir: ${sanitizedCategories.length} categorais, ${sanitizedProducts.length} produtos.`);

        // 3. Clear & Insert
        console.log('🧹 Limpando coleções antigas...');
        await Product.deleteMany({});
        await Category.deleteMany({});

        console.log('📦 Inserindo Categorias...');
        await Category.insertMany(sanitizedCategories);

        console.log('📦 Inserindo Produtos...');
        await Product.insertMany(sanitizedProducts);

        console.log('✅ Dados migrados com sucesso!');
        process.exit();
    } catch (error) {
        console.error('❌ Erro na migração:', error);
        process.exit(1);
    }
};

importData();
