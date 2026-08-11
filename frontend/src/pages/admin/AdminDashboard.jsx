/**
 * Admin Command Center
 * Centralized emergency operations dashboard
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button, Spinner } from '../../components/common';
import {
    AlertTriangle,
    Users,
    Radio,
    Home,
    Activity,
    TrendingUp,
    MapPin,
    Bell,
    Shield,
    Zap
} from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { useSocket } from '../../hooks/useSocket';
import LiveIncidentFeed from '../../components/incidents/LiveIncidentFeed';
import EmergencyBroadcast from '../../components/admin/EmergencyBroadcast';
import ModerationQueue from '../../components/admin/ModerationQueue';
import ActiveAlertsPanel from '../../components/admin/ActiveAlertsPanel';
import ShelterMonitoring from '../../components/admin/ShelterMonitoring';
import HazardStatistics from '../../components/admin/HazardStatistics';
import { formatDistanceToNow } from 'date-fns';

const AdminDashboard = () => {
    const [realtimeStats, setRealtimeStats] = useState(null);
    const { useDashboardStats } = useAdmin();
    const { data: statsData, isLoading, refetch } = useDashboardStats();
    const { on, off, connect } = useSocket();

    const stats = statsData?.data || {};

    // Connect to Socket.io for real-time updates
    useEffect(() => {
        connect();

        // Real-time statistics updates
        on('stats:updated', (data) => {
            setRealtimeStats(data);
            refetch();
        });

        // Incident updates
        on('incident:new', () => refetch());
        on('incident:updated', () => refetch());
        on('incident:deleted', () => refetch());

        // Report updates
        on('report:new', () => refetch());
        on('report:verified', () => refetch());
        on('report:rejected', () => refetch());

        // User updates
        on('user:registered', () => refetch());
        on('user:updated', () => refetch());
        on('user:online', () => refetch());
        on('user:offline', () => refetch());

        // Announcement updates
        on('announcement:new', () => refetch());

        // Shelter updates
        on('shelter:updated', () => refetch());
        on('alert:emergency', () => refetch());

        return () => {
            off('stats:updated');
            off('incident:new');
            off('report:new');
            off('alert:emergency');
        };
    }, [on, off, connect, refetch]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    const displayStats = realtimeStats || stats;

    // Calculate critical metrics
    const criticalIncidents = displayStats.incidents?.filter(
        i => i.severity === 'critical' || i.severity === 'high'
    ).length || 0;

    const activeAlerts = displayStats.activeAlerts || 0;
    const pendingReports = displayStats.pendingReports || 0;
    const evacuatingUsers = displayStats.evacuatingUsers || 0;
    const sheltersNearCapacity = displayStats.sheltersNearCapacity || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                        <Shield className="h-8 w-8 text-primary-600" />
                        <span>Emergency Operations Center</span>
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Real-time disaster management command center
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-green-700">System Operational</span>
                    </div>
                    <Button variant="danger" size="sm">
                        <Radio className="h-4 w-4 mr-2" />
                        Emergency Broadcast
                    </Button>
                </div>
            </div>

            {/* Critical Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Critical Incidents */}
                <Card padding={false} className="border-l-4 border-danger-500">
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-lg bg-danger-100`}>
                                <AlertTriangle className="h-6 w-6 text-danger-600" />
                            </div>
                            {criticalIncidents > 0 && (
                                <Badge variant="danger" className="animate-pulse">
                                    CRITICAL
                                </Badge>
                            )}
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-600">Critical Incidents</p>
                            <p className="mt-2 text-3xl font-bold text-danger-600">
                                {criticalIncidents}
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                                {displayStats.totalIncidents || 0} total active
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Active Alerts */}
                <Card padding={false} className="border-l-4 border-warning-500">
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="p-3 rounded-lg bg-warning-100">
                                <Bell className="h-6 w-6 text-warning-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                            <p className="mt-2 text-3xl font-bold text-warning-600">
                                {activeAlerts}
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                                System-wide notifications
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Pending Reports */}
                <Card padding={false} className="border-l-4 border-blue-500">
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="p-3 rounded-lg bg-blue-100">
                                <Activity className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-600">Pending Review</p>
                            <p className="mt-2 text-3xl font-bold text-blue-600">
                                {pendingReports}
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                                Reports awaiting moderation
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Evacuating Users */}
                <Card padding={false} className="border-l-4 border-purple-500">
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="p-3 rounded-lg bg-purple-100">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-600">Evacuating</p>
                            <p className="mt-2 text-3xl font-bold text-purple-600">
                                {evacuatingUsers}
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                                Users in evacuation
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Shelter Status */}
                <Card padding={false} className="border-l-4 border-green-500">
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="p-3 rounded-lg bg-green-100">
                                <Home className="h-6 w-6 text-green-600" />
                            </div>
                            {sheltersNearCapacity > 0 && (
                                <Badge variant="warning">
                                    {sheltersNearCapacity}
                                </Badge>
                            )}
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-600">Shelters</p>
                            <p className="mt-2 text-3xl font-bold text-green-600">
                                {displayStats.totalShelters || 0}
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                                {displayStats.availableShelters || 0} available
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Monitoring */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Active Alerts Panel */}
                    <ActiveAlertsPanel />

                    {/* Live Incident Feed */}
                    <LiveIncidentFeed limit={8} showHeader={true} />

                    {/* Hazard Statistics */}
                    <HazardStatistics />
                </div>

                {/* Right Column - Actions & Queue */}
                <div className="space-y-6">
                    {/* Emergency Broadcast */}
                    <EmergencyBroadcast />

                    {/* Moderation Queue */}
                    <ModerationQueue />

                    {/* Shelter Monitoring */}
                    <ShelterMonitoring />

                    {/* System Status */}
                    <Card title="System Status">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Zap className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-gray-700">Socket.io</span>
                                </div>
                                <Badge variant="success" size="sm">Connected</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Activity className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-gray-700">Database</span>
                                </div>
                                <Badge variant="success" size="sm">Healthy</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-gray-700">Map Services</span>
                                </div>
                                <Badge variant="success" size="sm">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-gray-700">AI Services</span>
                                </div>
                                <Badge variant="success" size="sm">Online</Badge>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card title="Quick Actions">
                        <div className="space-y-2">
                            <Link to="/admin/broadcast">
                                <Button variant="primary" fullWidth size="sm">
                                    <Radio className="h-4 w-4 mr-2" />
                                    Send Alert
                                </Button>
                            </Link>
                            <Link to="/admin/users">
                                <Button variant="secondary" fullWidth size="sm">
                                    <Users className="h-4 w-4 mr-2" />
                                    Manage Users
                                </Button>
                            </Link>
                            <Link to="/admin/shelters">
                                <Button variant="secondary" fullWidth size="sm">
                                    <Home className="h-4 w-4 mr-2" />
                                    Update Shelters
                                </Button>
                            </Link>
                            <Link to="/admin/analytics">
                                <Button variant="secondary" fullWidth size="sm">
                                    <Activity className="h-4 w-4 mr-2" />
                                    View Analytics
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Last Updated */}
            <div className="text-center text-xs text-gray-500">
                Last updated: {formatDistanceToNow(new Date(), { addSuffix: true })}
            </div>
        </div>
    );
};

export default AdminDashboard;
