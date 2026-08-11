/**
 * Error Boundary Component
 * Catches and handles React errors gracefully
 */

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './common';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });

        // Log to error reporting service (e.g., Sentry)
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleGoHome = () => {
        window.location.href = '/dashboard';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                    <div className="max-w-md w-full">
                        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                            {/* Icon */}
                            <div className="flex justify-center mb-4">
                                <div className="h-16 w-16 rounded-full bg-danger-100 flex items-center justify-center">
                                    <AlertTriangle className="h-8 w-8 text-danger-600" />
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Oops! Something went wrong
                            </h1>

                            {/* Description */}
                            <p className="text-gray-600 mb-6">
                                We're sorry for the inconvenience. An unexpected error occurred.
                            </p>

                            {/* Error Details (Development Only) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                                    <p className="text-xs font-mono text-danger-600 break-all">
                                        {this.state.error.toString()}
                                    </p>
                                    {this.state.errorInfo && (
                                        <details className="mt-2">
                                            <summary className="text-xs text-gray-600 cursor-pointer">
                                                Stack trace
                                            </summary>
                                            <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-40">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button onClick={this.handleReset} variant="primary">
                                    <RefreshCw className="h-5 w-5 mr-2" />
                                    Try Again
                                </Button>
                                <Button onClick={this.handleGoHome} variant="secondary">
                                    <Home className="h-5 w-5 mr-2" />
                                    Go to Dashboard
                                </Button>
                            </div>

                            {/* Support Info */}
                            <p className="mt-6 text-xs text-gray-500">
                                If this problem persists, please contact support.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
