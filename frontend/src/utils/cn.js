/**
 * Class Name Utility
 * Merge Tailwind classes with clsx and tailwind-merge
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with proper Tailwind CSS precedence
 * @param {...any} inputs - Class names to merge
 * @returns {string} Merged class names
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default cn;
