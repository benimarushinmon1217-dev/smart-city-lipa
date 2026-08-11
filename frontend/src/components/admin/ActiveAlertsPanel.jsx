/**
 * ActiveAlertsPanel Component
 * Display active emergency alerts and warnings
 */

import { useState, useEffect } from 'react';
import { AlertTriangle, Bell, X, Radio } from 'lucide-react';
import { Card, Badge, Button } from '../common';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api.config';
import { useSocket } from '../../hooks/useSocket';
import { formatDistanceToNow } from 'date-fns';

const ActiveAlertsPanel = () => {
    const [alerts, setAlerts] = useState([]);
    const { on, off } = useSocket();

    // Fetch active alerts - DISABLED until backend implements endpoint
    const { data: alertsData, refetch, isError } = useQuery({
        queryKey: ['active-alerts'],
        queryFn: async () => {
            // Return empty data instead of calling non-existent endpoint
            return { data: [] };
        },
        enabled: false, // Disable this query
        retry: false,
    });

    useEffect(() => {
        if (alertsData?.data) {
            setAlerts(alertsData.data);
        }
    }, [alertsData]);

    // Real-time alert updates
    useEffect(() => {
        if (isError) return; // Skip socket setup if API is not available

        on('alert:emergency', (alert) => {
            setAlerts(prev => [alert, ...prev]);
            refetch();
        });

        on('alert:cleared', (alertId) => {
            setAlerts(prev => prev.filter(a => a.id !== alertId));
            refetch();
        });

        return () => {
            off('alert:emergency');
            off('alert:cleared');
        };
    }, [on, off, refetch]);

    const getAlertIcon = (type) => {
        switch (type) {
            case 'emergency':
                return <AlertTriangle className="h-5 w-5 text-danger-600" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-warning-600" />;
            case 'evacuation':
                return <Radio className="h-5 w-5 text-danger-600" />;
            default:
                return <Bell className="h-5 w-5 text-blue-600" />;
        }
    };

    const getAlertColor = (priority) => {
        switch (priority) {
            case 'critical':
                return 'border-danger-500 bg-danger-50';
            case 'high':
                return 'border-warning-500 bg-warning-50';
            case 'medium':
                return 'border-blue-500 bg-blue-50';
            default:
                return 'border-gray-300 bg-gray-50';
        }
    };

    const handleDismiss = (alertId) => {
        // TODO: Implement alert dismissal
        setAlerts(prev => prev.filter(a => a.id !== alertId));
    };

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-danger-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
                    {alerts.length > 0 && (
                        <Badge variant="danger" className="animate-pulse">
                            {alerts.length}
                        </Badge>
                    )}
                </div>
            </div>

            {alerts.length === 0 ? (
                <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No active alerts</p>
                    <p className="text-xs text-gray-400 mt-1">System is operating normally</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`
                p-4 rounded-lg border-l-4 transition-all
                ${getAlertColor(alert.priority)}
                ${alert.priority === 'critical' ? 'animate-pulse' : ''}
              `}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                    {/* Icon */}
                                    <div className="flex-shrink-0 mt-0.5">
                                        {getAlertIcon(alert.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h4 className="text-sm font-semibold text-gray-900">
                                                {alert.title}
                                            </h4>
                                            <Badge
                                                variant={
                                                    alert.priority === 'critical' ? 'danger' :
                                                        alert.priority === 'high' ? 'warning' : 'default'
                                                }
                                                size="sm"
                                            >
                                                {alert.priority}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2">
                                            {alert.message}
                                        </p>
                                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                                            <span>
                                                {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                                            </span>
                                            {alert.target && (
                                                <>
                                                    <span>•</span>
                                                    <span className="capitalize">
                                                        Target: {alert.target === 'all' ? 'City-wide' : alert.target}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dismiss Button */}
                                <button
                                    onClick={() => handleDismiss(alert.id)}
                                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors ml-2"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default ActiveAlertsPanel;
