/**
 * Spinner Component
 * Loading spinner
 */

import { cn } from '../../utils/cn';

const Spinner = ({
    size = 'md',
    color = 'primary',
    className,
    ...props
}) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    };

    const colors = {
        primary: 'text-primary-600',
        white: 'text-white',
        gray: 'text-gray-600',
    };

    return (
        <svg
            className={cn('animate-spin', sizes[size], colors[color], className)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            {...props}
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
};

// Full page loading spinner
export const PageSpinner = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Spinner size="xl" />
            {message && (
                <p className="mt-4 text-gray-600">{message}</p>
            )}
        </div>
    );
};

export default Spinner;
