import { Router } from 'express';
import { productsService } from '../services/products.service';

const router = Router();

// GET /products
router.get('/', (req, res) => {
    try {
        const products = productsService.getAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /products/:slug
router.get('/:slug', (req, res) => {
    try {
        const product = productsService.getBySlug(req.params.slug);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /products
router.post('/', (req, res) => {
    try {
        const newProduct = productsService.create(req.body);
        res.status(201).json(newProduct);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /products/:id
router.put('/:id', (req, res) => {
    try {
        const updatedProduct = productsService.update(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export const productsRouter = router;
