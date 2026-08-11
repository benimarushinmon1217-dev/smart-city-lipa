/**
 * Shelter Management Page
 * Admin page for managing evacuation centers and shelters
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Home,
    Search,
    Plus,
    Edit,
    Trash2,
    Users,
    MapPin,
    AlertTriangle,
    CheckCircle,
    X
} from 'lucide-react';
import {
    Card,
    Input,
    Button,
    Badge,
    Spinner,
    EmptyState,
    Pagination
} from '../../components/common';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api.config';
import { useSocket } from '../../hooks/useSocket';
import { useBarangays } from '../../hooks/useBarangays';
import toast from 'react-hot-toast';

const ShelterManagement = () => {
    const queryClient = useQueryClient();
    const { on, off, connect } = useSocket();
    const { barangays } = useBarangays();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'evacuation',
        address: '',
        barangay_id: '',
        contact_number: '',
        capacity: '',
        operating_hours: '',
        description: '',
        latitude: '',
        longitude: ''
    });

    // Fetch shelters
    const { data: sheltersData, isLoading, refetch } = useQuery({
        queryKey: ['admin-shelters', page, search, statusFilter, typeFilter],
        queryFn: async () => {
            console.log('🔍 Fetching shelters with params:', {
                type: typeFilter !== 'all' ? typeFilter : undefined,
                page,
                limit: 10,
                search,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            });
            const response = await api.get(API_ENDPOINTS.ESTABLISHMENTS.LIST, {
                params: {
                    type: typeFilter !== 'all' ? typeFilter : undefined,
                    page,
                    limit: 10,
                    search,
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                },
            });
            console.log('📦 Received shelters data:', response.data);
            return response.data;
        },
    });

    // Backend returns: { success, message, data: { establishments: [...], pagination: {...} } }
    // After API interceptor unwraps response.data, we get: { establishments: [...], pagination: {...} }
    const shelters = sheltersData?.establishments || [];
    const pagination = sheltersData?.pagination;

    console.log('🏠 Current shelters in state:', shelters.length, shelters);

    // Create shelter mutation
    const createMutation = useMutation({
        mutationFn: (data) => {
            console.log('🏗️ Creating shelter with data:', data);
            return api.post(API_ENDPOINTS.ESTABLISHMENTS.LIST, data);
        },
        onSuccess: (response) => {
            console.log('✅ Shelter created successfully:', response);
            console.log('📋 Resetting filters and refetching...');
            setPage(1); // Reset to page 1
            setTypeFilter('all'); // Clear type filter to show all types
            setSearch(''); // Clear search
            queryClient.invalidateQueries(['admin-shelters']);
            // Small delay to ensure state updates before refetch
            setTimeout(() => {
                refetch();
            }, 100);
            toast.success('Shelter created successfully');
            setShowAddModal(false);
            resetForm();
        },
        onError: (error) => {
            console.error('❌ Failed to create shelter:', error);
            toast.error(error.response?.data?.message || 'Failed to create shelter');
        },
    });

    // Real-time shelter updates
    useEffect(() => {
        connect();

        on('shelter:updated', () => {
            refetch();
        });

        on('shelter:created', () => {
            refetch();
            toast.success('New shelter added');
        });

        on('shelter:deleted', () => {
            refetch();
        });

        on('establishment:updated', () => {
            refetch();
        });

        return () => {
            off('shelter:updated');
            off('shelter:created');
            off('shelter:deleted');
            off('establishment:updated');
        };
    }, [on, off, connect, refetch]);

    // Update shelter mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => {
            console.log('🔄 UPDATE MUTATION - Sending request:', { id, data });
            return api.put(`${API_ENDPOINTS.ESTABLISHMENTS.DETAIL(id)}`, data);
        },
        onSuccess: (response) => {
            console.log('✅ UPDATE SUCCESS - Response:', response);
            queryClient.invalidateQueries(['admin-shelters']);
            refetch(); // Explicitly refetch the data
            toast.success('Shelter updated successfully');
        },
        onError: (error) => {
            console.error('❌ UPDATE FAILED - Error:', error);
            console.error('Error response:', error.response?.data);
            toast.error('Failed to update shelter');
        },
    });

    // Delete shelter mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(API_ENDPOINTS.ESTABLISHMENTS.DETAIL(id)),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-shelters']);
            refetch(); // Explicitly refetch the data
            toast.success('Shelter deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete shelter');
        },
    });

    const handleUpdateCapacity = (shelter) => {
        const newCapacity = window.prompt(
            `Update capacity for ${shelter.name}\nCurrent: ${shelter.capacity || 0}`,
            shelter.capacity || 0
        );

        if (newCapacity && !isNaN(newCapacity)) {
            updateMutation.mutate({
                id: shelter.id,
                data: { capacity: parseInt(newCapacity) },
            });
        }
    };

    const handleUpdateOccupancy = (shelter) => {
        const newOccupancy = window.prompt(
            `Update current occupancy for ${shelter.name}\nCurrent: ${shelter.current_occupancy || 0}`,
            shelter.current_occupancy || 0
        );

        if (newOccupancy && !isNaN(newOccupancy)) {
            updateMutation.mutate({
                id: shelter.id,
                data: { current_occupancy: parseInt(newOccupancy) },
            });
        }
    };

    const handleUpdateStatus = (shelter) => {
        const currentStatus = shelter.is_operational ? 'operational' : 'not operational';
        console.log('🔧 Current shelter status:', {
            name: shelter.name,
            is_operational: shelter.is_operational,
            currentStatus
        });

        const newStatus = window.prompt(
            `Update operational status for ${shelter.name}\nCurrent: ${currentStatus}\n\nType "yes" for operational or "no" for not operational`,
            shelter.is_operational ? 'yes' : 'no'
        );

        console.log('📝 User entered:', newStatus);

        if (!newStatus) {
            console.log('⚠️ Cancelled or empty input');
            return;
        }

        const input = newStatus.toLowerCase().trim();

        if (input === 'yes' || input === 'operational' || input === 'true' || input === '1') {
            console.log('✅ Setting is_operational to TRUE');
            updateMutation.mutate({
                id: shelter.id,
                data: { is_operational: true },
            });
        } else if (input === 'no' || input === 'not operational' || input === 'non operational' || input === 'false' || input === '0') {
            console.log('❌ Setting is_operational to FALSE');
            updateMutation.mutate({
                id: shelter.id,
                data: { is_operational: false },
            });
        } else {
            console.log('⚠️ Invalid input:', newStatus);
            toast.error('Invalid input. Please type "yes" or "no"');
        }
    };

    const handleDelete = (shelter) => {
        if (
            window.confirm(
                `Are you sure you want to delete ${shelter.name}? This action cannot be undone.`
            )
        ) {
            deleteMutation.mutate(shelter.id);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'evacuation',
            address: '',
            barangay_id: '',
            contact_number: '',
            capacity: '',
            operating_hours: '',
            description: '',
            latitude: '',
            longitude: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.name || !formData.address || !formData.barangay_id || !formData.latitude || !formData.longitude) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Prepare data
        const submitData = {
            ...formData,
            capacity: formData.capacity ? parseInt(formData.capacity) : null,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
        };

        createMutation.mutate(submitData);
    };

    const calculateOccupancy = (shelter) => {
        if (!shelter.capacity || !shelter.current_occupancy) return 0;
        return Math.round((shelter.current_occupancy / shelter.capacity) * 100);
    };

    const getStatusBadge = (shelter) => {
        const occupancy = calculateOccupancy(shelter);

        // Check operational status first
        if (!shelter.is_operational) {
            return <Badge variant="danger">Not Operational</Badge>;
        }

        // Check capacity
        if (occupancy >= 100) {
            return <Badge variant="danger">Full</Badge>;
        }

        if (occupancy >= 80) {
            return <Badge variant="warning">Near Capacity</Badge>;
        }

        return <Badge variant="success">Available</Badge>;
    };

    // Calculate summary stats
    const totalCapacity = shelters.reduce((sum, s) => sum + (s.capacity || 0), 0);
    const totalOccupancy = shelters.reduce((sum, s) => sum + (s.current_occupancy || 0), 0);
    const availableShelters = shelters.filter(
        (s) => s.is_operational && calculateOccupancy(s) < 100
    ).length;
    const fullShelters = shelters.filter(
        (s) => calculateOccupancy(s) >= 100
    ).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                        <Home className="h-8 w-8 text-primary-600" />
                        <span>Shelter Management</span>
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage evacuation centers and shelter capacity
                    </p>
                </div>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Shelter
                </Button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card padding={false}>
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Shelters</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {pagination?.total || shelters.length}
                                </p>
                            </div>
                            <Home className="h-10 w-10 text-gray-300" />
                        </div>
                    </div>
                </Card>

                <Card padding={false}>
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Available</p>
                                <p className="text-2xl font-bold text-success-600 mt-1">
                                    {availableShelters}
                                </p>
                            </div>
                            <CheckCircle className="h-10 w-10 text-success-300" />
                        </div>
                    </div>
                </Card>

                <Card padding={false}>
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Full</p>
                                <p className="text-2xl font-bold text-danger-600 mt-1">
                                    {fullShelters}
                                </p>
                            </div>
                            <AlertTriangle className="h-10 w-10 text-danger-300" />
                        </div>
                    </div>
                </Card>

                <Card padding={false}>
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Capacity</p>
                                <p className="text-2xl font-bold text-primary-600 mt-1">
                                    {totalCapacity}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {totalOccupancy} occupied
                                </p>
                            </div>
                            <Users className="h-10 w-10 text-primary-300" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <Input
                            placeholder="Search shelters..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={<Search className="h-5 w-5 text-gray-400" />}
                        />
                    </div>
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="evacuation">Evacuation Centers</option>
                        <option value="hospital">Hospitals</option>
                        <option value="clinic">Clinics</option>
                        <option value="police">Police Stations</option>
                        <option value="fire_station">Fire Stations</option>
                        <option value="school">Schools</option>
                        <option value="church">Churches</option>
                        <option value="government">Government Offices</option>
                        <option value="barangay_hall">Barangay Halls</option>
                        <option value="other">Other</option>
                    </select>
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="available">Available</option>
                        <option value="full">Full</option>
                        <option value="unavailable">Unavailable</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>
            </Card>

            {/* Shelters List */}
            <Card>
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : shelters.length === 0 ? (
                    <EmptyState
                        icon={Home}
                        title="No shelters found"
                        description="No shelters match your filters"
                    />
                ) : (
                    <div className="space-y-4">
                        {shelters.map((shelter) => {
                            const occupancy = calculateOccupancy(shelter);

                            return (
                                <div
                                    key={shelter.id}
                                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {shelter.name}
                                                </h3>
                                                {getStatusBadge(shelter)}
                                                {/* Debug badge */}
                                                <Badge variant={shelter.is_operational ? "success" : "danger"} size="sm">
                                                    {shelter.is_operational ? "✓ Operational" : "✗ Not Operational"}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{shelter.address || 'No address'}</span>
                                                </div>
                                                {shelter.barangay && (
                                                    <Badge variant="default" size="sm">
                                                        {typeof shelter.barangay === 'object' ? shelter.barangay.name : shelter.barangay}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleUpdateStatus(shelter)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(shelter)}
                                            >
                                                <Trash2 className="h-4 w-4 text-danger-600" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Capacity Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-600 mb-1">Capacity</p>
                                            <p className="text-xl font-bold text-gray-900">
                                                {shelter.capacity || 0}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() => handleUpdateCapacity(shelter)}
                                            >
                                                Update
                                            </Button>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-600 mb-1">Current Occupancy</p>
                                            <p className="text-xl font-bold text-gray-900">
                                                {shelter.current_occupancy || 0}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() => handleUpdateOccupancy(shelter)}
                                            >
                                                Update
                                            </Button>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-600 mb-1">Occupancy Rate</p>
                                            <p className="text-xl font-bold text-gray-900">{occupancy}%</p>
                                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${occupancy >= 100
                                                        ? 'bg-danger-600'
                                                        : occupancy >= 80
                                                            ? 'bg-warning-500'
                                                            : 'bg-success-500'
                                                        }`}
                                                    style={{ width: `${Math.min(occupancy, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="flex justify-center">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.pages}
                        onPageChange={setPage}
                    />
                </div>
            )}

            {/* Add Shelter Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Add New Shelter</h2>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Shelter Name <span className="text-danger-600">*</span>
                                </label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Lipa City Evacuation Center"
                                    required
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type <span className="text-danger-600">*</span>
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                >
                                    <option value="evacuation">Evacuation Center</option>
                                    <option value="hospital">Hospital</option>
                                    <option value="clinic">Clinic</option>
                                    <option value="police">Police Station</option>
                                    <option value="fire_station">Fire Station</option>
                                    <option value="school">School</option>
                                    <option value="church">Church</option>
                                    <option value="government">Government Office</option>
                                    <option value="barangay_hall">Barangay Hall</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address <span className="text-danger-600">*</span>
                                </label>
                                <Input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Complete address"
                                    required
                                />
                            </div>

                            {/* Barangay */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Barangay <span className="text-danger-600">*</span>
                                </label>
                                <select
                                    name="barangay_id"
                                    value={formData.barangay_id}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Barangay</option>
                                    {barangays?.map((barangay) => (
                                        <option key={barangay.id} value={barangay.id}>
                                            {barangay.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Number
                                </label>
                                <Input
                                    name="contact_number"
                                    value={formData.contact_number}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 0917-123-4567"
                                />
                            </div>

                            {/* Capacity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Capacity (persons)
                                </label>
                                <Input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 500"
                                    min="0"
                                />
                            </div>

                            {/* Operating Hours */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Operating Hours
                                </label>
                                <Input
                                    name="operating_hours"
                                    value={formData.operating_hours}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 24/7 or Mon-Fri 8AM-5PM"
                                />
                            </div>

                            {/* Coordinates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Latitude <span className="text-danger-600">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 13.9411"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Required for map display</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Longitude <span className="text-danger-600">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 121.1634"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Required for map display</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Additional information about the shelter..."
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetForm();
                                    }}
                                    disabled={createMutation.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={createMutation.isPending}
                                >
                                    {createMutation.isPending ? (
                                        <>
                                            <Spinner size="sm" className="mr-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Shelter
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShelterManagement;
