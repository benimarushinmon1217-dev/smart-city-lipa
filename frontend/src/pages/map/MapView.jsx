/**
 * Map View Page
 * Interactive map with real-time incident tracking
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapContainer from '../../components/map/MapContainer';
import { Card, Button, Badge } from '../../components/common';
import { Plus, Filter } from 'lucide-react';
import { useIncidents } from '../../hooks/useIncidents';

const MapView = () => {
    const navigate = useNavigate();
    const [selectedIncident, setSelectedIncident] = useState(null);
    const { incidents } = useIncidents({});

    const handleIncidentClick = (incident) => {
        setSelectedIncident(incident);
    };

    const handleViewDetails = () => {
        if (selectedIncident) {
            navigate(`/incidents/${selectedIncident.id}`);
        }
    };

    return (
        <div className="space-y-6 pt-4">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Live Map</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Real-time incident tracking and hazard monitoring
                    </p>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                    <Button variant="secondary">
                        <Filter className="h-5 w-5 mr-2" />
                        Filters
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/incidents/new')}>
                        <Plus className="h-5 w-5 mr-2" />
                        Report Incident
                    </Button>
                </div>
            </div>

            {/* Statistics Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card padding={false}>
                    <div className="p-5">
                        <p className="text-sm text-gray-600">Active Incidents</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                            {incidents?.filter(i => i.status !== 'resolved' && i.status !== 'closed').length || 0}
                        </p>
                    </div>
                </Card>
                <Card padding={false}>
                    <div className="p-5">
                        <p className="text-sm text-gray-600">High Risk Areas</p>
                        <p className="text-2xl font-bold text-danger-600 mt-2">
                            {incidents?.filter(i => i.severity === 'high' || i.severity === 'critical').length || 0}
                        </p>
                    </div>
                </Card>
                <Card padding={false}>
                    <div className="p-5">
                        <p className="text-sm text-gray-600">Responding</p>
                        <p className="text-2xl font-bold text-warning-600 mt-2">
                            {incidents?.filter(i => i.status === 'responding').length || 0}
                        </p>
                    </div>
                </Card>
                <Card padding={false}>
                    <div className="p-5">
                        <p className="text-sm text-gray-600">Resolved Today</p>
                        <p className="text-2xl font-bold text-success-600 mt-2">
                            {incidents?.filter(i => i.status === 'resolved').length || 0}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Map Container */}
            <Card padding={false}>
                <MapContainer
                    showIncidents={true}
                    showShelters={true}
                    showHazards={true}
                    onIncidentClick={handleIncidentClick}
                    height="calc(100vh - 400px)"
                />
            </Card>

            {/* Selected Incident Details */}
            {selectedIncident && (
                <Card title="Selected Incident">
                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {selectedIncident.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {selectedIncident.description}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <Badge
                                    variant={
                                        selectedIncident.severity === 'high' || selectedIncident.severity === 'critical'
                                            ? 'danger'
                                            : selectedIncident.severity === 'medium'
                                                ? 'warning'
                                                : 'success'
                                    }
                                >
                                    {selectedIncident.severity}
                                </Badge>
                                <Badge variant="default">{selectedIncident.status}</Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Type:</span>
                                <span className="ml-2 font-medium capitalize">{selectedIncident.type}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Location:</span>
                                <span className="ml-2 font-medium">
                                    {selectedIncident.Barangay?.name || 'Unknown'}
                                </span>
                            </div>
                        </div>

                        <div className="flex space-x-2">
                            <Button variant="primary" onClick={handleViewDetails}>
                                View Full Details
                            </Button>
                            <Button variant="secondary" onClick={() => setSelectedIncident(null)}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Legend */}
            <Card title="Map Legend">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-danger-600" />
                        <span>Critical/High Risk</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-warning-500" />
                        <span>Medium Risk</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-success-500" />
                        <span>Low Risk</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-primary-600" />
                        <span>Shelters</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MapView;
