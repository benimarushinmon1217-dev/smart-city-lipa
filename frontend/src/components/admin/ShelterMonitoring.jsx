/**
 * ShelterMonitoring Component
 * Real-time shelter capacity and status monitoring
 */

import { useState, useEffect } from 'react';
import { Home, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, Badge, Button } from '../common';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api.config';
import { useSocket } from '../../hooks/useSocket';
import { Link } from 'react-router-dom';

const ShelterMonitoring = () => {
    const [shelters, setShelters] = useState([]);
    const { on, off } = useSocket();

    // Fetch shelters
    const { data: sheltersData, refetch } = useQuery({
        queryKey: ['admin-shelters'], // Use same key as ShelterManagement
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.ESTABLISHMENTS.LIST, {
                params: { type: 'evacuation' }, // Fixed: use 'evacuation' not 'shelter'
            });
            return response.data;
        },
    });

    useEffect(() => {
        if (sheltersData?.establishments) {
            setShelters(sheltersData.establishments);
        } else if (sheltersData?.data) {
            setShelters(sheltersData.data);
        } else if (Array.isArray(sheltersData)) {
            setShelters(sheltersData);
        }
    }, [sheltersData]);

    // Real-time shelter updates
    useEffect(() => {
        on('shelter:updated', () => refetch());
        on('shelter:capacity', () => refetch());

        return () => {
            off('shelter:updated');
            off('shelter:capacity');
        };
    }, [on, off, refetch]);

    const calculateOccupancy = (shelter) => {
        if (!shelter.capacity || !shelter.current_occupancy) return 0;
        return Math.round((shelter.current_occupancy / shelter.capacity) * 100);
    };

    const getStatusBadge = (shelter) => {
        const occupancy = calculateOccupancy(shelter);

        if (shelter.status === 'unavailable' || shelter.status === 'damaged') {
            return <Badge variant="danger" size="sm">Unavailable</Badge>;
        }

        if (occupancy >= 100) {
            return <Badge variant="danger" size="sm">Full</Badge>;
        }

        if (occupancy >= 80) {
            return <Badge variant="warning" size="sm">Near Capacity</Badge>;
        }

        return <Badge variant="success" size="sm">Available</Badge>;
    };

    const getOccupancyColor = (occupancy) => {
        if (occupancy >= 100) return 'bg-danger-600';
        if (occupancy >= 80) return 'bg-warning-500';
        if (occupancy >= 50) return 'bg-blue-500';
        return 'bg-success-500';
    };

    // Calculate summary stats
    const totalCapacity = shelters.reduce((sum, s) => sum + (s.capacity || 0), 0);
    const totalOccupancy = shelters.reduce((sum, s) => sum + (s.current_occupancy || 0), 0);
    const availableShelters = shelters.filter(s =>
        s.status === 'available' && calculateOccupancy(s) < 100
    ).length;
    const criticalShelters = shelters.filter(s =>
        calculateOccupancy(s) >= 80 || s.status === 'unavailable'
    ).length;

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Home className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Shelter Status</h3>
                </div>
                <Link to="/admin/shelters">
                    <Button variant="ghost" size="sm">
                        Manage
                    </Button>
                </Link>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                        <Home className="h-4 w-4 text-gray-600" />
                        <span className="text-xs text-gray-600">Available</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{availableShelters}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-warning-600" />
                        <span className="text-xs text-gray-600">Critical</span>
                    </div>
                    <p className="text-2xl font-bold text-warning-600">{criticalShelters}</p>
                </div>
            </div>

            {/* Overall Capacity */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Capacity</span>
                    <span className="text-sm font-bold text-gray-900">
                        {totalOccupancy} / {totalCapacity}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all ${getOccupancyColor((totalOccupancy / totalCapacity) * 100)
                            }`}
                        style={{ width: `${Math.min((totalOccupancy / totalCapacity) * 100, 100)}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {Math.round((totalOccupancy / totalCapacity) * 100)}% occupied
                </p>
            </div>

            {/* Shelter List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {shelters.slice(0, 5).map((shelter) => {
                    const occupancy = calculateOccupancy(shelter);

                    return (
                        <div
                            key={shelter.id}
                            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                        {shelter.name}
                                    </h4>
                                    <p className="text-xs text-gray-600 truncate">
                                        {shelter.address || 'No address'}
                                    </p>
                                </div>
                                {getStatusBadge(shelter)}
                            </div>

                            {/* Capacity Bar */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600">
                                        <Users className="h-3 w-3 inline mr-1" />
                                        {shelter.current_occupancy || 0} / {shelter.capacity || 0}
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {occupancy}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full transition-all ${getOccupancyColor(occupancy)}`}
                                        style={{ width: `${Math.min(occupancy, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {shelters.length > 5 && (
                <div className="mt-3 text-center">
                    <Link to="/admin/shelters">
                        <Button variant="ghost" size="sm">
                            View All {shelters.length} Shelters
                        </Button>
                    </Link>
                </div>
            )}
        </Card>
    );
};

export default ShelterMonitoring;
