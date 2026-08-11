/**
 * NotificationBell Component
 * Real-time notification bell with dropdown
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../../hooks/useNotifications';
import { useSocket } from '../../hooks/useSocket';
import { Badge, Button, Spinner } from '../common';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const {
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
    } = useNotifications();

    const { on, off } = useSocket();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Real-time notification updates
    useEffect(() => {
        on('notification:new', () => {
            // Notifications are automatically refetched by the hook
        });

        return () => {
            off('notification:new');
        };
    }, [on, off]);

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
        setIsOpen(false);
    };

    const handleMarkAllRead = () => {
        markAllAsRead();
    };

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all notifications?')) {
            clearAll();
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'alert':
                return '🚨';
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            case 'success':
                return '✅';
            default:
                return '🔔';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'alert':
                return 'bg-danger-50 border-danger-200';
            case 'warning':
                return 'bg-warning-50 border-warning-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            case 'success':
                return 'bg-success-50 border-success-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-danger-600 rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <Badge variant="danger" size="sm">
                                    {unreadCount} new
                                </Badge>
                            )}
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Actions */}
                    {notifications && notifications.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                            <button
                                onClick={handleMarkAllRead}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                            >
                                <Check className="h-4 w-4" />
                                <span>Mark all read</span>
                            </button>
                            <button
                                onClick={handleClearAll}
                                className="text-sm text-gray-600 hover:text-gray-700 font-medium flex items-center space-x-1"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Clear all</span>
                            </button>
                        </div>
                    )}

                    {/* Notification List */}
                    <div className="max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Spinner size="md" />
                            </div>
                        ) : notifications && notifications.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {notifications.slice(0, 10).map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`
                      p-4 hover:bg-gray-50 transition-colors cursor-pointer
                      ${!notification.read ? 'bg-blue-50' : ''}
                    `}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex items-start space-x-3">
                                            {/* Icon */}
                                            <div className={`
                        flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border
                        ${getNotificationColor(notification.type)}
                      `}>
                                                <span className="text-xl">
                                                    {getNotificationIcon(notification.type)}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`
                          text-sm font-medium
                          ${!notification.read ? 'text-gray-900' : 'text-gray-700'}
                        `}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>

                                            {/* Unread Indicator */}
                                            {!notification.read && (
                                                <div className="flex-shrink-0">
                                                    <div className="w-2 h-2 bg-primary-600 rounded-full" />
                                                </div>
                                            )}

                                            {/* Delete Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(notification.id);
                                                }}
                                                className="flex-shrink-0 text-gray-400 hover:text-danger-600 transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No notifications</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications && notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 text-center">
                            <Link
                                to="/notifications"
                                onClick={() => setIsOpen(false)}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                View all notifications
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
