import { Router } from 'express';
import { bannersService } from '../services/banners.service';

const router = Router();

// GET /api/banners/public
router.get('/public', async (req, res) => {
    try {
        const { location } = req.query;
        if (!location) return res.status(400).json({ error: 'Location required' });

        const banners = await bannersService.getPublic(location as string);
        res.json(banners);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch public banners' });
    }
});

// ADMIN ROUTES

// GET /api/banners (List all)
router.get('/', async (req, res) => {
    try {
        const banners = await bannersService.getAll();
        res.json(banners);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch banners' });
    }
});

// POST /api/banners
router.post('/', async (req, res) => {
    try {
        const banner = await bannersService.create(req.body);
        res.status(201).json(banner);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create banner' });
    }
});

// PUT /api/banners/:id
router.put('/:id', async (req, res) => {
    try {
        const banner = await bannersService.update(req.params.id, req.body);
        if (!banner) return res.status(404).json({ error: 'Banner not found' });
        res.json(banner);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update banner' });
    }
});

// DELETE /api/banners/:id
router.delete('/:id', async (req, res) => {
    try {
        await bannersService.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete banner' });
    }
});

export default router;
