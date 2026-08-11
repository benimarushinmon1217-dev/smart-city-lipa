/**
 * Create Incident Page
 * Form to report a new incident - API Integrated
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { Card, Button, Input, Select, Textarea } from '../../components/common';
import { INCIDENT_TYPES, SEVERITY_LEVELS } from '../../utils/constants';
import { useIncidents } from '../../hooks/useIncidents';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api.config';
import toast from 'react-hot-toast';

// Validation schema
const incidentSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    type: z.string().min(1, 'Please select an incident type'),
    severity: z.string().min(1, 'Please select a severity level'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    barangayId: z.string().min(1, 'Please select a barangay'),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
});

const CreateIncident = () => {
    const navigate = useNavigate();
    const { createIncident, isCreating } = useIncidents();
    const [images, setImages] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(incidentSchema),
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

                // The response structure is: { success, message, data: { barangays: [...] } }
                // After API interceptor unwrapping, response = { success, message, data: { barangays: [...] } }
                const barangayList = response.data?.barangays || response.barangays || [];

                const barangayOptions = barangayList.map(b => ({
                    value: b.id.toString(),
                    label: b.name
                }));
                setBarangays(barangayOptions);
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

    const onSubmit = async (data) => {
        try {
            console.log('Form data before processing:', data);

            // Create FormData for multipart/form-data
            const formData = new FormData();

            // Map frontend field names to backend field names
            const fieldMapping = {
                'title': 'title',
                'type': 'incident_type',  // Backend expects incident_type
                'severity': 'severity',
                'description': 'description',
                'latitude': 'latitude',
                'longitude': 'longitude',
                'barangayId': 'barangay_id',  // Backend expects barangay_id
            };

            // Append text fields with correct names
            Object.keys(data).forEach(key => {
                if (data[key]) {
                    const backendFieldName = fieldMapping[key] || key;
                    let value = data[key];

                    // Convert barangay_id to integer
                    if (backendFieldName === 'barangay_id') {
                        value = parseInt(value, 10);
                        console.log('Converted barangay_id:', value, 'Type:', typeof value);
                    }

                    // Convert latitude/longitude to float if provided
                    if ((backendFieldName === 'latitude' || backendFieldName === 'longitude') && value) {
                        value = parseFloat(value);
                        console.log(`Converted ${backendFieldName}:`, value, 'Type:', typeof value);
                    }

                    formData.append(backendFieldName, value);
                    console.log(`Appended ${backendFieldName}:`, value);
                }
            });

            // Append images
            images.forEach((image, index) => {
                formData.append('images', image);
                console.log(`Appended image ${index}:`, image.name);
            });

            // Log all FormData entries
            console.log('FormData entries:');
            for (let pair of formData.entries()) {
                console.log(pair[0], ':', pair[1]);
            }

            // Submit to API
            createIncident(formData, {
                onSuccess: () => {
                    navigate('/incidents');
                },
            });
        } catch (error) {
            console.error('Error creating incident:', error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Back Button */}
            <Link to="/incidents">
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Incidents
                </Button>
            </Link>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Report Incident</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Provide details about the incident you're reporting
                </p>
            </div>

            {/* Form */}
            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Incident Title"
                        placeholder="Brief description of the incident"
                        error={errors.title?.message}
                        {...register('title')}
                        required
                    />

                    <Select
                        label="Incident Type"
                        options={INCIDENT_TYPES}
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

                    <Select
                        label="Severity Level"
                        options={SEVERITY_LEVELS}
                        error={errors.severity?.message}
                        {...register('severity')}
                        required
                    />

                    <Textarea
                        label="Description"
                        placeholder="Provide detailed information about the incident..."
                        rows={6}
                        error={errors.description?.message}
                        {...register('description')}
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
                            onClick={() => navigate('/incidents')}
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

export default CreateIncident;
