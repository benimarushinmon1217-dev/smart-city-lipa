/**
 * RoadStatusOverlay Component
 * Display dynamic road conditions on map
 */

import { useEffect } from 'react';
import { Polyline, Popup, CircleMarker } from 'react-leaflet';
import { Badge } from '../common';
import { useRoadStatus, getRoadStatusIcon, ROAD_STATUS } from '../../hooks/useRoadStatus';

const RoadStatusOverlay = () => {
    const { roadStatuses, refetch } = useRoadStatus();

    // Get color based on road status
    const getRoadColor = (status) => {
        switch (status) {
            case ROAD_STATUS.CLEAR:
                return '#22c55e'; // green
            case ROAD_STATUS.FLOODED:
                return '#3b82f6'; // blue
            case ROAD_STATUS.BLOCKED:
                return '#dc2626'; // red
            case ROAD_STATUS.INACCESSIBLE:
                return '#7f1d1d'; // dark red
            case ROAD_STATUS.CONGESTED:
                return '#f59e0b'; // amber
            case ROAD_STATUS.HAZARDOUS:
                return '#ea580c'; // orange
            case ROAD_STATUS.UNDER_REPAIR:
                return '#6b7280'; // gray
            default:
                return '#9ca3af'; // light gray
        }
    };

    // Get line style based on status
    const getLineStyle = (status) => {
        const baseStyle = {
            weight: 6,
            opacity: 0.8,
        };

        switch (status) {
            case ROAD_STATUS.BLOCKED:
            case ROAD_STATUS.INACCESSIBLE:
                return { ...baseStyle, dashArray: '10, 10' };
            case ROAD_STATUS.HAZARDOUS:
                return { ...baseStyle, dashArray: '5, 5' };
            default:
                return baseStyle;
        }
    };

    if (!roadStatuses || roadStatuses.length === 0) {
        return null;
    }

    return (
        <>
            {roadStatuses.map((road) => {
                // Skip roads without coordinates
                if (!road.coordinates || road.coordinates.length < 2) {
                    return null;
                }

                const color = getRoadColor(road.status);
                const lineStyle = getLineStyle(road.status);

                // Convert coordinates to Leaflet format
                const positions = road.coordinates.map(coord => [coord.lat, coord.lng]);

                return (
                    <div key={road.id}>
                        {/* Road Line */}
                        <Polyline
                            positions={positions}
                            pathOptions={{
                                color: color,
                                ...lineStyle,
                            }}
                        >
                            <Popup>
                                <div className="p-2 min-w-[200px]">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-xl">{getRoadStatusIcon(road.status)}</span>
                                        <h4 className="font-semibold text-sm text-gray-900">
                                            {road.name || 'Unnamed Road'}
                                        </h4>
                                    </div>

                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <Badge
                                                variant={
                                                    road.status === ROAD_STATUS.CLEAR ? 'success' :
                                                        road.status === ROAD_STATUS.BLOCKED ||
                                                            road.status === ROAD_STATUS.INACCESSIBLE ? 'danger' :
                                                            road.status === ROAD_STATUS.CONGESTED ? 'warning' : 'default'
                                                }
                                                size="sm"
                                            >
                                                {road.status}
                                            </Badge>
                                        </div>

                                        {road.severity && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Severity:</span>
                                                <span className="font-medium capitalize">{road.severity}</span>
                                            </div>
                                        )}

                                        {road.reason && (
                                            <div className="mt-2">
                                                <span className="text-gray-600">Reason:</span>
                                                <p className="text-gray-900 mt-1">{road.reason}</p>
                                            </div>
                                        )}

                                        {road.estimatedClearTime && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Est. Clear:</span>
                                                <span className="font-medium">
                                                    {new Date(road.estimatedClearTime).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        )}

                                        {road.alternativeRoute && (
                                            <div className="mt-2 p-2 bg-blue-50 rounded">
                                                <p className="text-blue-700 text-xs">
                                                    ℹ️ Alternative route available
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Popup>
                        </Polyline>

                        {/* Status Markers at key points */}
                        {road.status !== ROAD_STATUS.CLEAR && positions.length > 0 && (
                            <CircleMarker
                                center={positions[Math.floor(positions.length / 2)]}
                                radius={8}
                                pathOptions={{
                                    color: 'white',
                                    fillColor: color,
                                    fillOpacity: 1,
                                    weight: 2,
                                }}
                            >
                                <Popup>
                                    <div className="text-center p-1">
                                        <span className="text-2xl">{getRoadStatusIcon(road.status)}</span>
                                        <p className="text-xs font-medium mt-1 capitalize">{road.status}</p>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default RoadStatusOverlay;
