import { Router } from 'express';
import { productsService } from '../services/products.service';

const router = Router();

// GET /products
router.get('/', async (req, res) => {
    try {
        const products = await productsService.getAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /products/:slug
router.get('/:slug', async (req, res) => {
    try {
        const product = await productsService.getBySlug(req.params.slug);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /products/bulk
router.post('/bulk', async (req, res) => {
    try {
        const products = req.body;
        if (!Array.isArray(products)) {
            return res.status(400).json({ error: 'Body must be an array of products' });
        }
        const createdProducts = await productsService.createBulk(products);
        res.status(201).json({ success: true, count: createdProducts.length });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// POST /products
router.post('/', async (req, res) => {
    try {
        const newProduct = await productsService.create(req.body);
        res.status(201).json(newProduct);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /products/:id
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await productsService.update(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /products/:id
router.delete('/:id', async (req, res) => {
    try {
        const success = await productsService.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export const productsRouter = router;
