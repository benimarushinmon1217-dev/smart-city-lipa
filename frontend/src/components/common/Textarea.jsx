/**
 * Textarea Component
 * Reusable textarea field
 */

import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Textarea = forwardRef(({
    label,
    error,
    helperText,
    rows = 4,
    fullWidth = true,
    className,
    containerClassName,
    ...props
}, ref) => {
    return (
        <div className={cn('space-y-1', containerClassName)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {props.required && <span className="text-danger-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                ref={ref}
                rows={rows}
                className={cn(
                    'block px-3 py-2 border rounded-lg shadow-sm transition-colors resize-none',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'disabled:bg-gray-100 disabled:cursor-not-allowed',
                    error
                        ? 'border-danger-300 text-danger-900 placeholder-danger-300 focus:ring-danger-500'
                        : 'border-gray-300 text-gray-900 placeholder-gray-400',
                    fullWidth && 'w-full',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-sm text-danger-600">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';

export default Textarea;
