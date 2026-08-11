/**
 * EmergencyBroadcast Component
 * Send emergency alerts to all users or specific barangays
 */

import { useState } from 'react';
import { Radio, Send, AlertTriangle } from 'lucide-react';
import { Card, Button, Input, Textarea, Select } from '../common';
import { useAdmin } from '../../hooks/useAdmin';
import toast from 'react-hot-toast';

const ALERT_TYPES = [
    { value: 'emergency', label: '🚨 Emergency Alert' },
    { value: 'warning', label: '⚠️ Warning' },
    { value: 'info', label: 'ℹ️ Information' },
    { value: 'evacuation', label: '🏃 Evacuation Order' },
];

const ALERT_PRIORITIES = [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
];

const EmergencyBroadcast = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'emergency',
        priority: 'critical',
        target: 'all', // all, barangay, users
        barangayId: '',
    });

    const { sendEmergencyAlert, isSendingAlert } = useAdmin();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.message) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Confirm before sending
        const confirmed = window.confirm(
            `Are you sure you want to send this ${formData.priority} priority alert to ${formData.target === 'all' ? 'ALL USERS' : 'selected recipients'}?`
        );

        if (!confirmed) return;

        sendEmergencyAlert(formData, {
            onSuccess: () => {
                setFormData({
                    title: '',
                    message: '',
                    type: 'emergency',
                    priority: 'critical',
                    target: 'all',
                    barangayId: '',
                });
                setIsOpen(false);
            },
        });
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Radio className="h-5 w-5 text-danger-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Emergency Broadcast</h3>
                </div>
                <Button
                    variant={isOpen ? 'secondary' : 'danger'}
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? 'Cancel' : 'New Alert'}
                </Button>
            </div>

            {isOpen ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Alert Type */}
                    <Select
                        label="Alert Type"
                        options={ALERT_TYPES}
                        value={formData.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                        required
                    />

                    {/* Priority */}
                    <Select
                        label="Priority Level"
                        options={ALERT_PRIORITIES}
                        value={formData.priority}
                        onChange={(e) => handleChange('priority', e.target.value)}
                        required
                    />

                    {/* Title */}
                    <Input
                        label="Alert Title"
                        placeholder="e.g., Typhoon Warning - Immediate Evacuation"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        required
                    />

                    {/* Message */}
                    <Textarea
                        label="Alert Message"
                        placeholder="Provide detailed information about the emergency..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        required
                    />

                    {/* Target */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Target Recipients
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="target"
                                    value="all"
                                    checked={formData.target === 'all'}
                                    onChange={(e) => handleChange('target', e.target.value)}
                                    className="text-primary-600"
                                />
                                <span className="text-sm text-gray-700">All Users (City-wide)</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="target"
                                    value="barangay"
                                    checked={formData.target === 'barangay'}
                                    onChange={(e) => handleChange('target', e.target.value)}
                                    className="text-primary-600"
                                />
                                <span className="text-sm text-gray-700">Specific Barangay</span>
                            </label>
                        </div>
                    </div>

                    {/* Barangay Selection (if target is barangay) */}
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

                    {/* Warning */}
                    <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                            <AlertTriangle className="h-5 w-5 text-warning-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-warning-800">
                                <p className="font-medium">Warning</p>
                                <p className="mt-1">
                                    This alert will be sent immediately to {formData.target === 'all' ? 'ALL USERS' : 'selected recipients'}
                                    via push notifications, SMS, and in-app alerts.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                        <Button
                            type="submit"
                            variant="danger"
                            fullWidth
                            loading={isSendingAlert}
                            disabled={isSendingAlert}
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Send Emergency Alert
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="text-center py-8">
                    <Radio className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                        Click "New Alert" to broadcast an emergency message
                    </p>
                </div>
            )}
        </Card>
    );
};

export default EmergencyBroadcast;
