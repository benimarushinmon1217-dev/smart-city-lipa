/**
 * Analytics Page
 * Admin analytics and reporting dashboard
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    TrendingUp,
    Users,
    AlertTriangle,
    MapPin,
    Download,
    BarChart3,
    PieChart,
    Activity
} from 'lucide-react';
import { Card, Badge, Button, Spinner, Select } from '../../components/common';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api.config';

const Analytics = () => {
    const [timeRange, setTimeRange] = useState('7d');

    const { data: analyticsData, isLoading } = useQuery({
        queryKey: ['admin-analytics', timeRange],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.ADMIN.ANALYTICS, {
                params: { timeRange },
            });
            return response.data;
        },
        retry: 1,
    });

    const stats = analyticsData || {};

    const handleExport = () => {
        const csvData = [
            ['Metric', 'Value'],
            ['Total Incidents', stats.totalIncidents || 0],
            ['Active Users', stats.activeUsers || 0],
            ['Avg Response Time', `${stats.avgResponseTime || 0}m`],
            ['Critical Events', stats.criticalEvents || 0],
            ['Time Range', timeRange],
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                        <BarChart3 className="h-8 w-8 text-primary-600" />
                        <span>Analytics & Reports</span>
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        System-wide analytics and performance metrics
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                        <option value="all">All Time</option>
                    </Select>
                    <Button variant="secondary" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card padding={false} className="border-l-4 border-primary-500">
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Incidents</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {stats.totalIncidents || 0}
                                </p>
                                <p className={`mt-1 text-xs ${stats.incidentGrowth >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {stats.incidentGrowth >= 0 ? '+' : ''}{stats.incidentGrowth || 0}% from last period
                                </p>
                            </div>
                            <AlertTriangle className="h-12 w-12 text-primary-200" />
                        </div>
                    </div>
                </Card>

                <Card padding={false} className="border-l-4 border-success-500">
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Users</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {stats.activeUsers || 0}
                                </p>
                                <p className={`mt-1 text-xs ${stats.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {stats.userGrowth >= 0 ? '+' : ''}{stats.userGrowth || 0}% growth
                                </p>
                            </div>
                            <Users className="h-12 w-12 text-success-200" />
                        </div>
                    </div>
                </Card>

                <Card padding={false} className="border-l-4 border-warning-500">
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Response Time</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {stats.avgResponseTime || 0}m
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Average response time
                                </p>
                            </div>
                            <Activity className="h-12 w-12 text-warning-200" />
                        </div>
                    </div>
                </Card>

                <Card padding={false} className="border-l-4 border-danger-500">
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Critical Events</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {stats.criticalEvents || 0}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    High priority incidents
                                </p>
                            </div>
                            <AlertTriangle className="h-12 w-12 text-danger-200" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Incident Trends */}
                <Card title="Incident Trends">
                    {stats.incidentsOverTime && stats.incidentsOverTime.length > 0 ? (
                        <div className="space-y-2">
                            {stats.incidentsOverTime.map((item, index) => {
                                const maxCount = Math.max(...stats.incidentsOverTime.map(i => parseInt(i.count)));
                                const width = maxCount > 0 ? (parseInt(item.count) / maxCount) * 100 : 0;
                                return (
                                    <div key={index} className="flex items-center space-x-2">
                                        <span className="text-xs text-gray-600 w-24">
                                            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                                            <div
                                                className="bg-primary-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                style={{ width: `${width}%` }}
                                            >
                                                <span className="text-xs font-medium text-white">{item.count}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">No incident data available</p>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Incident Types Distribution */}
                <Card title="Incident Types">
                    {stats.incidentsByType && stats.incidentsByType.length > 0 ? (
                        <div className="space-y-3">
                            {stats.incidentsByType.map((item, index) => {
                                const total = stats.incidentsByType.reduce((sum, i) => sum + parseInt(i.count), 0);
                                const percentage = total > 0 ? Math.round((parseInt(item.count) / total) * 100) : 0;
                                const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
                                return (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700 capitalize">
                                                {item.incident_type?.replace('_', ' ')}
                                            </span>
                                            <span className="text-sm text-gray-600">{percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className={`${colors[index % colors.length]} h-3 rounded-full`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <PieChart className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">No type data available</p>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Severity Distribution */}
                <Card title="Incident Severity">
                    {stats.incidentsBySeverity && stats.incidentsBySeverity.length > 0 ? (
                        <div className="space-y-3">
                            {stats.incidentsBySeverity.map((item, index) => {
                                const total = stats.incidentsBySeverity.reduce((sum, i) => sum + parseInt(i.count), 0);
                                const percentage = total > 0 ? Math.round((parseInt(item.count) / total) * 100) : 0;
                                const severityColors = {
                                    low: 'bg-green-500',
                                    medium: 'bg-yellow-500',
                                    high: 'bg-orange-500',
                                    critical: 'bg-red-500'
                                };
                                return (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700 capitalize">
                                                {item.severity}
                                            </span>
                                            <span className="text-sm text-gray-600">{item.count} ({percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className={`${severityColors[item.severity] || 'bg-gray-500'} h-3 rounded-full`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">No severity data available</p>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Response Performance */}
                <Card title="Response Performance">
                    {stats.responsePerformance && stats.responsePerformance.length > 0 ? (
                        <div className="space-y-2">
                            {stats.responsePerformance.map((item, index) => {
                                const maxMinutes = Math.max(...stats.responsePerformance.map(i => parseFloat(i.avgMinutes)));
                                const width = maxMinutes > 0 ? (parseFloat(item.avgMinutes) / maxMinutes) * 100 : 0;
                                return (
                                    <div key={index} className="flex items-center space-x-2">
                                        <span className="text-xs text-gray-600 w-24">
                                            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                                            <div
                                                className="bg-success-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                style={{ width: `${width}%` }}
                                            >
                                                <span className="text-xs font-medium text-white">
                                                    {Math.round(item.avgMinutes)}m
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">No response data available</p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* Top Barangays */}
            <Card title="Most Affected Barangays">
                <div className="space-y-3">
                    {(stats.topBarangays || []).length === 0 ? (
                        <div className="text-center py-8">
                            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-500">No data available</p>
                        </div>
                    ) : (
                        (stats.topBarangays || []).map((barangay, index) => (
                            <div
                                key={barangay.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
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
                                            Risk Level: {barangay.riskLevel}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="danger">
                                    {barangay.incidentCount} incidents
                                </Badge>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            {/* System Performance */}
            <Card title="System Performance">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">API Uptime</span>
                            <Badge variant="success" size="sm">Healthy</Badge>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.apiUptime || '99.9'}%
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Avg Load Time</span>
                            <Badge variant="success" size="sm">Fast</Badge>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.avgLoadTime || '1.2'}s
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Page load average</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Active Sessions</span>
                            <Badge variant="default" size="sm">Live</Badge>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.activeSessions || 0}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Current users online</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Analytics;
