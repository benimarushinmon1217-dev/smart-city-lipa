/**
 * LiveIncidentFeed Component
 * Real-time incident activity feed with Socket.io integration
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Clock, MapPin, TrendingUp } from 'lucide-react';
import { Card, Badge, Button, EmptyState, Spinner } from '../common';
import { useIncidents } from '../../hooks/useIncidents';
import { useSocket } from '../../hooks/useSocket';

const LiveIncidentFeed = ({ limit = 10, showHeader = true }) => {
    const [recentActivity, setRecentActivity] = useState([]);
    const { incidents, isLoading, refetch } = useIncidents({
        limit,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
    });
    const { on, off } = useSocket();

    useEffect(() => {
        if (incidents) {
            setRecentActivity(incidents);
        }
    }, [incidents]);

    // Real-time updates
    useEffect(() => {
        // New incident reported
        on('incident:new', (incident) => {
            setRecentActivity(prev => [incident, ...prev].slice(0, limit));
            refetch();
        });

        // Incident updated
        on('incident:updated', (incident) => {
            setRecentActivity(prev =>
                prev.map(item => item.id === incident.id ? incident : item)
            );
            refetch();
        });

        // Incident deleted
        on('incident:deleted', (incidentId) => {
            setRecentActivity(prev =>
                prev.filter(item => item.id !== incidentId)
            );
            refetch();
        });

        return () => {
            off('incident:new');
            off('incident:updated');
            off('incident:deleted');
        };
    }, [on, off, refetch, limit]);

    if (isLoading) {
        return (
            <Card title={showHeader ? "Live Incident Feed" : undefined}>
                <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                </div>
            </Card>
        );
    }

    return (
        <Card
            title={showHeader ? "Live Incident Feed" : undefined}
            subtitle={showHeader ? "Real-time incident updates" : undefined}
        >
            {/* Live Indicator */}
            <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-danger-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">Live Updates</span>
                </div>
                <div className="ml-auto text-xs text-gray-500">
                    {recentActivity.length} recent incidents
                </div>
            </div>

            {/* Activity Feed */}
            {recentActivity.length === 0 ? (
                <EmptyState
                    icon={AlertTriangle}
                    title="No recent incidents"
                    description="No incidents have been reported recently."
                />
            ) : (
                <div className="space-y-3">
                    {recentActivity.map((incident) => (
                        <div
                            key={incident.id}
                            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                            {/* Icon */}
                            <div className={`
                flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                ${incident.severity === 'critical' || incident.severity === 'high'
                                    ? 'bg-danger-100'
                                    : incident.severity === 'medium'
                                        ? 'bg-warning-100'
                                        : 'bg-success-100'
                                }
              `}>
                                <AlertTriangle className={`
                  h-5 w-5
                  ${incident.severity === 'critical' || incident.severity === 'high'
                                        ? 'text-danger-600'
                                        : incident.severity === 'medium'
                                            ? 'text-warning-600'
                                            : 'text-success-600'
                                    }
                `} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <Link
                                            to={`/incidents/${incident.id}`}
                                            className="text-sm font-medium text-gray-900 hover:text-primary-600 line-clamp-1"
                                        >
                                            {incident.title}
                                        </Link>
                                        {incident.description && (
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                {incident.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end space-y-1 ml-2">
                                        <Badge
                                            variant={
                                                incident.severity === 'critical' || incident.severity === 'high'
                                                    ? 'danger'
                                                    : incident.severity === 'medium'
                                                        ? 'warning'
                                                        : 'success'
                                            }
                                            size="sm"
                                        >
                                            {incident.severity}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Meta Info */}
                                <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="h-3 w-3" />
                                        <span>{incident.Barangay?.name || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="h-3 w-3" />
                                        <span>
                                            {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <Badge variant="default" size="sm">
                                        {incident.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* View All Button */}
            {recentActivity.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                    <Link to="/incidents">
                        <Button variant="ghost" size="sm">
                            View All Incidents
                        </Button>
                    </Link>
                </div>
            )}
        </Card>
    );
};

export default LiveIncidentFeed;
