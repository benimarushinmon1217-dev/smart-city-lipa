/**
 * Dashboard Page
 * Main dashboard with statistics and quick actions - API Integrated
 */

import { useState, useEffect } from 'react';
import { AlertTriangle, FileText, Bell, MapPin } from 'lucide-react';
import { Card, Badge, Button, Spinner } from '../../components/common';
import EmergencyAlertModal from '../../components/EmergencyAlertModal';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useIncidents } from '../../hooks/useIncidents';
import { useReports } from '../../hooks/useReports';
import { useNotifications } from '../../hooks/useNotifications';
import { useSocket } from '../../hooks/useSocket';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuthStore();
    const { on, off, connect } = useSocket();
    const [emergencyAlert, setEmergencyAlert] = useState(null);

    // Fetch data from API
    const { incidents, isLoading: loadingIncidents, refetch: refetchIncidents } = useIncidents({
        limit: 5
    });

    const { reports, isLoading: loadingReports, refetch: refetchReports } = useReports({
        status: 'pending',
        limit: 5
    });

    const { unreadCount } = useNotifications();
    // Real-time updates - only refetch data, toasts handled by useSocketEvents
    useEffect(() => {
        connect();

        // Listen for new incidents
        on('incident:new', (data) => {
            console.log('🔴 [DASHBOARD] New incident received:', data);
            refetchIncidents();
            // Toast is handled by useSocketEvents hook
        });

        // Listen for incident updates
        on('incident:updated', () => {
            refetchIncidents();
        });

        // Listen for incident verification
        on('incident:verified', () => {
            refetchIncidents();
        });

        // Listen for new reports
        on('report:new', () => {
            refetchReports();
            // Toast is handled by useSocketEvents hook
        });

        // Listen for report updates
        on('report:updated', () => {
            refetchReports();
        });

        // Listen for emergency alerts - SHOW MODAL
        on('emergency:alert', (data) => {
            console.log('🚨 [DASHBOARD] Emergency alert received:', data);
            setEmergencyAlert(data);
            // Toast is handled by useSocketEvents hook
        });

        // Listen for announcements - SHOW MODAL for urgent ones
        on('announcement:new', (data) => {
            console.log('📢 [DASHBOARD] Announcement received:', data);
            const priority = data?.announcement?.priority || data?.priority;
            const type = data?.announcement?.type || data?.type;

            // Show modal for urgent/high priority or emergency type
            if (priority === 'urgent' || priority === 'high' || type === 'emergency' || type === 'evacuation') {
                setEmergencyAlert(data);
            }
            // Toast is handled by useSocketEvents hook
        });

        return () => {
            off('incident:new');
            off('incident:updated');
            off('incident:verified');
            off('report:new');
            off('report:updated');
            off('notification:new');
            off('emergency:alert');
            off('announcement:new');
        };
    }, [on, off, connect, refetchIncidents, refetchReports]);

    // DEBUG: Log incidents data
    console.log('🔍 [DASHBOARD] Incidents data:', incidents);
    console.log('🔍 [DASHBOARD] Is loading:', loadingIncidents);
    console.log('🔍 [DASHBOARD] Incidents length:', incidents?.length);

    // Calculate stats from real data - "active" means not resolved or closed
    const activeIncidentsCount = incidents?.filter(i =>
        i.status !== 'resolved' && i.status !== 'closed'
    ).length || 0;
    const pendingReportsCount = reports?.filter(r => r.status === 'pending').length || 0;
    const highRiskCount = incidents?.filter(i => i.severity === 'high').length || 0;

    console.log('🔍 [DASHBOARD] Active incidents count:', activeIncidentsCount);
    console.log('🔍 [DASHBOARD] Pending reports count:', pendingReportsCount);
    console.log('🔍 [DASHBOARD] High risk count:', highRiskCount);

    const stats = [
        {
            name: 'Active Incidents',
            value: activeIncidentsCount.toString(),
            icon: AlertTriangle,
            color: 'text-danger-600',
            bgColor: 'bg-danger-50',
            change: loadingIncidents ? 'Loading...' : `${activeIncidentsCount} active`,
        },
        {
            name: 'Pending Reports',
            value: pendingReportsCount.toString(),
            icon: FileText,
            color: 'text-warning-600',
            bgColor: 'bg-warning-50',
            change: loadingReports ? 'Loading...' : `${pendingReportsCount} need review`,
        },
        {
            name: 'Unread Notifications',
            value: unreadCount.toString(),
            icon: Bell,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            change: 'New alerts',
        },
        {
            name: 'High Risk Areas',
            value: highRiskCount.toString(),
            icon: MapPin,
            color: 'text-danger-600',
            bgColor: 'bg-danger-50',
            change: 'Requires attention',
        },
    ];

    // Get recent incidents from API
    const recentIncidents = incidents?.slice(0, 5) || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.first_name}!
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    Here's what's happening in Lipa City today
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.name} padding={false} hover>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                                <p className="mt-2 text-sm text-gray-500">{stat.change}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <Card title="Quick Actions">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/incidents/new">
                        <Button variant="primary" fullWidth>
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            Report Incident
                        </Button>
                    </Link>
                    <Link to="/map">
                        <Button variant="secondary" fullWidth>
                            <MapPin className="h-5 w-5 mr-2" />
                            View Map
                        </Button>
                    </Link>
                    <Link to="/reports/new">
                        <Button variant="secondary" fullWidth>
                            <FileText className="h-5 w-5 mr-2" />
                            Submit Report
                        </Button>
                    </Link>
                </div>
            </Card>

            {/* Recent Incidents */}
            <Card title="Recent Incidents" subtitle="Latest reported incidents in your area">
                {loadingIncidents ? (
                    <div className="flex justify-center py-8">
                        <Spinner size="lg" />
                    </div>
                ) : recentIncidents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No recent incidents
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentIncidents.map((incident) => (
                            <div
                                key={incident.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-gray-900">{incident.title}</h4>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Badge
                                        variant={
                                            incident.severity === 'critical' || incident.severity === 'high'
                                                ? 'danger'
                                                : incident.severity === 'medium'
                                                    ? 'warning'
                                                    : 'success'
                                        }
                                    >
                                        {incident.severity}
                                    </Badge>
                                    <Badge variant="default">{incident.status}</Badge>
                                    <Link to={`/incidents/${incident.id}`}>
                                        <Button size="sm" variant="ghost">
                                            View
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-4 text-center">
                    <Link to="/incidents">
                        <Button variant="ghost">View All Incidents</Button>
                    </Link>
                </div>
            </Card>

            {/* Emergency Alert Modal */}
            {emergencyAlert && (
                <EmergencyAlertModal
                    alert={emergencyAlert}
                    onClose={() => setEmergencyAlert(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;
