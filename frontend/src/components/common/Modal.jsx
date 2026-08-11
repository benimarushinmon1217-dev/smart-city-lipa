/**
 * Modal Component
 * Reusable modal dialog
 */

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeButton = true,
    className,
}) => {
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-7xl',
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className={cn(
                                    'w-full transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all',
                                    sizes[size],
                                    className
                                )}
                            >
                                {/* Header */}
                                {(title || closeButton) && (
                                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                        {title && (
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-semibold text-gray-900"
                                            >
                                                {title}
                                            </Dialog.Title>
                                        )}
                                        {closeButton && (
                                            <button
                                                type="button"
                                                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                onClick={onClose}
                                            >
                                                <span className="sr-only">Close</span>
                                                <X className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Body */}
                                <div className="px-6 py-4">{children}</div>

                                {/* Footer */}
                                {footer && (
                                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                                        {footer}
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
