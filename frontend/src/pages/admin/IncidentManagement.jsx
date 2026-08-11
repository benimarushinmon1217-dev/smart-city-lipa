/**
 * Incident Management Page
 * Admin page for managing all incidents
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Eye,
    Trash2,
    AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    Card,
    Input,
    Select,
    Button,
    Badge,
    Pagination,
    EmptyState,
    Spinner,
} from '../../components/common';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api.config';
import { useSocket } from '../../hooks/useSocket';
import incidentService from '../../services/incidentService';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const IncidentManagement = () => {
    const queryClient = useQueryClient();
    const { on, off, connect } = useSocket();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [severityFilter, setSeverityFilter] = useState('all');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to first page on search
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Fetch incidents using admin endpoint
    const { data: responseData, isLoading, refetch } = useQuery({
        queryKey: ['admin-incidents', page, debouncedSearch, statusFilter, severityFilter],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('limit', 10);
            if (debouncedSearch) params.append('search', debouncedSearch);
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (severityFilter !== 'all') params.append('severity', severityFilter);

            const response = await api.get(`${API_ENDPOINTS.ADMIN.INCIDENTS}?${params}`);
            return response.data;
        },
    });

    // Extract data from response
    // Backend returns: { success: true, data: [...incidents...], pagination: {...} }
    console.log('🚨 [INCIDENT MANAGEMENT] Raw responseData:', responseData);
    console.log('🚨 [INCIDENT MANAGEMENT] responseData type:', typeof responseData);
    console.log('🚨 [INCIDENT MANAGEMENT] Is array?:', Array.isArray(responseData));

    // Try multiple possible structures
    const incidents = Array.isArray(responseData)
        ? responseData
        : (responseData?.incidents || responseData?.data || []);
    const pagination = responseData?.pagination || {};

    console.log('🚨 [INCIDENT MANAGEMENT] Extracted incidents:', incidents);
    console.log('🚨 [INCIDENT MANAGEMENT] Incidents count:', incidents.length);
    console.log('🚨 [INCIDENT MANAGEMENT] Pagination:', pagination);

    // Real-time incident updates - only refetch data, toasts handled by useSocketEvents
    useEffect(() => {
        connect();

        on('incident:new', () => {
            refetch();
            // Toast is handled by useSocketEvents hook
        });

        on('incident:updated', () => {
            refetch();
        });

        on('incident:deleted', () => {
            refetch();
        });

        on('incident:verified', () => {
            refetch();
        });

        return () => {
            off('incident:new');
            off('incident:updated');
            off('incident:deleted');
            off('incident:verified');
        };
    }, [on, off, connect, refetch]);

    // Verify incident mutation
    const verifyMutation = useMutation({
        mutationFn: (id) => api.put(API_ENDPOINTS.ADMIN.VERIFY_INCIDENT(id)),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-incidents']);
            toast.success('Incident verified successfully');
        },
        onError: (error) => {
            console.error('Verify error:', error);
            toast.error(error.response?.data?.message || 'Failed to verify incident');
        },
    });

    // Reject incident mutation
    const rejectMutation = useMutation({
        mutationFn: ({ id, reason }) => api.put(API_ENDPOINTS.ADMIN.REJECT_INCIDENT(id), { reason }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-incidents']);
            toast.success('Incident rejected');
        },
        onError: (error) => {
            console.error('Reject error:', error);
            toast.error(error.response?.data?.message || 'Failed to reject incident');
        },
    });

    // Delete incident mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => incidentService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-incidents']);
            toast.success('Incident deleted successfully');
        },
        onError: (error) => {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete incident');
        },
    });

    const handleVerify = (id) => {
        if (window.confirm('Are you sure you want to verify this incident?')) {
            verifyMutation.mutate(id);
        }
    };

    const handleReject = (id) => {
        const reason = window.prompt('Enter rejection reason:');
        if (reason && reason.trim()) {
            rejectMutation.mutate({ id, reason: reason.trim() });
        }
    };

    const handleDelete = (id) => {
        if (
            window.confirm(
                'Are you sure you want to delete this incident? This action cannot be undone.'
            )
        ) {
            deleteMutation.mutate(id);
        }
    };

    const getSeverityColor = (severity) => {
        const colors = {
            low: 'success',
            medium: 'warning',
            high: 'danger',
            critical: 'danger',
        };
        return colors[severity] || 'default';
    };

    const getStatusColor = (status) => {
        const colors = {
            reported: 'warning',
            pending: 'warning',
            verified: 'success',
            responding: 'info',
            resolved: 'default',
            rejected: 'danger',
            closed: 'default',
        };
        return colors[status] || 'default';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Incident Management</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Review, verify, and manage all reported incidents
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Incidents</p>
                            <p className="mt-2 text-3xl font-bold text-gray-900">
                                {pagination?.total || incidents.length || 0}
                            </p>
                        </div>
                        <AlertTriangle className="h-12 w-12 text-gray-400" />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending Review</p>
                            <p className="mt-2 text-3xl font-bold text-warning-600">
                                {incidents.filter((i) => i.status === 'reported' && !i.is_verified).length || 0}
                            </p>
                        </div>
                        <AlertTriangle className="h-12 w-12 text-warning-400" />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Verified</p>
                            <p className="mt-2 text-3xl font-bold text-success-600">
                                {incidents.filter((i) => i.status === 'verified' || i.is_verified === true).length || 0}
                            </p>
                        </div>
                        <CheckCircle className="h-12 w-12 text-success-400" />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Critical</p>
                            <p className="mt-2 text-3xl font-bold text-danger-600">
                                {incidents.filter((i) => i.severity === 'critical').length || 0}
                            </p>
                        </div>
                        <AlertTriangle className="h-12 w-12 text-danger-400" />
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <Input
                            placeholder="Search incidents..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={Search}
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={[
                            { value: 'all', label: 'All Status' },
                            { value: 'reported', label: 'Reported' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'verified', label: 'Verified' },
                            { value: 'responding', label: 'Responding' },
                            { value: 'resolved', label: 'Resolved' },
                            { value: 'rejected', label: 'Rejected' }
                        ]}
                    />
                    <Select
                        value={severityFilter}
                        onChange={(e) => setSeverityFilter(e.target.value)}
                        options={[
                            { value: 'all', label: 'All Severity' },
                            { value: 'low', label: 'Low' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'high', label: 'High' },
                            { value: 'critical', label: 'Critical' }
                        ]}
                    />
                </div>
            </Card>

            {/* Incidents Table */}
            <Card>
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : !incidents.length ? (
                    <EmptyState
                        icon={AlertTriangle}
                        title="No incidents found"
                        description="No incidents match your current filters"
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Incident
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Severity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reporter
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Time
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {incidents.map((incident) => (
                                    <tr key={incident.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {incident.title}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {incident.barangay?.name || 'Unknown Location'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900 capitalize">
                                                {incident.incident_type?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={getSeverityColor(incident.severity)}>
                                                {incident.severity}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={getStatusColor(incident.status)}>
                                                {incident.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {incident.reporter?.first_name && incident.reporter?.last_name
                                                ? `${incident.reporter.first_name} ${incident.reporter.last_name}`
                                                : incident.reporter_name || 'Anonymous'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {incident.created_at && !isNaN(new Date(incident.created_at).getTime())
                                                ? formatDistanceToNow(new Date(incident.created_at), {
                                                    addSuffix: true,
                                                })
                                                : 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link to={`/incidents/${incident.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {(incident.status === 'reported' && !incident.is_verified) && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleVerify(incident.id)}
                                                            disabled={verifyMutation.isPending}
                                                            title="Verify incident"
                                                        >
                                                            <CheckCircle className="h-4 w-4 text-success-600" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleReject(incident.id)}
                                                            disabled={rejectMutation.isPending}
                                                            title="Reject incident"
                                                        >
                                                            <XCircle className="h-4 w-4 text-danger-600" />
                                                        </Button>
                                                    </>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(incident.id)}
                                                    disabled={deleteMutation.isPending}
                                                    title="Delete incident"
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

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={page}
                            totalPages={pagination.totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </Card>
        </div>
    );
};

export default IncidentManagement;
