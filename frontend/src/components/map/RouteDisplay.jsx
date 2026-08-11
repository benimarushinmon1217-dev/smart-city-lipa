/**
 * RouteDisplay Component
 * Display evacuation routes with risk visualization
 */

import { Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Badge } from '../common';

// Route waypoint icon
const createWaypointIcon = (index, isStart, isEnd) => {
    const color = isStart ? '#22c55e' : isEnd ? '#dc2626' : '#3b82f6';
    const label = isStart ? 'S' : isEnd ? 'E' : index;

    return L.divIcon({
        className: 'custom-waypoint-marker',
        html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">${label}</div>
    `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
    });
};

const RouteDisplay = ({ route }) => {
    if (!route || !route.path || route.path.length === 0) {
        return null;
    }

    // Parse route path
    const coordinates = route.path.map(point => [point.lat, point.lng]);

    // Determine route color based on risk level
    const getRiskColor = (riskLevel) => {
        switch (riskLevel) {
            case 'high':
                return '#dc2626'; // red
            case 'medium':
                return '#f59e0b'; // amber
            case 'low':
                return '#22c55e'; // green
            default:
                return '#3b82f6'; // blue
        }
    };

    const routeColor = getRiskColor(route.risk_level);

    return (
        <>
            {/* Route Line */}
            <Polyline
                positions={coordinates}
                pathOptions={{
                    color: routeColor,
                    weight: 5,
                    opacity: 0.8,
                    dashArray: route.status === 'unsafe' ? '10, 10' : null,
                }}
            >
                <Popup>
                    <div className="p-2">
                        <h4 className="font-semibold text-sm mb-2">Route Information</h4>
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Distance:</span>
                                <span className="font-medium">{route.distance} km</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Est. Time:</span>
                                <span className="font-medium">{route.duration} min</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Risk Level:</span>
                                <Badge
                                    variant={
                                        route.risk_level === 'high' ? 'danger' :
                                            route.risk_level === 'medium' ? 'warning' : 'success'
                                    }
                                    size="sm"
                                >
                                    {route.risk_level}
                                </Badge>
                            </div>
                            {route.hazards && route.hazards.length > 0 && (
                                <div className="mt-2">
                                    <span className="text-gray-600 font-medium">Hazards:</span>
                                    <ul className="mt-1 space-y-1">
                                        {route.hazards.map((hazard, index) => (
                                            <li key={index} className="text-gray-600">
                                                • {hazard}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </Popup>
            </Polyline>

            {/* Waypoint Markers */}
            {route.waypoints && route.waypoints.map((waypoint, index) => {
                const isStart = index === 0;
                const isEnd = index === route.waypoints.length - 1;
                const icon = createWaypointIcon(index + 1, isStart, isEnd);

                return (
                    <Marker
                        key={`waypoint-${index}`}
                        position={[waypoint.lat, waypoint.lng]}
                        icon={icon}
                    >
                        <Popup>
                            <div className="p-2">
                                <h4 className="font-semibold text-sm mb-1">
                                    {isStart ? 'Start Point' : isEnd ? 'Destination' : `Waypoint ${index + 1}`}
                                </h4>
                                {waypoint.name && (
                                    <p className="text-xs text-gray-600">{waypoint.name}</p>
                                )}
                                {waypoint.description && (
                                    <p className="text-xs text-gray-600 mt-1">{waypoint.description}</p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}

            {/* Hazard Warnings along route */}
            {route.hazard_points && route.hazard_points.map((hazard, index) => (
                <Marker
                    key={`hazard-${index}`}
                    position={[hazard.lat, hazard.lng]}
                    icon={L.divIcon({
                        className: 'hazard-warning',
                        html: `
              <div style="
                background-color: #fef3c7;
                border: 2px solid #f59e0b;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
              ">⚠️</div>
            `,
                        iconSize: [24, 24],
                        iconAnchor: [12, 12],
                    })}
                >
                    <Popup>
                        <div className="p-2">
                            <h4 className="font-semibold text-sm mb-1 text-warning-600">
                                ⚠️ Hazard Warning
                            </h4>
                            <p className="text-xs text-gray-600">{hazard.description}</p>
                            {hazard.severity && (
                                <Badge variant="warning" size="sm" className="mt-1">
                                    {hazard.severity}
                                </Badge>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

export default RouteDisplay;
