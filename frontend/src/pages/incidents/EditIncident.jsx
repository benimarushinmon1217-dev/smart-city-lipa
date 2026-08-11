/**
 * EditIncident Component
 * Edit existing incident details
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Card, Button, Spinner, Alert } from '../../components/common';
import { useIncidents } from '../../hooks/useIncidents';
import { useBarangays } from '../../hooks/useBarangays';
import toast from 'react-hot-toast';

const EditIncident = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { useIncident, updateIncident, isUpdating } = useIncidents();
    const { data: response, isLoading: loadingIncident } = useIncident(id);
    const { barangays, isLoading: loadingBarangays } = useBarangays();

    const incident = response?.data?.incident || response?.incident || response?.data;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        incident_type: '',
        severity: '',
        status: '',
        barangay_id: '',
        latitude: '',
        longitude: '',
        address: '',
        affected_families: '',
        affected_individuals: '',
        casualties: '',
        estimated_damage: '',
        notes: '',
    });

    // Populate form when incident loads
    useEffect(() => {
        if (incident) {
            setFormData({
                title: incident.title || '',
                description: incident.description || '',
                incident_type: incident.incident_type || incident.type || '',
                severity: incident.severity || '',
                status: incident.status || '',
                barangay_id: incident.barangay_id || '',
                latitude: incident.latitude || '',
                longitude: incident.longitude || '',
                address: incident.address || '',
                affected_families: incident.affected_families || '',
                affected_individuals: incident.affected_individuals || '',
                casualties: incident.casualties || '',
                estimated_damage: incident.estimated_damage || '',
                notes: incident.notes || '',
            });
        }
    }, [incident]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.description || !formData.incident_type) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Clean up form data - remove empty strings and convert to proper types
        const cleanData = {};
        Object.keys(formData).forEach(key => {
            const value = formData[key];
            // Only include non-empty values
            if (value !== '' && value !== null && value !== undefined) {
                // Convert numeric strings to numbers
                if (['barangay_id', 'latitude', 'longitude', 'affected_families',
                    'affected_individuals', 'casualties', 'estimated_damage'].includes(key)) {
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                        cleanData[key] = numValue;
                    }
                } else {
                    cleanData[key] = value;
                }
            }
        });

        console.log('Submitting incident update:', { id, cleanData });

        updateIncident(
            { id, data: cleanData },
            {
                onSuccess: () => {
                    console.log('Update successful');
                    navigate(`/incidents/${id}`);
                },
                onError: (error) => {
                    console.error('Update failed:', error);
                    console.error('Error response:', error.response);
                    console.error('Validation errors:', error.response?.data?.errors);
                },
            }
        );
    };

    if (loadingIncident || loadingBarangays) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!incident) {
        return (
            <div className="space-y-6">
                <Link to="/incidents">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Incidents
                    </Button>
                </Link>
                <Alert variant="danger">
                    Incident not found. Please try again.
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link to={`/incidents/${id}`}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Details
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mt-4">Edit Incident</h1>
                    <p className="text-gray-600 mt-1">Update incident information</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card title="Basic Information">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title <span className="text-danger-600">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description <span className="text-danger-600">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Incident Type <span className="text-danger-600">*</span>
                                </label>
                                <select
                                    name="incident_type"
                                    value={formData.incident_type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="flood">Flood</option>
                                    <option value="fire">Fire</option>
                                    <option value="earthquake">Earthquake</option>
                                    <option value="landslide">Landslide</option>
                                    <option value="typhoon">Typhoon</option>
                                    <option value="volcanic_activity">Volcanic Activity</option>
                                    <option value="road_blockage">Road Blockage</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Severity <span className="text-danger-600">*</span>
                                </label>
                                <select
                                    name="severity"
                                    value={formData.severity}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Severity</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="reported">Reported</option>
                                <option value="verified">Verified</option>
                                <option value="responding">Responding</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Location Information */}
                <Card title="Location Information">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Barangay
                            </label>
                            <select
                                name="barangay_id"
                                value={formData.barangay_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="">Select Barangay</option>
                                {barangays?.map((barangay) => (
                                    <option key={barangay.id} value={barangay.id}>
                                        {barangay.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Latitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Longitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Impact Information */}
                <Card title="Impact Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Affected Families
                            </label>
                            <input
                                type="number"
                                name="affected_families"
                                value={formData.affected_families}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Affected Individuals
                            </label>
                            <input
                                type="number"
                                name="affected_individuals"
                                value={formData.affected_individuals}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Casualties
                            </label>
                            <input
                                type="number"
                                name="casualties"
                                value={formData.casualties}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estimated Damage (₱)
                            </label>
                            <input
                                type="number"
                                name="estimated_damage"
                                value={formData.estimated_damage}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </Card>

                {/* Additional Notes */}
                <Card title="Additional Notes">
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Any additional information..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </Card>

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                    <Link to={`/incidents/${id}`}>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" variant="primary" loading={isUpdating} disabled={isUpdating}>
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditIncident;
