/**
 * Report Details Page
 * View detailed information about a report
 */

import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit, Trash2, MapPin, Calendar, User, FileText } from 'lucide-react';
import { Card, Badge, Button, Spinner } from '../../components/common';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api.config';
import { useAuthStore } from '../../stores/authStore';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const ReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    // Fetch report details
    const { data: response, isLoading, error } = useQuery({
        queryKey: ['report', id],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.REPORTS.GET_BY_ID(id));
            console.log('📥 [ReportDetails] API response:', response);
            console.log('📥 [ReportDetails] Report data:', response.data);
            return response.data;
        },
    });

    // Extract report from response
    const report = response?.report || response?.data?.report || response;

    console.log('📋 [ReportDetails] Extracted report:', report);
    console.log('📋 [ReportDetails] Report fields:', {
        id: report?.id,
        title: report?.title,
        description: report?.description,
        report_type: report?.report_type,
        type: report?.type,
        created_at: report?.created_at,
        user: report?.user
    });

    if (!report?.report_type && !report?.type) {
        console.warn('⚠️ [ReportDetails] Report type is missing!');
    }

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async () => {
            await api.delete(API_ENDPOINTS.REPORTS.DELETE(id));
        },
        onSuccess: () => {
            toast.success('Report deleted successfully');
            queryClient.invalidateQueries(['reports']);
            navigate('/reports');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete report');
        },
    });

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            deleteMutation.mutate();
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        console.error('❌ [ReportDetails] Error loading report:', error);
        return (
            <div className="space-y-6">
                <Link to="/reports">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Reports
                    </Button>
                </Link>
                <Card>
                    <div className="text-center py-12">
                        <p className="text-danger-600">
                            {error.response?.data?.message || 'Failed to load report. Please try again.'}
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    if (!report || !report.id) {
        console.warn('⚠️ [ReportDetails] No report data:', { response, report });
        return (
            <div className="space-y-6">
                <Link to="/reports">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Reports
                    </Button>
                </Link>
                <Card>
                    <div className="text-center py-12">
                        <p className="text-danger-600">Report not found or you don't have permission to view it.</p>
                    </div>
                </Card>
            </div>
        );
    }

    const canEdit = user?.id === report.user_id || user?.role === 'admin' || user?.role === 'staff';
    const canDelete = user?.id === report.user_id || user?.role === 'admin';

    const getStatusColor = (status) => {
        const colors = {
            pending: 'warning',
            verified: 'success',
            in_progress: 'info',
            resolved: 'default',
            rejected: 'danger',
        };
        return colors[status] || 'default';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'success',
            medium: 'warning',
            high: 'danger',
            urgent: 'danger',
        };
        return colors[priority] || 'default';
    };

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link to="/reports">
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Reports
                </Button>
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-3 flex-wrap">
                        <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
                        <Badge variant={getStatusColor(report.status)}>{report.status}</Badge>
                        {report.priority && (
                            <Badge variant={getPriorityColor(report.priority)}>
                                {report.priority} priority
                            </Badge>
                        )}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Report ID: #{report.id}</p>
                </div>
                <div className="flex items-center space-x-2">
                    {canEdit && report.status === 'pending' && (
                        <Link to={`/reports/${id}/edit`}>
                            <Button variant="secondary" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </Link>
                    )}
                    {canDelete && (
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    )}
                </div>
            </div>

            {/* Description */}
            <Card title="Description">
                <p className="text-gray-700 whitespace-pre-wrap">{report.description}</p>
            </Card>

            {/* Report Information */}
            <Card title="Report Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 mb-1">
                            <FileText className="h-4 w-4" />
                            <span>Type</span>
                        </div>
                        <p className="text-sm text-gray-900 capitalize">
                            {(report.report_type || report.type)
                                ? (report.report_type || report.type).replace(/_/g, ' ')
                                : 'Not specified'}
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 mb-1">
                            <MapPin className="h-4 w-4" />
                            <span>Location</span>
                        </div>
                        <p className="text-sm text-gray-900">
                            {report.barangay?.name || report.location || 'Not specified'}
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 mb-1">
                            <User className="h-4 w-4" />
                            <span>Reported By</span>
                        </div>
                        <p className="text-sm text-gray-900">
                            {report.is_anonymous
                                ? 'Anonymous'
                                : report.user
                                    ? `${report.user.first_name} ${report.user.last_name}`
                                    : report.reporter_name || 'Unknown'}
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 mb-1">
                            <Calendar className="h-4 w-4" />
                            <span>Submitted</span>
                        </div>
                        {(report.created_at || report.createdAt) ? (
                            <>
                                <p className="text-sm text-gray-900">
                                    {formatDistanceToNow(new Date(report.created_at || report.createdAt), {
                                        addSuffix: true,
                                    })}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(report.created_at || report.createdAt).toLocaleString()}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">Date not available</p>
                        )}
                    </div>
                </div>
            </Card>

            {/* Images */}
            {report.images && report.images.length > 0 && (
                <Card title="Images">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {report.images.map((image, index) => (
                            <img
                                key={index}
                                src={`${import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'}${image}`}
                                alt={`Report image ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        ))}
                    </div>
                </Card>
            )}

            {/* Resolution Notes */}
            {report.resolution_notes && (
                <Card title="Resolution Notes">
                    <p className="text-gray-700 whitespace-pre-wrap">{report.resolution_notes}</p>
                    {report.resolved_at && (
                        <p className="text-xs text-gray-500 mt-2">
                            Resolved {(() => {
                                try {
                                    return formatDistanceToNow(new Date(report.resolved_at), { addSuffix: true });
                                } catch (e) {
                                    return 'recently';
                                }
                            })()}
                        </p>
                    )}
                </Card>
            )}

            {/* Assigned To */}
            {report.assignedUser && (
                <Card title="Assigned To">
                    <p className="text-sm text-gray-900">
                        {report.assignedUser.first_name} {report.assignedUser.last_name}
                    </p>
                </Card>
            )}
        </div>
    );
};

export default ReportDetails;
