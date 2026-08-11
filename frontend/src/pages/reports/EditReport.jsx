/**
 * Edit Report Page
 * Edit an existing report
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, Button, Input, Textarea, Select, Spinner } from '../../components/common';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api.config';
import toast from 'react-hot-toast';

const REPORT_TYPES = [
    { value: '', label: 'Select type', disabled: true },
    { value: 'flood', label: 'Flood Report' },
    { value: 'road_damage', label: 'Road Damage' },
    { value: 'road_blockage', label: 'Road Blockage' },
    { value: 'street_light', label: 'Street Light Issue' },
    { value: 'garbage', label: 'Garbage/Waste Issue' },
    { value: 'water_supply', label: 'Water Supply Issue' },
    { value: 'noise_complaint', label: 'Noise Complaint' },
    { value: 'illegal_activity', label: 'Illegal Activity' },
    { value: 'hazard', label: 'Hazard Report' },
    { value: 'infrastructure', label: 'Infrastructure Issue' },
    { value: 'other', label: 'Other' },
];

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
];

const EditReport = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        report_type: '',
        priority: 'medium',
    });

    // Fetch report details
    const { data: response, isLoading } = useQuery({
        queryKey: ['report', id],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.REPORTS.GET_BY_ID(id));
            return response.data;
        },
    });

    // Extract report from response
    const report = response?.report || response?.data?.report || response;

    // Populate form when report data is loaded
    useEffect(() => {
        if (report && report.id) {
            console.log('📋 [EditReport] Loading report data:', report);
            console.log('📋 [EditReport] Report type:', report.report_type);
            setFormData({
                title: report.title || '',
                description: report.description || '',
                report_type: report.report_type || '',
                priority: report.priority || 'medium',
            });
        }
    }, [report]);

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async (data) => {
            const response = await api.put(API_ENDPOINTS.REPORTS.UPDATE(id), data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Report updated successfully');
            queryClient.invalidateQueries(['report', id]);
            queryClient.invalidateQueries(['reports']);
            navigate(`/reports/${id}`);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update report');
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.report_type) {
            toast.error('Please fill in all required fields');
            return;
        }

        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!report || !report.id) {
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
                        <p className="text-danger-600">Report not found or you don't have permission to edit it.</p>
                    </div>
                </Card>
            </div>
        );
    }

    if (report.status && report.status !== 'pending') {
        return (
            <div className="space-y-6">
                <Link to={`/reports/${id}`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Report
                    </Button>
                </Link>
                <Card>
                    <div className="text-center py-12">
                        <p className="text-warning-600">
                            Only pending reports can be edited. This report is {report.status}.
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link to={`/reports/${id}`}>
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Report
                </Button>
            </Link>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Report</h1>
                <p className="mt-1 text-sm text-gray-600">Update your report information</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title <span className="text-danger-600">*</span>
                            </label>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Brief title of the report"
                                required
                            />
                        </div>

                        {/* Report Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Report Type <span className="text-danger-600">*</span>
                            </label>
                            <Select
                                name="report_type"
                                value={formData.report_type}
                                onChange={handleChange}
                                options={REPORT_TYPES}
                                required
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <Select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                options={PRIORITY_OPTIONS}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description <span className="text-danger-600">*</span>
                            </label>
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Detailed description of the issue"
                                rows={6}
                                required
                            />
                        </div>
                    </div>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3">
                    <Link to={`/reports/${id}`}>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={updateMutation.isPending}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditReport;
