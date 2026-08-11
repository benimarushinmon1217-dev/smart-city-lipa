/**
 * Badge Component
 * Status badges and labels
 */

import { cn } from '../../utils/cn';

const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    rounded = true,
    className,
    ...props
}) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-primary-100 text-primary-800',
        success: 'bg-success-100 text-success-800',
        warning: 'bg-warning-100 text-warning-800',
        danger: 'bg-danger-100 text-danger-800',
        info: 'bg-blue-100 text-blue-800',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center font-medium',
                rounded ? 'rounded-full' : 'rounded',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
