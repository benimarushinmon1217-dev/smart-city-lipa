/**
 * IncidentMarkers Component
 * Display incident markers on map with real-time updates
 */

import { Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { formatDistanceToNow } from 'date-fns';
import { Badge, Button } from '../common';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on severity
const createCustomIcon = (severity, type) => {
    const colors = {
        critical: '#dc2626', // red-600
        high: '#ea580c',     // orange-600
        medium: '#f59e0b',   // amber-500
        low: '#22c55e',      // green-500
    };

    const icons = {
        flood: '🌊',
        fire: '🔥',
        earthquake: '🏚️',
        landslide: '⛰️',
        typhoon: '🌀',
        road_blockage: '🚧',
        other: '⚠️',
    };

    const color = colors[severity] || colors.medium;
    const icon = icons[type] || icons.other;

    return L.divIcon({
        className: 'custom-marker',
        html: `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 18px;
        ">${icon}</span>
      </div>
    `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
    });
};

const IncidentMarkers = ({ incidents = [], onIncidentClick }) => {
    if (!incidents || incidents.length === 0) {
        return null;
    }

    return (
        <>
            {incidents.map((incident) => {
                // Skip incidents without coordinates
                if (!incident.latitude || !incident.longitude) {
                    return null;
                }

                const position = [parseFloat(incident.latitude), parseFloat(incident.longitude)];
                const icon = createCustomIcon(incident.severity, incident.incident_type || incident.type);

                return (
                    <Marker
                        key={incident.id}
                        position={position}
                        icon={icon}
                        eventHandlers={{
                            click: () => {
                                if (onIncidentClick) {
                                    onIncidentClick(incident);
                                }
                            },
                        }}
                    >
                        <Popup maxWidth={300} className="custom-popup">
                            <div className="p-2">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900 text-sm pr-2">
                                        {incident.title}
                                    </h3>
                                    <div className="flex flex-col space-y-1">
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
                                        <Badge variant="default" size="sm">
                                            {incident.status}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Description */}
                                {incident.description && (
                                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                        {incident.description}
                                    </p>
                                )}

                                {/* Details */}
                                <div className="space-y-1 mb-3 text-xs text-gray-500">
                                    <div className="flex items-center justify-between">
                                        <span>Type:</span>
                                        <span className="font-medium capitalize">{incident.incident_type || incident.type}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Location:</span>
                                        <span className="font-medium">
                                            {incident.barangay?.name || incident.Barangay?.name || 'Unknown'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Reported:</span>
                                        <span className="font-medium">
                                            {formatDistanceToNow(new Date(incident.createdAt || incident.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <Link to={`/incidents/${incident.id}`}>
                                    <Button variant="primary" size="sm" fullWidth>
                                        View Details
                                    </Button>
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
};

export default IncidentMarkers;
