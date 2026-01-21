export const authService = {
    login: async (password: string) => {
        // TAREFA 1 SIMULATION (Frontend-only Mock for now)
        // In a real scenario, this would POST to /api/auth/login

        // Mocking the "Master Key" check locally for demonstration
        // The real check SHOULD happen on the backend
        if (password === 'admin123') { // Hardcoded for MVP as requested in context of "Auth Simples" logic replacement
            return { token: 'admin-token-secret' };
        }

        // Using fetch if strict backend is needed:
        /*
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        if (!response.ok) throw new Error('Falha no login');
        return response.json();
        */

        throw new Error('Senha incorreta');
    },

    isAuthenticated: () => {
        return localStorage.getItem('adminAuth') === 'true';
    },

    logout: () => {
        localStorage.removeItem('adminAuth');
        window.location.reload();
    }
};
