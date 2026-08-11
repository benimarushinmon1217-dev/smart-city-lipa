/**
 * Incident List Page
 * Display list of all incidents - API Integrated
 */

import { useState, useEffect } from 'react';
import { Card, Badge, Button, EmptyState, Spinner, Pagination } from '../../components/common';
import { AlertTriangle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIncidents } from '../../hooks/useIncidents';
import { useSocket } from '../../hooks/useSocket';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const IncidentList = () => {
    const [filters, setFilters] = useState({
        type: '',
        severity: '',
        status: '',
        page: 1,
        limit: 10,
    });

    const { incidents, pagination, isLoading, error, refetch } = useIncidents(filters);
    const { on, off, connect } = useSocket();

    // Real-time updates - only refetch data, toasts handled by useSocketEvents
    useEffect(() => {
        connect();

        on('incident:new', (data) => {
            console.log('🔴 [INCIDENT LIST] New incident:', data);
            refetch();
            // Toast is handled by useSocketEvents hook
        });

        on('incident:updated', () => {
            refetch();
        });

        on('incident:verified', () => {
            refetch();
        });

        on('incident:deleted', () => {
            refetch();
        });

        return () => {
            off('incident:new');
            off('incident:updated');
            off('incident:verified');
            off('incident:deleted');
        };
    }, [on, off, connect, refetch]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (page) => {
        setFilters((prev) => ({ ...prev, page }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Incidents</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        View and manage disaster incidents
                    </p>
                </div>
                <Link to="/incidents/new">
                    <Button variant="primary">
                        <Plus className="h-5 w-5 mr-2" />
                        Report Incident
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <div className="flex flex-wrap gap-4">
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="flood">Flood</option>
                        <option value="fire">Fire</option>
                        <option value="earthquake">Earthquake</option>
                        <option value="landslide">Landslide</option>
                        <option value="typhoon">Typhoon</option>
                        <option value="volcanic_activity">Volcanic Activity</option>
                        <option value="traffic_accident">Traffic Accident</option>
                        <option value="medical_emergency">Medical Emergency</option>
                        <option value="other">Other</option>
                    </select>
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        value={filters.severity}
                        onChange={(e) => handleFilterChange('severity', e.target.value)}
                    >
                        <option value="">All Severity</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="reported">Reported</option>
                        <option value="verified">Verified</option>
                        <option value="responding">Responding</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
            </Card>

            {/* Incident List */}
            {isLoading ? (
                <Card>
                    <div className="flex justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                </Card>
            ) : error ? (
                <Card>
                    <div className="text-center py-12 text-danger-600">
                        Error loading incidents. Please try again.
                    </div>
                </Card>
            ) : (
                <>
                    <div className="space-y-4">
                        {incidents && incidents.length > 0 ? (
                            incidents.map((incident) => (
                                <Card key={incident.id} hover>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {incident.title}
                                                </h3>
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
                                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                                <span>Type: {incident.incident_type || incident.type}</span>
                                                <span>•</span>
                                                <span>Location: {incident.barangay?.name || incident.Barangay?.name || 'Unknown'}</span>
                                                <span>•</span>
                                                <span>
                                                    {formatDistanceToNow(new Date(incident.createdAt || incident.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                            {incident.description && (
                                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                                    {incident.description}
                                                </p>
                                            )}
                                        </div>
                                        <Link to={`/incidents/${incident.id}`}>
                                            <Button size="sm" variant="ghost">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card>
                                <EmptyState
                                    icon={AlertTriangle}
                                    title="No incidents found"
                                    description="There are no incidents matching your filters."
                                    action={
                                        <Link to="/incidents/new">
                                            <Button variant="primary">Report Incident</Button>
                                        </Link>
                                    }
                                />
                            </Card>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default IncidentList;
