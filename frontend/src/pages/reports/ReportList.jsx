/**
 * Report List Page
 * Display list of all user reports - API Integrated
 */

import { useState } from 'react';
import { Card, Badge, Button, EmptyState, Spinner, Pagination } from '../../components/common';
import { FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReports } from '../../hooks/useReports';
import { formatDistanceToNow } from 'date-fns';

const ReportList = () => {
    const [filters, setFilters] = useState({
        type: '',
        status: '',
        page: 1,
        limit: 10,
    });

    const { reports, pagination, isLoading, error } = useReports(filters);

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
                    <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        View and manage your submitted reports
                    </p>
                </div>
                <Link to="/reports/new">
                    <Button variant="primary">
                        <Plus className="h-5 w-5 mr-2" />
                        Submit Report
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
                        <option value="flood">Flood Report</option>
                        <option value="road_damage">Road Damage</option>
                        <option value="street_light">Street Light</option>
                        <option value="garbage">Garbage</option>
                        <option value="water_supply">Water Supply</option>
                        <option value="noise_complaint">Noise Complaint</option>
                        <option value="illegal_activity">Illegal Activity</option>
                        <option value="other">Other</option>
                    </select>
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </Card>

            {/* Report List */}
            {isLoading ? (
                <Card>
                    <div className="flex justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                </Card>
            ) : error ? (
                <Card>
                    <div className="text-center py-12 text-danger-600">
                        Error loading reports. Please try again.
                    </div>
                </Card>
            ) : (
                <>
                    <div className="space-y-4">
                        {reports && reports.length > 0 ? (
                            reports.map((report) => (
                                <Card key={report.id} hover>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {report.title}
                                                </h3>
                                                <Badge
                                                    variant={
                                                        report.status === 'verified'
                                                            ? 'success'
                                                            : report.status === 'rejected'
                                                                ? 'danger'
                                                                : 'warning'
                                                    }
                                                >
                                                    {report.status}
                                                </Badge>
                                            </div>
                                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                                <span>Type: {report.type}</span>
                                                <span>•</span>
                                                <span>Location: {report.location || 'Unknown'}</span>
                                                <span>•</span>
                                                <span>
                                                    {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                            {report.description && (
                                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                                    {report.description}
                                                </p>
                                            )}
                                        </div>
                                        <Link to={`/reports/${report.id}`}>
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
                                    icon={FileText}
                                    title="No reports found"
                                    description="You haven't submitted any reports yet."
                                    action={
                                        <Link to="/reports/new">
                                            <Button variant="primary">Submit Report</Button>
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

export default ReportList;
