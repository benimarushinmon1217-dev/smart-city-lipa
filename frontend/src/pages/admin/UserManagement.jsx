/**
 * User Management Page
 * Manage users, roles, and permissions
 */

import { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Filter,
    UserCheck,
    UserX,
    Shield,
    Trash2,
    Edit,
    Circle
} from 'lucide-react';
import { Card, Badge, Button, Input, Spinner, Pagination, EmptyState } from '../../components/common';
import { useAdmin } from '../../hooks/useAdmin';
import { useSocket } from '../../hooks/useSocket';
import { formatDistanceToNow } from 'date-fns';

const UserManagement = () => {
    const [filters, setFilters] = useState({
        role: '',
        status: '',
        search: '',
        page: 1,
        limit: 10,
    });

    const [onlineUsers, setOnlineUsers] = useState(new Set());

    const {
        useUsers,
        updateRole,
        activateUser,
        deactivateUser,
        deleteUser,
        isUpdatingRole,
        isActivating,
        isDeactivating,
        isDeletingUser
    } = useAdmin();

    const { data: usersData, isLoading, refetch } = useUsers(filters);
    const { on, off, connect } = useSocket();

    // Extract users array - backend returns { success, data: [...users...], pagination }
    // But API interceptor might unwrap it differently
    console.log('👥 [USER MANAGEMENT] Raw usersData:', usersData);
    console.log('👥 [USER MANAGEMENT] usersData type:', typeof usersData);
    console.log('👥 [USER MANAGEMENT] Is array?:', Array.isArray(usersData));
    console.log('👥 [USER MANAGEMENT] usersData.data:', usersData?.data);
    console.log('👥 [USER MANAGEMENT] usersData.users:', usersData?.users);

    // Try multiple possible structures
    const users = Array.isArray(usersData)
        ? usersData
        : (usersData?.users || usersData?.data || []);
    const pagination = usersData?.pagination;

    console.log('👥 [USER MANAGEMENT] Extracted users:', users);
    console.log('👥 [USER MANAGEMENT] Extracted pagination:', pagination);

    // Real-time user status tracking
    useEffect(() => {
        connect();

        // Listen for user online/offline events
        on('user:online', (data) => {
            setOnlineUsers(prev => new Set([...prev, data.userId]));
            refetch();
        });

        on('user:offline', (data) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(data.userId);
                return newSet;
            });
            refetch();
        });

        // Listen for user updates
        on('user:registered', () => refetch());
        on('user:updated', () => refetch());
        on('user:deleted', () => refetch());

        return () => {
            off('user:online');
            off('user:offline');
            off('user:registered');
            off('user:updated');
            off('user:deleted');
        };
    }, [on, off, connect, refetch]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleRoleChange = (userId, currentRole) => {
        const newRole = window.prompt(
            `Change role for user (current: ${currentRole})\nEnter: user, staff, or admin`,
            currentRole
        );

        if (newRole && ['user', 'staff', 'admin'].includes(newRole.toLowerCase())) {
            updateRole({ userId, role: newRole.toLowerCase() });
        }
    };

    const handleActivate = (userId) => {
        if (window.confirm('Activate this user account?')) {
            activateUser(userId);
        }
    };

    const handleDeactivate = (userId) => {
        if (window.confirm('Deactivate this user account? They will not be able to log in.')) {
            deactivateUser(userId);
        }
    };

    const handleDelete = (userId) => {
        if (window.confirm('Permanently delete this user? This action cannot be undone.')) {
            deleteUser(userId);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                        <Users className="h-8 w-8 text-primary-600" />
                        <span>User Management</span>
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage user accounts, roles, and permissions
                    </p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card padding={false}>
                    <div className="p-4">
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {pagination?.total || users.length || 0}
                        </p>
                    </div>
                </Card>
                <Card padding={false}>
                    <div className="p-4">
                        <p className="text-sm text-gray-600">Active Users</p>
                        <p className="text-2xl font-bold text-success-600 mt-1">
                            {users.filter(u => u.is_active === true).length}
                        </p>
                    </div>
                </Card>
                <Card padding={false}>
                    <div className="p-4">
                        <p className="text-sm text-gray-600">Administrators</p>
                        <p className="text-2xl font-bold text-primary-600 mt-1">
                            {users.filter(u => u.role === 'admin').length}
                        </p>
                    </div>
                </Card>
                <Card padding={false}>
                    <div className="p-4">
                        <p className="text-sm text-gray-600">Inactive</p>
                        <p className="text-2xl font-bold text-gray-600 mt-1">
                            {users.filter(u => u.is_active === false).length}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <Input
                            placeholder="Search users..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            icon={<Search className="h-5 w-5 text-gray-400" />}
                        />
                    </div>
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        value={filters.role}
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="user">User</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                    </select>
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </Card>

            {/* User Table */}
            <Card>
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : users.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="No users found"
                        description="No users match your filters"
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="relative">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                        <span className="text-primary-600 font-medium">
                                                            {user.first_name?.[0]}{user.last_name?.[0]}
                                                        </span>
                                                    </div>
                                                    {/* Online status indicator */}
                                                    {onlineUsers.has(user.id) && (
                                                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-success-500 border-2 border-white rounded-full"
                                                            title="Online">
                                                            <Circle className="h-2 w-2 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fill-current" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.first_name} {user.last_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge
                                                variant={
                                                    user.role === 'admin' ? 'danger' :
                                                        user.role === 'staff' ? 'warning' : 'default'
                                                }
                                            >
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge
                                                variant={user.status === 'active' ? 'success' : 'default'}
                                            >
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRoleChange(user.id, user.role)}
                                                    disabled={isUpdatingRole}
                                                >
                                                    <Shield className="h-4 w-4" />
                                                </Button>
                                                {user.status === 'active' ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeactivate(user.id)}
                                                        disabled={isDeactivating}
                                                    >
                                                        <UserX className="h-4 w-4 text-warning-600" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleActivate(user.id)}
                                                        disabled={isActivating}
                                                    >
                                                        <UserCheck className="h-4 w-4 text-success-600" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={isDeletingUser}
                                                >
                                                    <Trash2 className="h-4 w-4 text-danger-600" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default UserManagement;
