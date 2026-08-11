/**
 * Incident Details Page
 * View detailed information about an incident - API Integrated
 */

import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, User } from 'lucide-react';
import { Card, Badge, Button, Spinner, Alert } from '../../components/common';
import { useIncidents } from '../../hooks/useIncidents';
import { formatDistanceToNow } from 'date-fns';
import { API_BASE_URL } from '../../config/api.config';
import useAuthStore from '../../stores/authStore';

const IncidentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { useIncident, deleteIncident, isDeleting } = useIncidents();
    const { data: response, isLoading, error } = useIncident(id);

    // Handle different response structures
    const incident = response?.data?.incident || response?.incident || response?.data;

    // Check if user can edit this incident
    // Admin and staff can edit any incident, users can only edit their own
    const canEdit = user && incident && (
        user.role === 'admin' ||
        user.role === 'staff' ||
        incident.reported_by === user.id ||
        incident.User?.id === user.id
    );

    // Check if user can delete this incident
    // Admin can delete any, users can only delete their own
    const canDelete = user && incident && (
        user.role === 'admin' ||
        incident.reported_by === user.id ||
        incident.User?.id === user.id
    );

    console.log('Permission Check:', {
        user: user?.email,
        userRole: user?.role,
        userId: user?.id,
        incidentReportedBy: incident?.reported_by,
        incidentUserId: incident?.User?.id,
        canEdit,
        canDelete
    });

    // Debug logging
    console.log('Incident Details Debug:', {
        id,
        response,
        incident,
        error,
        isLoading
    });

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this incident?')) {
            deleteIncident(id, {
                onSuccess: () => {
                    navigate('/incidents');
                },
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error || !incident) {
        return (
            <div className="space-y-6">
                <Link to="/incidents">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Incidents
                    </Button>
                </Link>
                <Alert variant="danger">
                    Failed to load incident details. Please try again.
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link to="/incidents">
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Incidents
                </Button>
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center space-x-3">
                        <h1 className="text-2xl font-bold text-gray-900">{incident.title}</h1>
                        <Badge
                            variant={
                                incident.severity === 'high' || incident.severity === 'critical'
                                    ? 'danger'
                                    : incident.severity === 'medium'
                                        ? 'warning'
                                        : 'success'
                            }
                        >
                            {incident.severity}
                        </Badge>
                        <Badge variant="default">{incident.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        Incident ID: #{incident.id}
                    </p>
                </div>
                <div className="flex space-x-2">
                    {canEdit && (
                        <Link to={`/incidents/${id}/edit`}>
                            <Button variant="secondary">Edit</Button>
                        </Link>
                    )}
                    {canDelete && (
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            loading={isDeleting}
                            disabled={isDeleting}
                        >
                            Delete
                        </Button>
                    )}
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <Card title="Description">
                        <p className="text-gray-700">{incident.description}</p>
                    </Card>

                    {/* Images */}
                    {incident.images && incident.images.length > 0 && (
                        <Card title="Images">
                            <div className="grid grid-cols-2 gap-4">
                                {incident.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={`${API_BASE_URL}${image}`}
                                        alt={`Incident ${index + 1}`}
                                        className="rounded-lg w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => window.open(`${API_BASE_URL}${image}`, '_blank')}
                                    />
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Timeline */}
                    <Card title="Timeline">
                        <div className="space-y-4">
                            {(incident.createdAt || incident.created_at) && (
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-2 h-2 mt-2 bg-primary-600 rounded-full" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Incident Reported</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(incident.createdAt || incident.created_at).toLocaleString()}
                                            ({formatDistanceToNow(new Date(incident.createdAt || incident.created_at), { addSuffix: true })})
                                        </p>
                                    </div>
                                </div>
                            )}
                            {(incident.updatedAt || incident.updated_at) &&
                                (incident.updatedAt !== incident.createdAt || incident.updated_at !== incident.created_at) && (
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-2 h-2 mt-2 bg-gray-400 rounded-full" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Last Updated</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(incident.updatedAt || incident.updated_at).toLocaleString()}
                                                ({formatDistanceToNow(new Date(incident.updatedAt || incident.updated_at), { addSuffix: true })})
                                            </p>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Info Card */}
                    <Card title="Information">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Type</p>
                                <p className="mt-1 text-sm text-gray-900 capitalize">{incident.incident_type || incident.type}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Barangay</p>
                                <div className="mt-1 flex items-start space-x-2">
                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <p className="text-sm text-gray-900">
                                        {incident.barangay?.name || incident.Barangay?.name || 'Unknown Location'}
                                    </p>
                                </div>
                            </div>
                            {incident.address && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                    <p className="text-sm text-gray-900 mt-1">{incident.address}</p>
                                </div>
                            )}
                            {incident.latitude && incident.longitude && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Coordinates</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {incident.latitude}, {incident.longitude}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-gray-500">Reported By</p>
                                <div className="mt-1 flex items-start space-x-2">
                                    <User className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <p className="text-sm text-gray-900">
                                        {incident.reporter ? `${incident.reporter.first_name} ${incident.reporter.last_name}` :
                                            incident.User ? `${incident.User.first_name} ${incident.User.last_name}` : 'Unknown'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Reported At</p>
                                <div className="mt-1 flex items-start space-x-2">
                                    <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <p className="text-sm text-gray-900">
                                        {new Date(incident.createdAt || incident.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Impact Information Card */}
                    {(incident.affected_families || incident.affected_individuals || incident.casualties || incident.estimated_damage) && (
                        <Card title="Impact Information">
                            <div className="space-y-4">
                                {incident.affected_families && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Affected Families</p>
                                        <p className="mt-1 text-sm text-gray-900">{incident.affected_families}</p>
                                    </div>
                                )}
                                {incident.affected_individuals && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Affected Individuals</p>
                                        <p className="mt-1 text-sm text-gray-900">{incident.affected_individuals}</p>
                                    </div>
                                )}
                                {incident.casualties && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Casualties</p>
                                        <p className="mt-1 text-sm text-gray-900">{incident.casualties}</p>
                                    </div>
                                )}
                                {incident.estimated_damage && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Estimated Damage</p>
                                        <p className="mt-1 text-sm text-gray-900">
                                            ₱{parseFloat(incident.estimated_damage).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Additional Notes Card */}
                    {incident.notes && (
                        <Card title="Additional Notes">
                            <p className="text-sm text-gray-700">{incident.notes}</p>
                        </Card>
                    )}

                    {/* Actions */}
                    <Card title="Actions">
                        <div className="space-y-2">
                            {incident.latitude && incident.longitude && (
                                <a
                                    href={`https://www.google.com/maps?q=${incident.latitude},${incident.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="primary" fullWidth>
                                        View on Map
                                    </Button>
                                </a>
                            )}
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('Link copied to clipboard!');
                                }}
                            >
                                Share Incident
                            </Button>
                            <Button variant="secondary" fullWidth>
                                Download Report
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default IncidentDetails;
