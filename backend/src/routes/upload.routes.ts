import { Router } from 'express';
import { cloudinaryService } from '../services/cloudinary.service';

const router = Router();

// POST /api/upload/from-url
router.post('/from-url', async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ error: 'Image URL is required' });
        }

        const secureUrl = await cloudinaryService.uploadFromUrl(imageUrl);

        res.status(200).json({ url: secureUrl });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Upload failed' });
    }
});

export const uploadRouter = router;
