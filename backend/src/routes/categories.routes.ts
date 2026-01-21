import { Router } from 'express';
import { categoriesService } from '../services/categories.service';

const router = Router();

// GET /categories
router.get('/', async (req, res) => {
    try {
        const categories = await categoriesService.getAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /categories/:slug
router.get('/:slug', async (req, res) => {
    try {
        const category = await categoriesService.getBySlug(req.params.slug);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /categories
router.post('/', async (req, res) => {
    try {
        const newCategory = await categoriesService.create(req.body);
        res.status(201).json(newCategory);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /categories/:slug
router.put('/:slug', async (req, res) => {
    try {
        const updatedCategory = await categoriesService.update(req.params.slug, req.body);
        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(updatedCategory);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export const categoriesRouter = router;
