/**
 * Create Report Page
 * Form to submit a new report - API Integrated
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { Card, Button, Input, Select, Textarea } from '../../components/common';
import { useReports } from '../../hooks/useReports';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api.config';
import toast from 'react-hot-toast';

// Validation schema
const reportSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    type: z.string()
        .min(1, 'Please select a report type')
        .refine((val) => val !== '', { message: 'Please select a report type' }),
    barangayId: z.string()
        .min(1, 'Please select a barangay')
        .refine((val) => val !== '', { message: 'Please select a barangay' }),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    location: z.string().min(3, 'Location is required'),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
});

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

const CreateReport = () => {
    const navigate = useNavigate();
    const { createReport, isCreating } = useReports();
    const [images, setImages] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(reportSchema),
    });

    // Fetch barangays on mount
    useEffect(() => {
        const fetchBarangays = async () => {
            try {
                // Fetch ALL barangays without pagination limit
                const response = await api.get(API_ENDPOINTS.BARANGAYS.LIST, {
                    params: { limit: 1000 } // High limit to get all barangays
                });
                console.log('Barangays response:', response);

                const barangayList = response.data?.barangays || response.barangays || [];
                const barangayOptions = [
                    { value: '', label: 'Select barangay' },
                    ...barangayList.map(b => ({
                        value: b.id.toString(),
                        label: b.name
                    }))
                ];
                setBarangays(barangayOptions);
                console.log(`✅ Loaded ${barangayList.length} barangays`);
            } catch (error) {
                console.error('Error fetching barangays:', error);
                toast.error('Failed to load barangays');
            }
        };
        fetchBarangays();
    }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Validate file count
        if (files.length > 5) {
            toast.error('You can only upload up to 5 images');
            return;
        }

        // Validate file sizes
        const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
        if (invalidFiles.length > 0) {
            toast.error('Each image must be less than 5MB');
            return;
        }

        setImages(files);
    };

    const onSubmit = (data) => {
        console.log('📝 [CreateReport] Form data:', data);

        // Create FormData for multipart/form-data
        const formData = new FormData();

        // Map frontend field names to backend field names
        const fieldMapping = {
            'title': 'title',
            'type': 'report_type',  // Backend expects report_type
            'barangayId': 'barangay_id',  // Backend expects barangay_id
            'description': 'description',
            'location': 'location',
            'latitude': 'latitude',
            'longitude': 'longitude'
        };

        // Append text fields with correct backend names
        Object.keys(data).forEach(key => {
            if (data[key]) {
                const backendFieldName = fieldMapping[key] || key;
                formData.append(backendFieldName, data[key]);
                console.log(`📤 [CreateReport] Appending: ${backendFieldName} = ${data[key]}`);
            }
        });

        // Append images with correct field name
        images.forEach((image, index) => {
            formData.append('report_image', image);
            console.log(`📷 [CreateReport] Appending image ${index + 1}:`, image.name);
        });

        // Log all FormData entries
        console.log('📦 [CreateReport] Final FormData entries:');
        for (let pair of formData.entries()) {
            console.log(`  ${pair[0]}:`, pair[1]);
        }

        // Submit to API
        createReport(formData, {
            onSuccess: () => {
                console.log('✅ [CreateReport] Report created successfully');
                navigate('/reports');
            },
            onError: (error) => {
                console.error('❌ [CreateReport] Error creating report:', error);
                console.error('❌ [CreateReport] Error response:', error.response?.data);
            }
        });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Back Button */}
            <Link to="/reports">
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Reports
                </Button>
            </Link>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Submit Report</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Report issues or hazards in your area
                </p>
            </div>

            {/* Form */}
            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Report Title"
                        placeholder="Brief description of the issue"
                        error={errors.title?.message}
                        {...register('title')}
                        required
                    />

                    <Select
                        label="Report Type"
                        options={REPORT_TYPES}
                        error={errors.type?.message}
                        {...register('type')}
                        required
                    />

                    <Select
                        label="Barangay"
                        options={barangays}
                        error={errors.barangayId?.message}
                        {...register('barangayId')}
                        required
                    />

                    <Textarea
                        label="Description"
                        placeholder="Provide detailed information about the issue..."
                        rows={6}
                        error={errors.description?.message}
                        {...register('description')}
                        required
                    />

                    <Input
                        label="Location"
                        placeholder="e.g., Corner of Main St and 5th Ave, Barangay 3"
                        error={errors.location?.message}
                        {...register('location')}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Latitude (Optional)"
                            type="number"
                            step="any"
                            placeholder="13.9414"
                            error={errors.latitude?.message}
                            {...register('latitude')}
                        />
                        <Input
                            label="Longitude (Optional)"
                            type="number"
                            step="any"
                            placeholder="121.1628"
                            error={errors.longitude?.message}
                            {...register('longitude')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Images (Optional)
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            You can upload up to 5 images (max 5MB each)
                        </p>
                        {images.length > 0 && (
                            <p className="mt-2 text-sm text-gray-700">
                                {images.length} image(s) selected
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/reports')}
                            disabled={isCreating}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={isCreating}>
                            Submit Report
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateReport;
