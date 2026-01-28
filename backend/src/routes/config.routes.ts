import { Router } from 'express';
import { getConfig, updateConfig, sendTestPreview } from '../controllers/configController';

const router = Router();

router.get('/', getConfig);
router.put('/', updateConfig);
router.post('/test-preview', sendTestPreview);

export default router;
