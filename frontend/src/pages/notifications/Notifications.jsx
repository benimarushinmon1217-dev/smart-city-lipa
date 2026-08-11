/**
 * Notifications Page
 * Full page view of all notifications
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Bell,
    CheckCheck,
    Trash2,
    AlertTriangle,
    Info,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import {
    Card,
    Button,
    Badge,
    EmptyState,
    Spinner,
    Select,
} from '../../components/common';
import { notificationService } from '../../services/notificationService';
import { useSocket } from '../../hooks/useSocket';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState('all');
    const { on, off, connect } = useSocket();

    // Fetch notifications
    const { data: notificationsResponse, isLoading, refetch } = useQuery({
        queryKey: ['notifications'],
        queryFn: notificationService.getAll,
    });

    // Real-time updates
    useEffect(() => {
        connect();

        on('notification:new', (data) => {
            console.log('🔔 [NOTIFICATIONS] New notification:', data);
            refetch();
            // Toast is handled by useSocketEvents hook - don't show duplicate
        });

        return () => {
            off('notification:new');
        };
    }, [on, off, connect, refetch]);

    // Extract notifications array from response
    // Backend ApiResponse.paginated returns: { success, message, data: [...array...], pagination }
    // After API interceptor unwraps response.data, we get: { success, message, data: [...array...], pagination }
    // So notifications array is directly in notificationsResponse.data
    const notifications = Array.isArray(notificationsResponse?.data)
        ? notificationsResponse.data
        : [];

    // Mark as read mutation
    const markAsReadMutation = useMutation({
        mutationFn: (id) => notificationService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
        },
    });

    // Mark all as read mutation
    const markAllAsReadMutation = useMutation({
        mutationFn: notificationService.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
            toast.success('All notifications marked as read');
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => notificationService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
            toast.success('Notification deleted');
        },
    });

    // Clear all mutation
    const clearAllMutation = useMutation({
        mutationFn: notificationService.clearAll,
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
            toast.success('All notifications cleared');
        },
    });

    const handleMarkAsRead = (id) => {
        markAsReadMutation.mutate(id);
    };

    const handleDelete = (id) => {
        deleteMutation.mutate(id);
    };

    const handleMarkAllAsRead = () => {
        markAllAsReadMutation.mutate();
    };

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all notifications?')) {
            clearAllMutation.mutate();
        }
    };

    const getIcon = (type) => {
        const icons = {
            alert: AlertTriangle,
            warning: AlertCircle,
            info: Info,
            success: CheckCircle,
        };
        return icons[type] || Bell;
    };

    const getIconColor = (type) => {
        const colors = {
            alert: 'text-danger-600',
            warning: 'text-warning-600',
            info: 'text-blue-600',
            success: 'text-success-600',
        };
        return colors[type] || 'text-gray-600';
    };

    const getBgColor = (type) => {
        const colors = {
            alert: 'bg-danger-50',
            warning: 'bg-warning-50',
            info: 'bg-blue-50',
            success: 'bg-success-50',
        };
        return colors[type] || 'bg-gray-50';
    };

    const filteredNotifications = notifications?.filter((notif) => {
        if (filter === 'unread') return !(notif.is_read || notif.read);
        if (filter === 'read') return notif.is_read || notif.read;
        return true;
    });

    const unreadCount = notifications?.filter((n) => !(n.is_read || n.read)).length || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        {unreadCount > 0
                            ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                            : 'All caught up!'}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    {unreadCount > 0 && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            disabled={markAllAsReadMutation.isPending}
                        >
                            <CheckCheck className="h-4 w-4 mr-2" />
                            Mark All Read
                        </Button>
                    )}
                    {notifications?.length > 0 && (
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleClearAll}
                            disabled={clearAllMutation.isPending}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear All
                        </Button>
                    )}
                </div>
            </div>

            {/* Filter */}
            <Card>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${filter === 'all'
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            All ({notifications?.length || 0})
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${filter === 'unread'
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Unread ({unreadCount})
                        </button>
                        <button
                            onClick={() => setFilter('read')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${filter === 'read'
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Read ({(notifications?.length || 0) - unreadCount})
                        </button>
                    </div>
                </div>
            </Card>

            {/* Notifications List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Spinner size="lg" />
                </div>
            ) : !filteredNotifications?.length ? (
                <Card>
                    <EmptyState
                        icon={Bell}
                        title="No notifications"
                        description={
                            filter === 'unread'
                                ? 'You have no unread notifications'
                                : filter === 'read'
                                    ? 'You have no read notifications'
                                    : 'You have no notifications yet'
                        }
                    />
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredNotifications.map((notification) => {
                        const Icon = getIcon(notification.type);
                        return (
                            <Card
                                key={notification.id}
                                className={`${!(notification.is_read || notification.read) ? 'border-l-4 border-l-primary-500' : ''
                                    }`}
                            >
                                <div className="flex items-start space-x-4">
                                    {/* Icon */}
                                    <div
                                        className={`flex-shrink-0 h-10 w-10 rounded-full ${getBgColor(
                                            notification.type
                                        )} flex items-center justify-center`}
                                    >
                                        <Icon className={`h-5 w-5 ${getIconColor(notification.type)}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {notification.title}
                                                </p>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {notification.message}
                                                </p>
                                                <p className="mt-2 text-xs text-gray-500">
                                                    {notification.created_at || notification.createdAt
                                                        ? formatDistanceToNow(
                                                            new Date(notification.created_at || notification.createdAt),
                                                            { addSuffix: true }
                                                        )
                                                        : 'Just now'}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2 ml-4">
                                                {!(notification.is_read || notification.read) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        disabled={markAsReadMutation.isPending}
                                                    >
                                                        <CheckCheck className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(notification.id)}
                                                    disabled={deleteMutation.isPending}
                                                >
                                                    <Trash2 className="h-4 w-4 text-danger-600" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Notifications;
