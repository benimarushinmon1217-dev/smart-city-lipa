/**
 * Card Component
 * Reusable card container
 */

import { cn } from '../../utils/cn';

const Card = ({
    children,
    title,
    subtitle,
    footer,
    padding = true,
    hover = false,
    className,
    ...props
}) => {
    return (
        <div
            className={cn(
                'bg-white rounded-lg shadow-sm border border-gray-200',
                hover && 'transition-shadow hover:shadow-md',
                className
            )}
            {...props}
        >
            {(title || subtitle) && (
                <div className={cn('border-b border-gray-200', padding && 'px-6 py-4')}>
                    {title && (
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    )}
                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                    )}
                </div>
            )}

            <div className={cn(padding && 'p-6')}>
                {children}
            </div>

            {footer && (
                <div className={cn('border-t border-gray-200 bg-gray-50', padding && 'px-6 py-4')}>
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
