/**
 * HazardOverlay Component
 * Display hazard overlays (flood zones, ashfall, wind direction)
 */

import { useEffect, useState } from 'react';
import { Circle, Polygon, Polyline, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api.config';
import { useSocket } from '../../hooks/useSocket';

const HazardOverlay = () => {
    const [hazards, setHazards] = useState([]);
    const { on, off } = useSocket();

    // Fetch hazard data
    const { data: hazardData, refetch } = useQuery({
        queryKey: ['hazards'],
        queryFn: async () => {
            // Fetch traffic/hazard data from backend
            const response = await api.get(API_ENDPOINTS.TRAFFIC.LIST);
            return response.data;
        },
        refetchInterval: 60000, // Refetch every minute
    });

    useEffect(() => {
        if (hazardData?.data) {
            setHazards(hazardData.data);
        }
    }, [hazardData]);

    // Real-time hazard updates
    useEffect(() => {
        on('hazard:flood', (data) => {
            refetch();
        });

        on('hazard:wind', (data) => {
            refetch();
        });

        on('hazard:ashfall', (data) => {
            refetch();
        });

        on('traffic:updated', (data) => {
            refetch();
        });

        return () => {
            off('hazard:flood');
            off('hazard:wind');
            off('hazard:ashfall');
            off('traffic:updated');
        };
    }, [on, off, refetch]);

    if (!hazards || hazards.length === 0) {
        return null;
    }

    return (
        <>
            {hazards.map((hazard) => {
                // Render different hazard types
                switch (hazard.type) {
                    case 'flood':
                        return renderFloodZone(hazard);
                    case 'wind':
                        return renderWindDirection(hazard);
                    case 'ashfall':
                        return renderAshfallZone(hazard);
                    case 'traffic':
                        return renderTrafficCongestion(hazard);
                    default:
                        return null;
                }
            })}
        </>
    );
};

// Render flood zone
const renderFloodZone = (hazard) => {
    if (!hazard.latitude || !hazard.longitude) return null;

    const position = [parseFloat(hazard.latitude), parseFloat(hazard.longitude)];
    const radius = hazard.radius || 500; // meters

    const color = hazard.severity === 'high' ? '#dc2626' :
        hazard.severity === 'medium' ? '#f59e0b' : '#3b82f6';

    return (
        <Circle
            key={`flood-${hazard.id}`}
            center={position}
            radius={radius}
            pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.2,
                weight: 2,
            }}
        >
            <Popup>
                <div className="p-2">
                    <h4 className="font-semibold text-sm mb-1">Flood Zone</h4>
                    <p className="text-xs text-gray-600">
                        Severity: <span className="font-medium capitalize">{hazard.severity}</span>
                    </p>
                    {hazard.description && (
                        <p className="text-xs text-gray-600 mt-1">{hazard.description}</p>
                    )}
                </div>
            </Popup>
        </Circle>
    );
};

// Render wind direction indicator
const renderWindDirection = (hazard) => {
    if (!hazard.latitude || !hazard.longitude) return null;

    const position = [parseFloat(hazard.latitude), parseFloat(hazard.longitude)];
    const windDirection = hazard.wind_direction || 0; // degrees
    const windSpeed = hazard.wind_speed || 0; // km/h

    // Calculate arrow endpoint based on wind direction
    const distance = 0.01; // degrees
    const radians = (windDirection * Math.PI) / 180;
    const endLat = position[0] + distance * Math.cos(radians);
    const endLng = position[1] + distance * Math.sin(radians);

    return (
        <Polyline
            key={`wind-${hazard.id}`}
            positions={[position, [endLat, endLng]]}
            pathOptions={{
                color: '#6366f1',
                weight: 3,
                opacity: 0.8,
            }}
        >
            <Popup>
                <div className="p-2">
                    <h4 className="font-semibold text-sm mb-1">Wind Direction</h4>
                    <p className="text-xs text-gray-600">
                        Direction: <span className="font-medium">{windDirection}°</span>
                    </p>
                    <p className="text-xs text-gray-600">
                        Speed: <span className="font-medium">{windSpeed} km/h</span>
                    </p>
                </div>
            </Popup>
        </Polyline>
    );
};

// Render ashfall zone
const renderAshfallZone = (hazard) => {
    if (!hazard.latitude || !hazard.longitude) return null;

    const position = [parseFloat(hazard.latitude), parseFloat(hazard.longitude)];
    const radius = hazard.radius || 1000; // meters

    return (
        <Circle
            key={`ashfall-${hazard.id}`}
            center={position}
            radius={radius}
            pathOptions={{
                color: '#78350f',
                fillColor: '#78350f',
                fillOpacity: 0.15,
                weight: 2,
                dashArray: '5, 5',
            }}
        >
            <Popup>
                <div className="p-2">
                    <h4 className="font-semibold text-sm mb-1">Ashfall Zone</h4>
                    <p className="text-xs text-gray-600">
                        Severity: <span className="font-medium capitalize">{hazard.severity}</span>
                    </p>
                    {hazard.description && (
                        <p className="text-xs text-gray-600 mt-1">{hazard.description}</p>
                    )}
                </div>
            </Popup>
        </Circle>
    );
};

// Render traffic congestion
const renderTrafficCongestion = (hazard) => {
    if (!hazard.latitude || !hazard.longitude) return null;

    const position = [parseFloat(hazard.latitude), parseFloat(hazard.longitude)];

    const color = hazard.congestion_level === 'high' ? '#dc2626' :
        hazard.congestion_level === 'medium' ? '#f59e0b' : '#22c55e';

    return (
        <Circle
            key={`traffic-${hazard.id}`}
            center={position}
            radius={200}
            pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.3,
                weight: 2,
            }}
        >
            <Popup>
                <div className="p-2">
                    <h4 className="font-semibold text-sm mb-1">Traffic Status</h4>
                    <p className="text-xs text-gray-600">
                        Congestion: <span className="font-medium capitalize">{hazard.congestion_level}</span>
                    </p>
                    {hazard.description && (
                        <p className="text-xs text-gray-600 mt-1">{hazard.description}</p>
                    )}
                </div>
            </Popup>
        </Circle>
    );
};

export default HazardOverlay;
