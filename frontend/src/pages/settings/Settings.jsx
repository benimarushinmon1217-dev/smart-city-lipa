/**
 * Settings Page
 * User preferences and application settings
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Bell, MapPin, Shield, User as UserIcon } from 'lucide-react';
import { Card, Button, Input, Select } from '../../components/common';
import useAuthStore from '../../stores/authStore';
import toast from 'react-hot-toast';

const settingsSchema = z.object({
    notifications_enabled: z.boolean(),
    email_notifications: z.boolean(),
    push_notifications: z.boolean(),
    location_sharing: z.boolean(),
    auto_evacuation_alerts: z.boolean(),
    preferred_language: z.string(),
    map_style: z.string(),
});

const Settings = () => {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('notifications');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            notifications_enabled: true,
            email_notifications: true,
            push_notifications: false,
            location_sharing: true,
            auto_evacuation_alerts: true,
            preferred_language: 'en',
            map_style: 'streets',
        },
    });

    const onSubmit = async (data) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        }
    };

    const tabs = [
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'location', name: 'Location', icon: MapPin },
        { id: 'privacy', name: 'Privacy', icon: Shield },
        { id: 'account', name: 'Account', icon: UserIcon },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                `}
                            >
                                <Icon className="h-5 w-5 mr-2" />
                                {tab.name}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <Card>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    Notification Preferences
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Choose how you want to receive alerts and updates
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-900">
                                            Enable Notifications
                                        </label>
                                        <p className="text-sm text-gray-500">
                                            Receive emergency alerts and updates
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        {...register('notifications_enabled')}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-900">
                                            Email Notifications
                                        </label>
                                        <p className="text-sm text-gray-500">
                                            Get updates via email
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        {...register('email_notifications')}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-900">
                                            Push Notifications
                                        </label>
                                        <p className="text-sm text-gray-500">
                                            Receive browser push notifications
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        {...register('push_notifications')}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-900">
                                            Auto Evacuation Alerts
                                        </label>
                                        <p className="text-sm text-gray-500">
                                            Automatically receive evacuation recommendations
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        {...register('auto_evacuation_alerts')}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && (
                    <Card>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    Location Settings
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Manage location sharing and map preferences
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-900">
                                            Share Location
                                        </label>
                                        <p className="text-sm text-gray-500">
                                            Allow the system to access your location for better routing
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        {...register('location_sharing')}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Map Style
                                    </label>
                                    <Select {...register('map_style')}>
                                        <option value="streets">Streets</option>
                                        <option value="satellite">Satellite</option>
                                        <option value="terrain">Terrain</option>
                                        <option value="dark">Dark Mode</option>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                    <Card>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    Privacy & Security
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Control your privacy and data sharing preferences
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        Your data is encrypted and stored securely. We only use your
                                        information to provide emergency services and improve the platform.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                                        Data Collection
                                    </h4>
                                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                                        <li>Location data (when enabled)</li>
                                        <li>Incident reports and photos</li>
                                        <li>Emergency contact information</li>
                                        <li>Usage analytics</li>
                                    </ul>
                                </div>

                                <div>
                                    <Button variant="secondary" type="button">
                                        Download My Data
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Account Tab */}
                {activeTab === 'account' && (
                    <Card>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    Account Information
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    View and update your account details
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role
                                    </label>
                                    <Input
                                        type="text"
                                        value={user?.role || ''}
                                        disabled
                                        className="bg-gray-50 capitalize"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preferred Language
                                    </label>
                                    <Select {...register('preferred_language')}>
                                        <option value="en">English</option>
                                        <option value="tl">Tagalog</option>
                                    </Select>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <Button variant="danger" type="button">
                                        Delete Account
                                    </Button>
                                    <p className="mt-2 text-xs text-gray-500">
                                        This action cannot be undone. All your data will be permanently deleted.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                        <Save className="h-5 w-5 mr-2" />
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
