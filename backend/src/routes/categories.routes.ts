import { Router } from 'express';
import { categoriesService } from '../services/categories.service';

const router = Router();

// GET /categories
router.get('/', (req, res) => {
    try {
        const categories = categoriesService.getAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /categories
router.post('/', (req, res) => {
    try {
        const newCategory = categoriesService.create(req.body);
        res.status(201).json(newCategory);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /categories/:slug
router.put('/:slug', (req, res) => {
    try {
        const updatedCategory = categoriesService.update(req.params.slug, req.body);
        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(updatedCategory);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export const categoriesRouter = router;
