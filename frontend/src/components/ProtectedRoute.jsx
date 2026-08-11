/**
 * Protected Route Component
 * Wrapper for routes that require authentication
 */

import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const ProtectedRoute = ({ children, requireAdmin = false, requireStaff = false }) => {
    const { isAuthenticated, user } = useAuthStore();

    // Check if user is authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check admin requirement
    if (requireAdmin && user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    // Check staff requirement (admin or staff)
    if (requireStaff && !['admin', 'staff'].includes(user?.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
