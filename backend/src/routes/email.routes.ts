import { Router } from 'express';
import { handleTestEmail } from '../controllers/email.controller';

const router = Router();

router.post('/test', handleTestEmail);

export default router;
