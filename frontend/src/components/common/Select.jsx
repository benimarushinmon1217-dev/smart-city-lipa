/**
 * Select Component
 * Reusable select dropdown
 */

import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Select = forwardRef(({
    label,
    error,
    helperText,
    options = [],
    placeholder = 'Select an option',
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
            <select
                ref={ref}
                className={cn(
                    'block px-3 py-2 border rounded-lg shadow-sm transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'disabled:bg-gray-100 disabled:cursor-not-allowed',
                    error
                        ? 'border-danger-300 text-danger-900 focus:ring-danger-500'
                        : 'border-gray-300 text-gray-900',
                    fullWidth && 'w-full',
                    className
                )}
                {...props}
            >
                {placeholder && (
                    <option value="">{placeholder}</option>
                )}
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-sm text-danger-600">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
