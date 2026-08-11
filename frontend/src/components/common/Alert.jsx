/**
 * Alert Component
 * Alert messages and notifications
 */

import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

const Alert = ({
    children,
    variant = 'info',
    title,
    onClose,
    className,
    ...props
}) => {
    const variants = {
        info: {
            container: 'bg-blue-50 border-blue-200 text-blue-800',
            icon: <Info className="h-5 w-5 text-blue-400" />,
        },
        success: {
            container: 'bg-success-50 border-success-200 text-success-800',
            icon: <CheckCircle className="h-5 w-5 text-success-400" />,
        },
        warning: {
            container: 'bg-warning-50 border-warning-200 text-warning-800',
            icon: <AlertTriangle className="h-5 w-5 text-warning-400" />,
        },
        danger: {
            container: 'bg-danger-50 border-danger-200 text-danger-800',
            icon: <AlertCircle className="h-5 w-5 text-danger-400" />,
        },
    };

    const { container, icon } = variants[variant];

    return (
        <div
            className={cn(
                'rounded-lg border p-4',
                container,
                className
            )}
            role="alert"
            {...props}
        >
            <div className="flex">
                <div className="flex-shrink-0">{icon}</div>
                <div className="ml-3 flex-1">
                    {title && (
                        <h3 className="text-sm font-medium mb-1">{title}</h3>
                    )}
                    <div className="text-sm">{children}</div>
                </div>
                {onClose && (
                    <div className="ml-auto pl-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex rounded-md p-1.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2"
                        >
                            <span className="sr-only">Dismiss</span>
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Alert;
