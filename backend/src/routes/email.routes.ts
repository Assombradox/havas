import { Router } from 'express';
import { handleTestEmail, handleTestPixEmail } from '../controllers/email.controller';

const router = Router();

router.post('/test', handleTestEmail);
router.post('/test-pix', handleTestPixEmail);

export default router;
