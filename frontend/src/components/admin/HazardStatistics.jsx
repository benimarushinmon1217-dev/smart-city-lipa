/**
 * HazardStatistics Component
 * Real-time hazard and incident statistics
 */

import { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, MapPin, Activity } from 'lucide-react';
import { Card, Badge } from '../common';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api.config';
import { useSocket } from '../../hooks/useSocket';

const HazardStatistics = () => {
    const [stats, setStats] = useState(null);
    const { on, off } = useSocket();

    // Fetch hazard statistics - DISABLED until backend implements endpoint
    const { data: statsData, refetch, isError } = useQuery({
        queryKey: ['hazard-statistics'],
        queryFn: async () => {
            // Return empty data instead of calling non-existent endpoint
            return { data: {} };
        },
        enabled: false, // Disable this query
        retry: false,
    });

    useEffect(() => {
        if (statsData?.data) {
            setStats(statsData.data);
        }
    }, [statsData]);

    // Real-time updates
    useEffect(() => {
        if (isError) return; // Skip socket setup if API is not available

        on('incident:new', () => refetch());
        on('hazard:updated', () => refetch());

        return () => {
            off('incident:new');
            off('hazard:updated');
        };
    }, [on, off, refetch]);

    if (!stats) {
        return (
            <Card title="Hazard Statistics">
                <div className="text-center py-8 text-gray-500">
                    Loading statistics...
                </div>
            </Card>
        );
    }

    const incidentsByType = stats.incidentsByType || {};
    const incidentsBySeverity = stats.incidentsBySeverity || {};
    const topBarangays = stats.topBarangays || [];

    return (
        <Card>
            <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Hazard Statistics</h3>
            </div>

            <div className="space-y-6">
                {/* Incidents by Type */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Incidents by Type</h4>
                    <div className="space-y-2">
                        {Object.entries(incidentsByType).map(([type, count]) => {
                            const total = Object.values(incidentsByType).reduce((sum, c) => sum + c, 0);
                            const percentage = total > 0 ? (count / total) * 100 : 0;

                            return (
                                <div key={type}>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-gray-700 capitalize flex items-center space-x-2">
                                            <span>{getTypeIcon(type)}</span>
                                            <span>{type.replace('_', ' ')}</span>
                                        </span>
                                        <span className="font-medium text-gray-900">{count}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Incidents by Severity */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Severity Distribution</h4>
                    <div className="grid grid-cols-4 gap-2">
                        {Object.entries(incidentsBySeverity).map(([severity, count]) => (
                            <div
                                key={severity}
                                className={`
                  p-3 rounded-lg text-center
                  ${getSeverityColor(severity)}
                `}
                            >
                                <p className="text-2xl font-bold">{count}</p>
                                <p className="text-xs capitalize mt-1">{severity}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Affected Barangays */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Most Affected Areas</h4>
                    <div className="space-y-2">
                        {topBarangays.slice(0, 5).map((barangay, index) => (
                            <div
                                key={barangay.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${index === 0 ? 'bg-danger-100 text-danger-600' :
                                            index === 1 ? 'bg-warning-100 text-warning-600' :
                                                'bg-gray-200 text-gray-600'}
                  `}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {barangay.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Risk Level: <span className="capitalize">{barangay.risk_level}</span>
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="danger" size="sm">
                                    {barangay.incident_count} incidents
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">24-Hour Activity</h4>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <Activity className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                            <p className="text-xl font-bold text-blue-600">
                                {stats.last24Hours?.total || 0}
                            </p>
                            <p className="text-xs text-gray-600">Total</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                            <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
                            <p className="text-xl font-bold text-green-600">
                                {stats.last24Hours?.resolved || 0}
                            </p>
                            <p className="text-xs text-gray-600">Resolved</p>
                        </div>
                        <div className="bg-danger-50 rounded-lg p-3 text-center">
                            <AlertTriangle className="h-5 w-5 text-danger-600 mx-auto mb-1" />
                            <p className="text-xl font-bold text-danger-600">
                                {stats.last24Hours?.active || 0}
                            </p>
                            <p className="text-xs text-gray-600">Active</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

// Helper functions
const getTypeIcon = (type) => {
    const icons = {
        flood: '🌊',
        fire: '🔥',
        earthquake: '🏚️',
        landslide: '⛰️',
        typhoon: '🌀',
        road_blockage: '🚧',
        other: '⚠️',
    };
    return icons[type] || '📍';
};

const getSeverityColor = (severity) => {
    switch (severity) {
        case 'critical':
            return 'bg-danger-100 text-danger-600';
        case 'high':
            return 'bg-warning-100 text-warning-600';
        case 'medium':
            return 'bg-blue-100 text-blue-600';
        case 'low':
            return 'bg-success-100 text-success-600';
        default:
            return 'bg-gray-100 text-gray-600';
    }
};

export default HazardStatistics;
