/**
 * ReportManagement Component
 * Admin page for managing and moderating reports
 */

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Filter, Search, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import { Card, Badge, Button, EmptyState, Spinner } from '../../components/common';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../../hooks/useSocket';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api.config';
import toast from 'react-hot-toast';

const ReportManagement = () => {
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);

    // Fetch reports using admin endpoint
    const { data: responseData, isLoading, refetch } = useQuery({
        queryKey: ['admin-reports', page, statusFilter, searchQuery],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('limit', 10);
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (searchQuery) params.append('search', searchQuery);

            const response = await api.get(`${API_ENDPOINTS.ADMIN.REPORTS}?${params}`);
            console.log('📋 [REPORT MANAGEMENT] Raw responseData:', response.data);
            return response.data;
        },
    });

    // Extract data from response
    const reports = Array.isArray(responseData)
        ? responseData
        : (responseData?.reports || responseData?.data || []);
    const pagination = responseData?.pagination || {};

    console.log('📋 [REPORT MANAGEMENT] Extracted reports:', reports);
    console.log('📋 [REPORT MANAGEMENT] Reports count:', reports.length);

    const { on, off, connect } = useSocket();

    // Verify report mutation
    const verifyMutation = useMutation({
        mutationFn: (id) => api.post(API_ENDPOINTS.REPORTS.VERIFY(id)),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-reports']);
            toast.success('Report verified successfully');
        },
        onError: (error) => {
            console.error('Verify error:', error);
            toast.error(error.response?.data?.message || 'Failed to verify report');
        },
    });

    // Reject report mutation
    const rejectMutation = useMutation({
        mutationFn: ({ id, reason }) => api.post(API_ENDPOINTS.REPORTS.REJECT(id), { reason }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-reports']);
            toast.success('Report rejected');
        },
        onError: (error) => {
            console.error('Reject error:', error);
            toast.error(error.response?.data?.message || 'Failed to reject report');
        },
    });

    // Delete report mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(API_ENDPOINTS.REPORTS.DELETE(id)),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-reports']);
            toast.success('Report deleted successfully');
        },
        onError: (error) => {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete report');
        },
    });

    // Real-time report updates - only refetch data, toasts handled by useSocketEvents
    useEffect(() => {
        connect();

        on('report:new', () => {
            refetch();
            // Toast is handled by useSocketEvents hook
        });

        on('report:verified', () => {
            refetch();
        });

        on('report:rejected', () => {
            refetch();
        });

        on('report:updated', () => {
            refetch();
        });

        on('report:deleted', () => {
            refetch();
        });

        return () => {
            off('report:new');
            off('report:verified');
            off('report:rejected');
            off('report:updated');
            off('report:deleted');
        };
    }, [on, off, connect, refetch]);

    const handleVerify = (reportId) => {
        if (window.confirm('Verify this report?')) {
            verifyMutation.mutate(reportId);
        }
    };

    const handleReject = (reportId) => {
        const reason = window.prompt('Enter rejection reason:');
        if (reason && reason.trim()) {
            rejectMutation.mutate({ id: reportId, reason: reason.trim() });
        }
    };

    const handleDelete = (reportId) => {
        if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            deleteMutation.mutate(reportId);
        }
    };

    // Filter reports by search query
    const filteredReports = reports?.filter(report =>
        report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            verified: 'success',
            rejected: 'danger',
            in_progress: 'info',
            resolved: 'default',
        };
        return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
    };

    const stats = {
        total: pagination?.total || reports?.length || 0,
        pending: reports?.filter(r => r.status === 'pending').length || 0,
        verified: reports?.filter(r => r.status === 'verified').length || 0,
        rejected: reports?.filter(r => r.status === 'rejected').length || 0,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Report Management</h1>
                <p className="text-gray-600 mt-1">Review and moderate user-submitted reports</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Reports</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-gray-400" />
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-warning-600">{stats.pending}</p>
                        </div>
                        <Clock className="h-8 w-8 text-warning-400" />
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Verified</p>
                            <p className="text-2xl font-bold text-success-600">{stats.verified}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-success-400" />
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Rejected</p>
                            <p className="text-2xl font-bold text-danger-600">{stats.rejected}</p>
                        </div>
                        <XCircle className="h-8 w-8 text-danger-400" />
                    </div>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="verified">Verified</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Reports List */}
            <Card>
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : filteredReports.length === 0 ? (
                    <EmptyState
                        icon={AlertTriangle}
                        title="No reports found"
                        description={searchQuery ? "Try adjusting your search" : "No reports match the selected filters"}
                    />
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredReports.map((report) => (
                            <div
                                key={report.id}
                                className="p-4 transition-colors hover:bg-gray-50"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {report.title}
                                            </h3>
                                            {getStatusBadge(report.status)}
                                        </div>

                                        <p className="text-gray-600 mb-3">
                                            {report.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Badge variant="default" size="sm">
                                                    {report.report_type || report.type}
                                                </Badge>
                                            </div>
                                            {report.barangay && (
                                                <span>📍 {report.barangay.name}</span>
                                            )}
                                            {report.user && (
                                                <span>👤 {report.user.first_name} {report.user.last_name}</span>
                                            )}
                                            {report.reporter_name && !report.user && (
                                                <span>👤 {report.reporter_name}</span>
                                            )}
                                            <span>
                                                🕒 {report.created_at && !isNaN(new Date(report.created_at).getTime())
                                                    ? formatDistanceToNow(new Date(report.created_at), { addSuffix: true })
                                                    : report.createdAt && !isNaN(new Date(report.createdAt).getTime())
                                                        ? formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })
                                                        : 'Unknown'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center space-x-2 ml-4">
                                        {report.status === 'pending' && (
                                            <>
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleVerify(report.id)}
                                                    disabled={verifyMutation.isPending}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Verify
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleReject(report.id)}
                                                    disabled={rejectMutation.isPending}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                        <Link to={`/reports/${report.id}`}>
                                            <Button variant="secondary" size="sm">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(report.id)}
                                            disabled={deleteMutation.isPending}
                                            title="Delete report"
                                        >
                                            <Trash2 className="h-4 w-4 text-danger-600" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ReportManagement;
