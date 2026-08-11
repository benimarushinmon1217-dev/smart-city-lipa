/**
 * ModerationQueue Component
 * Review and moderate pending reports
 */

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import { Card, Badge, Button, EmptyState, Spinner } from '../common';
import { useReports } from '../../hooks/useReports';
import { useSocket } from '../../hooks/useSocket';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const ModerationQueue = () => {
    const [selectedReport, setSelectedReport] = useState(null);
    const { reports, refetch, verifyReport, rejectReport, isVerifying, isRejecting } = useReports({ status: 'pending', limit: 5 });
    const { on, off } = useSocket();

    // Real-time updates
    useEffect(() => {
        on('report:new', () => refetch());
        on('report:verified', () => refetch());
        on('report:rejected', () => refetch());

        return () => {
            off('report:new');
            off('report:verified');
            off('report:rejected');
        };
    }, [on, off, refetch]);

    const handleVerify = (reportId) => {
        if (window.confirm('Verify this report and create an incident?')) {
            verifyReport(reportId, {
                onSuccess: () => {
                    setSelectedReport(null);
                },
            });
        }
    };

    const handleReject = (reportId) => {
        const reason = window.prompt('Reason for rejection (optional):');
        if (reason !== null) {
            rejectReport({ id: reportId, reason }, {
                onSuccess: () => {
                    setSelectedReport(null);
                },
            });
        }
    };

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-warning-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Moderation Queue</h3>
                    {reports.length > 0 && (
                        <Badge variant="warning">{reports.length}</Badge>
                    )}
                </div>
                <Link to="/admin/reports">
                    <Button variant="ghost" size="sm">
                        View All
                    </Button>
                </Link>
            </div>

            {reports.length === 0 ? (
                <EmptyState
                    icon={CheckCircle}
                    title="All caught up!"
                    description="No reports pending review"
                />
            ) : (
                <div className="space-y-3">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            className={`
                p-3 rounded-lg border transition-colors cursor-pointer
                ${selectedReport?.id === report.id
                                    ? 'bg-primary-50 border-primary-200'
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                }
              `}
                            onClick={() => setSelectedReport(report)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                        {report.title}
                                    </h4>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                        {report.description}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <Badge variant="default" size="sm">
                                            {report.type}
                                        </Badge>
                                        <span className="text-xs text-gray-500">
                                            {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions (show when selected) */}
                            {selectedReport?.id === report.id && (
                                <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-200">
                                    <Button
                                        variant="success"
                                        size="sm"
                                        fullWidth
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleVerify(report.id);
                                        }}
                                        loading={isVerifying}
                                        disabled={isVerifying || isRejecting}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Verify
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        fullWidth
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReject(report.id);
                                        }}
                                        loading={isRejecting}
                                        disabled={isVerifying || isRejecting}
                                    >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Reject
                                    </Button>
                                    <Link to={`/reports/${report.id}`} onClick={(e) => e.stopPropagation()}>
                                        <Button variant="secondary" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default ModerationQueue;
