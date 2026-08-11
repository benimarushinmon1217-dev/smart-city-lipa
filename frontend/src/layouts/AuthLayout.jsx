/**
 * Auth Layout
 * Layout for authentication pages (login, register)
 */

import { Outlet, Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { APP_NAME } from '../utils/constants';

const AuthLayout = () => {
    const { isAuthenticated } = useAuthStore();

    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary-600 mb-2">
                        {APP_NAME}
                    </h1>
                    <p className="text-gray-600">
                        Hazard-Aware Evacuation & Decision Support
                    </p>
                </div>

                {/* Auth Form Card */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <Outlet />
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-gray-600">
                    <p>&copy; 2024 {APP_NAME}. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
