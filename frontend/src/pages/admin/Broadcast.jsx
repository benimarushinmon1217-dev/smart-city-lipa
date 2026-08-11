/**
 * Broadcast Page
 * Send emergency alerts and announcements
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Radio, Send, AlertTriangle, Bell, Info, Users } from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/common';
import { useAdmin } from '../../hooks/useAdmin';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api.config';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const ALERT_TYPES = [
    { value: 'emergency', label: '🚨 Emergency Alert', color: 'danger' },
    { value: 'warning', label: '⚠️ Warning', color: 'warning' },
    { value: 'info', label: 'ℹ️ Information', color: 'default' },
    { value: 'evacuation', label: '🏃 Evacuation Order', color: 'danger' },
];

const ALERT_PRIORITIES = [
    { value: 'urgent', label: 'Critical', color: 'danger' },
    { value: 'high', label: 'High', color: 'warning' },
    { value: 'medium', label: 'Medium', color: 'default' },
    { value: 'low', label: 'Low', color: 'success' },
];

const Broadcast = () => {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'emergency',
        priority: 'urgent',
        target: 'all',
        barangayId: '',
    });

    const { sendEmergencyAlert, isSendingAlert } = useAdmin();

    // Fetch recent broadcasts - use announcements endpoint as fallback
    const { data: broadcastsData } = useQuery({
        queryKey: ['recent-broadcasts'],
        queryFn: async () => {
            try {
                const response = await api.get(API_ENDPOINTS.ANNOUNCEMENTS.LIST, {
                    params: { limit: 10, sortBy: 'createdAt', sortOrder: 'DESC' },
                });
                return response.data;
            } catch (error) {
                console.error('Failed to fetch broadcasts:', error);
                return { data: [] };
            }
        },
        retry: false,
    });

    const recentBroadcasts = broadcastsData?.data || [];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.message) {
            toast.error('Please fill in all required fields');
            return;
        }

        const confirmed = window.confirm(
            `⚠️ CONFIRM BROADCAST\n\nType: ${formData.type.toUpperCase()}\nPriority: ${formData.priority.toUpperCase()}\nTarget: ${formData.target === 'all' ? 'ALL USERS (CITY-WIDE)' : 'Selected Recipients'}\n\nThis alert will be sent immediately.\n\nAre you sure?`
        );

        if (!confirmed) return;

        // Try admin alert endpoint first, fallback to announcements
        try {
            // Backend expects 'content' not 'message'
            // Backend expects 'specific_barangay' not 'barangay'
            const alertData = {
                title: formData.title,
                content: formData.message, // Backend uses 'content'
                type: formData.type,
                priority: formData.priority,
                target_audience: formData.target === 'barangay' ? 'specific_barangay' : formData.target,
                is_active: true,
            };

            // Only add target_barangays if targeting specific barangay
            if (formData.target === 'barangay' && formData.barangayId) {
                alertData.target_barangays = JSON.stringify([parseInt(formData.barangayId)]);
            }

            console.log('📡 [BROADCAST] Sending alert:', alertData);

            await api.post(API_ENDPOINTS.ADMIN.EMERGENCY_ANNOUNCEMENT, alertData);

            // Manually trigger emergency modal for urgent/emergency alerts
            if (alertData.priority === 'urgent' || alertData.type === 'emergency' || alertData.type === 'evacuation') {
                console.log('🚨 [BROADCAST] Manually triggering emergency modal');
                window.dispatchEvent(new CustomEvent('emergency-alert', {
                    detail: {
                        announcement: alertData,
                        timestamp: new Date().toISOString()
                    }
                }));
            }

            setFormData({
                title: '',
                message: '',
                type: 'emergency',
                priority: 'urgent',
                target: 'all',
                barangayId: '',
            });

            toast.success('✅ Emergency alert sent successfully!', {
                duration: 5000,
                icon: '🚨',
            });

            // Show confirmation that broadcast was sent
            setTimeout(() => {
                toast.success(`📡 Broadcast delivered to ${formData.target === 'all' ? 'ALL USERS' : 'selected recipients'}`, {
                    duration: 3000,
                });
            }, 1000);
        } catch (error) {
            console.error('Send alert error:', error);
            console.error('Error response:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to send alert');
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const selectedType = ALERT_TYPES.find((t) => t.value === formData.type);
    const selectedPriority = ALERT_PRIORITIES.find((p) => p.value === formData.priority);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                    <Radio className="h-8 w-8 text-danger-600" />
                    <span>Emergency Broadcast System</span>
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    Send emergency alerts and announcements to users
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Broadcast Form */}
                <div className="lg:col-span-2">
                    <Card title="Create New Broadcast">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Alert Type & Priority */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Alert Type *
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        value={formData.type}
                                        onChange={(e) => handleChange('type', e.target.value)}
                                        required
                                    >
                                        {ALERT_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Priority Level *
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        value={formData.priority}
                                        onChange={(e) => handleChange('priority', e.target.value)}
                                        required
                                    >
                                        {ALERT_PRIORITIES.map((priority) => (
                                            <option key={priority.value} value={priority.value}>
                                                {priority.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Title */}
                            <Input
                                label="Alert Title *"
                                placeholder="e.g., Typhoon Warning - Immediate Evacuation Required"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                required
                            />

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alert Message *
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    rows={6}
                                    placeholder="Provide detailed information about the emergency..."
                                    value={formData.message}
                                    onChange={(e) => handleChange('message', e.target.value)}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.message.length} characters
                                </p>
                            </div>

                            {/* Target Recipients */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Target Recipients *
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="target"
                                            value="all"
                                            checked={formData.target === 'all'}
                                            onChange={(e) => handleChange('target', e.target.value)}
                                            className="text-primary-600"
                                        />
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-gray-900">
                                                All Users (City-wide)
                                            </span>
                                            <p className="text-xs text-gray-500">
                                                Send to all registered users
                                            </p>
                                        </div>
                                    </label>

                                    <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="target"
                                            value="barangay"
                                            checked={formData.target === 'barangay'}
                                            onChange={(e) => handleChange('target', e.target.value)}
                                            className="text-primary-600"
                                        />
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-gray-900">
                                                Specific Barangay
                                            </span>
                                            <p className="text-xs text-gray-500">
                                                Target users in a specific barangay
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Barangay Selection */}
                            {formData.target === 'barangay' && (
                                <Input
                                    label="Barangay ID"
                                    type="number"
                                    placeholder="Enter barangay ID"
                                    value={formData.barangayId}
                                    onChange={(e) => handleChange('barangayId', e.target.value)}
                                    required
                                />
                            )}

                            {/* Warning Box */}
                            <div className="bg-danger-50 border-2 border-danger-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <AlertTriangle className="h-6 w-6 text-danger-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-danger-900 mb-1">
                                            ⚠️ Critical Action Warning
                                        </p>
                                        <p className="text-sm text-danger-800">
                                            This alert will be sent immediately to{' '}
                                            {formData.target === 'all' ? (
                                                <strong>ALL USERS</strong>
                                            ) : (
                                                'selected recipients'
                                            )}. This action cannot be undone.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="danger"
                                size="lg"
                                fullWidth
                                loading={isSendingAlert}
                                disabled={isSendingAlert}
                            >
                                <Send className="h-5 w-5 mr-2" />
                                Send Emergency Broadcast
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Preview */}
                    <Card title="Broadcast Preview">
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Type</p>
                                <Badge variant={selectedType?.color || 'default'}>
                                    {selectedType?.label || 'Not selected'}
                                </Badge>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">Priority</p>
                                <Badge variant={selectedPriority?.color || 'default'}>
                                    {selectedPriority?.label || 'Not selected'}
                                </Badge>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">Target</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {formData.target === 'all' ? 'All Users (City-wide)' : 'Specific Barangay'}
                                </p>
                            </div>

                            {formData.title && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Title</p>
                                    <p className="text-sm font-medium text-gray-900">{formData.title}</p>
                                </div>
                            )}

                            {formData.message && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Message</p>
                                    <p className="text-sm text-gray-700 line-clamp-4">{formData.message}</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Recent Broadcasts */}
                    <Card title="Recent Broadcasts">
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {recentBroadcasts.length === 0 ? (
                                <div className="text-center py-8">
                                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">No recent broadcasts</p>
                                </div>
                            ) : (
                                recentBroadcasts.map((broadcast) => (
                                    <div
                                        key={broadcast.id}
                                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-1">
                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                                                {broadcast.title}
                                            </h4>
                                            <Badge variant="default" size="sm">
                                                {broadcast.type}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                            {broadcast.message}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDistanceToNow(new Date(broadcast.createdAt), {
                                                addSuffix: true,
                                            })}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Guidelines */}
                    <Card title="Broadcasting Guidelines">
                        <div className="space-y-2 text-xs text-gray-600">
                            <p>• Use <strong>Critical</strong> priority for life-threatening situations</p>
                            <p>• Be clear and concise in your message</p>
                            <p>• Include specific actions residents should take</p>
                            <p>• Verify information before broadcasting</p>
                            <p>• Avoid unnecessary panic or alarm</p>
                            <p>• Follow up with updates as needed</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Broadcast;
