import { Router } from 'express';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
    try {
        const { password } = req.body;
        const adminSecret = process.env.ADMIN_SECRET;

        // Security check: Ensure secret is set
        if (!adminSecret) {
            console.error('❌ ADMIN_SECRET not defined in .env');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Simple comparison
        if (password === adminSecret) {
            return res.status(200).json({
                success: true,
                token: 'session-valid-admin' // Simple session token for now
            });
        }

        return res.status(401).json({ error: 'Senha incorreta' });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ error: 'Internal Login Error' });
    }
});

export const authRouter = router;
