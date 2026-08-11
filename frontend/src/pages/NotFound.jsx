/**
 * 404 Not Found Page
 */

import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <h1 className="text-9xl font-bold text-primary-600">404</h1>
                <h2 className="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
                <p className="mt-4 text-gray-600">
                    Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/dashboard">
                        <Button variant="primary">
                            <Home className="h-5 w-5 mr-2" />
                            Go to Dashboard
                        </Button>
                    </Link>
                    <Button variant="secondary" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
