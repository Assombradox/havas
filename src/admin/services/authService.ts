export const authService = {
    login: async (password: string) => {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Senha incorreta');
            }
            throw new Error('Erro ao realizar login');
        }

        const data = await response.json();
        return data; // Expected { token: '...' }
    },

    isAuthenticated: () => {
        return localStorage.getItem('adminAuth') === 'true';
    },

    logout: () => {
        localStorage.removeItem('adminAuth');
        window.location.reload();
    }
};
