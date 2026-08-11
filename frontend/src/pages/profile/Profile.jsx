/**
 * Profile Page
 * User profile management
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, MapPin, Calendar, Save, Camera } from 'lucide-react';
import { Card, Button, Input } from '../../components/common';
import useAuthStore from '../../stores/authStore';
import toast from 'react-hot-toast';

const profileSchema = z.object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    phone: z.string().optional(),
    address: z.string().optional(),
    barangay: z.string().optional(),
});

const Profile = () => {
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            phone: user?.phone || '',
            address: user?.address || '',
            barangay: user?.barangay || '',
        },
    });

    const onSubmit = async (data) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Manage your personal information
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1">
                    <div className="text-center">
                        {/* Avatar */}
                        <div className="relative inline-block">
                            <div className="h-32 w-32 rounded-full bg-primary-600 flex items-center justify-center text-white text-4xl font-bold mx-auto">
                                {user?.first_name?.[0]}{user?.last_name?.[0]}
                            </div>
                            <button className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50">
                                <Camera className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>

                        {/* User Info */}
                        <h2 className="mt-4 text-xl font-bold text-gray-900">
                            {user?.first_name} {user?.last_name}
                        </h2>
                        <p className="text-sm text-gray-600 capitalize">{user?.role}</p>

                        {/* Stats */}
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-gray-900">12</p>
                                <p className="text-xs text-gray-600">Reports</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-gray-900">5</p>
                                <p className="text-xs text-gray-600">Incidents</p>
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="mt-6 space-y-3 text-left">
                            <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-4 w-4 mr-2" />
                                {user?.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-2" />
                                Joined {new Date(user?.created_at || Date.now()).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Profile Form */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-900">
                            Personal Information
                        </h3>
                        {!isEditing && (
                            <Button
                                variant="secondary"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <Input
                                    {...register('first_name')}
                                    disabled={!isEditing}
                                    error={errors.first_name?.message}
                                    icon={User}
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <Input
                                    {...register('last_name')}
                                    disabled={!isEditing}
                                    error={errors.last_name?.message}
                                    icon={User}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <Input
                                    {...register('phone')}
                                    disabled={!isEditing}
                                    error={errors.phone?.message}
                                    icon={Phone}
                                    placeholder="+63 XXX XXX XXXX"
                                />
                            </div>

                            {/* Barangay */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Barangay
                                </label>
                                <Input
                                    {...register('barangay')}
                                    disabled={!isEditing}
                                    error={errors.barangay?.message}
                                    icon={MapPin}
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <Input
                                {...register('address')}
                                disabled={!isEditing}
                                error={errors.address?.message}
                                icon={MapPin}
                                placeholder="Street, City, Province"
                            />
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex justify-end space-x-3">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setIsEditing(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    <Save className="h-5 w-5 mr-2" />
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        )}
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
