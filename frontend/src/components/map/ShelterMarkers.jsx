/**
 * ShelterMarkers Component
 * Display evacuation center markers with capacity and status
 */

import { useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import L from 'leaflet';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api.config';
import { useSocket } from '../../hooks/useSocket';
import { Badge, Button } from '../common';
import { Home, Phone, MapPin, Users } from 'lucide-react';

// Custom evacuation center icon
const createEvacuationIcon = (occupancyPercent, isOperational) => {
    const isFull = occupancyPercent >= 100;
    const color = !isOperational ? '#6b7280' : isFull ? '#dc2626' : occupancyPercent >= 80 ? '#f59e0b' : '#22c55e';

    return L.divIcon({
        className: 'custom-evacuation-marker',
        html: `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="font-size: 20px;">🏠</span>
      </div>
    `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
    });
};

const ShelterMarkers = () => {
    const { on, off } = useSocket();

    // Fetch evacuation centers
    const { data: centersData, refetch } = useQuery({
        queryKey: ['evacuation-centers'],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.ESTABLISHMENTS.EVACUATION_CENTERS);
            return response.data;
        },
    });

    // Real-time evacuation center updates
    useEffect(() => {
        on('evacuation:updated', () => {
            refetch();
        });

        on('evacuation:capacity', () => {
            refetch();
        });

        return () => {
            off('evacuation:updated');
            off('evacuation:capacity');
        };
    }, [on, off, refetch]);

    const centers = centersData?.centers || [];

    if (centers.length === 0) {
        return null;
    }

    return (
        <>
            {centers.map((center) => {
                if (!center.latitude || !center.longitude) {
                    return null;
                }

                const position = [parseFloat(center.latitude), parseFloat(center.longitude)];
                const occupancyPercent = center.current_occupancy && center.capacity
                    ? (center.current_occupancy / center.capacity) * 100
                    : 0;

                const icon = createEvacuationIcon(occupancyPercent, center.is_operational);

                // Parse facilities if it's a JSON string
                let facilities = [];
                if (center.facilities) {
                    try {
                        facilities = typeof center.facilities === 'string'
                            ? JSON.parse(center.facilities)
                            : center.facilities;
                    } catch (e) {
                        facilities = [];
                    }
                }

                return (
                    <Marker
                        key={center.id}
                        position={position}
                        icon={icon}
                    >
                        <Popup maxWidth={320} className="evacuation-popup">
                            <div className="p-3">
                                {/* Header */}
                                <div className="mb-3">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-gray-900 text-base flex items-center">
                                            <Home className="h-4 w-4 mr-2 text-primary-600" />
                                            {center.name}
                                        </h3>
                                        <Badge
                                            variant={
                                                !center.is_operational ? 'default' :
                                                    occupancyPercent >= 100 ? 'danger' :
                                                        occupancyPercent >= 80 ? 'warning' : 'success'
                                            }
                                            size="sm"
                                        >
                                            {!center.is_operational ? 'Closed' :
                                                occupancyPercent >= 100 ? 'Full' :
                                                    occupancyPercent >= 80 ? 'Almost Full' : 'Available'}
                                        </Badge>
                                    </div>

                                    {center.description && (
                                        <p className="text-xs text-gray-600">{center.description}</p>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="space-y-2 mb-3 text-sm">
                                    {center.address && (
                                        <div className="flex items-start">
                                            <MapPin className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">{center.address}</span>
                                        </div>
                                    )}

                                    {center.barangay && (
                                        <div className="flex items-center">
                                            <span className="text-xs text-gray-500">Barangay: </span>
                                            <span className="text-xs font-medium text-gray-700 ml-1">
                                                {center.barangay.name}
                                            </span>
                                        </div>
                                    )}

                                    {center.capacity && (
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                                                    <span className="text-gray-700">
                                                        {center.current_occupancy || 0} / {center.capacity} people
                                                    </span>
                                                </div>
                                                <span className="text-xs font-medium text-gray-600">
                                                    {occupancyPercent.toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${occupancyPercent >= 100 ? 'bg-danger-600' :
                                                            occupancyPercent >= 80 ? 'bg-warning-500' : 'bg-success-500'
                                                        }`}
                                                    style={{ width: `${Math.min(occupancyPercent, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {center.contact_number && (
                                        <div className="flex items-center">
                                            <Phone className="h-4 w-4 mr-2 text-gray-500" />
                                            <a
                                                href={`tel:${center.contact_number}`}
                                                className="text-primary-600 hover:text-primary-700"
                                            >
                                                {center.contact_number}
                                            </a>
                                        </div>
                                    )}

                                    {facilities.length > 0 && (
                                        <div>
                                            <span className="text-xs font-medium text-gray-700">Facilities:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {facilities.map((facility, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                                                    >
                                                        {facility}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                {center.is_operational && (
                                    <div className="space-y-2">
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <Button variant="primary" size="sm" fullWidth>
                                                <MapPin className="h-4 w-4 mr-2" />
                                                Get Directions
                                            </Button>
                                        </a>
                                        {center.contact_number && (
                                            <a href={`tel:${center.contact_number}`} className="block">
                                                <Button variant="secondary" size="sm" fullWidth>
                                                    <Phone className="h-4 w-4 mr-2" />
                                                    Call Center
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
};

export default ShelterMarkers;
