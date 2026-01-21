import React, { useEffect } from 'react';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isAuthenticated = authService.isAuthenticated();

    useEffect(() => {
        if (!isAuthenticated) {
            window.history.pushState({}, '', '/admin/login');
            window.dispatchEvent(new Event('popstate'));
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return null; // Or a loading spinner, while redirect happens
    }

    return <>{children}</>;
};

export default ProtectedRoute;
