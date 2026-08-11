/**
 * Pagination Component
 * Reusable pagination controls
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    className,
}) => {
    const pages = [];
    const maxVisiblePages = 5;

    // Calculate page range
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    if (totalPages <= 1) return null;

    return (
        <div className={cn('flex items-center justify-center space-x-2', className)}>
            {/* Previous button */}
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={cn(
                    'p-2 rounded-lg border transition-colors',
                    currentPage === 1
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                )}
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            {/* First page */}
            {startPage > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        1
                    </button>
                    {startPage > 2 && (
                        <span className="px-2 text-gray-500">...</span>
                    )}
                </>
            )}

            {/* Page numbers */}
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={cn(
                        'px-3 py-2 rounded-lg border transition-colors',
                        page === currentPage
                            ? 'bg-primary-600 border-primary-600 text-white'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    )}
                >
                    {page}
                </button>
            ))}

            {/* Last page */}
            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && (
                        <span className="px-2 text-gray-500">...</span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* Next button */}
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={cn(
                    'p-2 rounded-lg border transition-colors',
                    currentPage === totalPages
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                )}
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
};

export default Pagination;
