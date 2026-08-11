/**
 * FacilityMarkers Component
 * Display all facilities (schools, churches, hospitals, clinics, government) on the map
 */

import { useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import L from 'leaflet';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api.config';
import { useSocket } from '../../hooks/useSocket';
import { Badge, Button } from '../common';
import { School, Church, Building2, Activity, MapPin, Phone, Cross } from 'lucide-react';

// Icon mapping for different facility types
const FACILITY_ICONS = {
    school: { emoji: '🏫', color: '#3b82f6', icon: School },
    church: { emoji: '⛪', color: '#8b5cf6', icon: Church },
    government: { emoji: '🏛️', color: '#6366f1', icon: Building2 },
    hospital: { emoji: '🏥', color: '#ef4444', icon: Cross },
    clinic: { emoji: '🏥', color: '#f59e0b', icon: Activity },
    evacuation: { emoji: '🏠', color: '#22c55e', icon: Building2 },
};

// Create custom icon for each facility type
const createFacilityIcon = (type, isOperational = true) => {
    const facilityConfig = FACILITY_ICONS[type] || FACILITY_ICONS.government;
    const color = isOperational ? facilityConfig.color : '#6b7280';

    return L.divIcon({
        className: 'custom-facility-marker',
        html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
      ">
        <span style="font-size: 16px;">${facilityConfig.emoji}</span>
      </div>
    `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

// Get badge variant based on facility type
const getBadgeVariant = (type) => {
    switch (type) {
        case 'hospital':
            return 'danger';
        case 'clinic':
            return 'warning';
        case 'school':
            return 'info';
        case 'church':
            return 'secondary';
        case 'government':
            return 'primary';
        case 'evacuation':
            return 'success';
        default:
            return 'default';
    }
};

// Format facility type for display
const formatType = (type) => {
    const typeMap = {
        school: 'School',
        church: 'Church',
        government: 'Government Facility',
        hospital: 'Hospital',
        clinic: 'Health Center',
        evacuation: 'Evacuation Center',
    };
    return typeMap[type] || type;
};

const FacilityMarkers = ({ showTypes = ['school', 'church', 'government', 'hospital', 'clinic'] }) => {
    const { on, off } = useSocket();

    // Fetch all establishments
    const { data: facilitiesData, refetch } = useQuery({
        queryKey: ['facilities', showTypes],
        queryFn: async () => {
            const response = await api.get(API_ENDPOINTS.ESTABLISHMENTS.LIST);
            return response.data;
        },
    });

    // Real-time facility updates
    useEffect(() => {
        on('establishment:updated', () => {
            refetch();
        });

        on('establishment:created', () => {
            refetch();
        });

        return () => {
            off('establishment:updated');
            off('establishment:created');
        };
    }, [on, off, refetch]);

    const facilities = facilitiesData?.establishments || [];

    // Filter facilities by type
    const filteredFacilities = facilities.filter(facility =>
        showTypes.includes(facility.type) && facility.type !== 'evacuation'
    );

    if (filteredFacilities.length === 0) {
        return null;
    }

    return (
        <>
            {filteredFacilities.map((facility) => {
                if (!facility.latitude || !facility.longitude) {
                    return null;
                }

                const position = [parseFloat(facility.latitude), parseFloat(facility.longitude)];
                const icon = createFacilityIcon(facility.type, facility.is_operational);
                const IconComponent = FACILITY_ICONS[facility.type]?.icon || Building2;

                return (
                    <Marker
                        key={facility.id}
                        position={position}
                        icon={icon}
                    >
                        <Popup maxWidth={300} className="facility-popup">
                            <div className="p-3">
                                {/* Header */}
                                <div className="mb-3">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-gray-900 text-sm flex items-center">
                                            <IconComponent className="h-4 w-4 mr-2 text-primary-600" />
                                            {facility.name}
                                        </h3>
                                        <Badge
                                            variant={getBadgeVariant(facility.type)}
                                            size="sm"
                                        >
                                            {formatType(facility.type)}
                                        </Badge>
                                    </div>

                                    {facility.description && (
                                        <p className="text-xs text-gray-600 mb-2">{facility.description}</p>
                                    )}

                                    {!facility.is_operational && (
                                        <Badge variant="default" size="sm">
                                            Currently Closed
                                        </Badge>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="space-y-2 mb-3 text-sm">
                                    {facility.address && (
                                        <div className="flex items-start">
                                            <MapPin className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 text-xs">{facility.address}</span>
                                        </div>
                                    )}

                                    {facility.barangay && (
                                        <div className="flex items-center">
                                            <span className="text-xs text-gray-500">Barangay: </span>
                                            <span className="text-xs font-medium text-gray-700 ml-1">
                                                {facility.barangay.name}
                                            </span>
                                        </div>
                                    )}

                                    {facility.contact_number && (
                                        <div className="flex items-center">
                                            <Phone className="h-4 w-4 mr-2 text-gray-500" />
                                            <a
                                                href={`tel:${facility.contact_number}`}
                                                className="text-primary-600 hover:text-primary-700 text-xs"
                                            >
                                                {facility.contact_number}
                                            </a>
                                        </div>
                                    )}

                                    {facility.email && (
                                        <div className="flex items-center">
                                            <span className="text-xs text-gray-500">Email: </span>
                                            <a
                                                href={`mailto:${facility.email}`}
                                                className="text-primary-600 hover:text-primary-700 text-xs ml-1"
                                            >
                                                {facility.email}
                                            </a>
                                        </div>
                                    )}

                                    {facility.operating_hours && (
                                        <div className="flex items-center">
                                            <span className="text-xs text-gray-500">Hours: </span>
                                            <span className="text-xs text-gray-700 ml-1">
                                                {facility.operating_hours}
                                            </span>
                                        </div>
                                    )}

                                    {facility.website && (
                                        <div className="flex items-center">
                                            <a
                                                href={facility.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary-600 hover:text-primary-700 text-xs"
                                            >
                                                Visit Website →
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="space-y-2">
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Button variant="primary" size="sm" fullWidth>
                                            <MapPin className="h-4 w-4 mr-2" />
                                            Get Directions
                                        </Button>
                                    </a>
                                    {facility.contact_number && (
                                        <a href={`tel:${facility.contact_number}`} className="block">
                                            <Button variant="secondary" size="sm" fullWidth>
                                                <Phone className="h-4 w-4 mr-2" />
                                                Call
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
};

export default FacilityMarkers;
