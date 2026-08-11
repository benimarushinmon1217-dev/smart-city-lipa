/**
 * EvacuationRoute Component
 * Display evacuation route from user location to nearest shelter
 * with risk-based colored segments
 */

import { useEffect, useState } from 'react';
import { Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api.config';
import { Button, Badge } from '../common';
import { Navigation, AlertTriangle, Clock, MapPin } from 'lucide-react';
import L from 'leaflet';
import toast from 'react-hot-toast';
import * as turf from '@turf/turf';

// Custom destination icon
const createDestinationIcon = () => {
    return L.divIcon({
        className: 'custom-destination-marker',
        html: `
      <div style="
        background-color: #22c55e;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="font-size: 24px;">🏠</span>
      </div>
    `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });
};

const EvacuationRoute = ({ userLocation, onRouteCalculated }) => {
    const [route, setRoute] = useState(null);
    const [routeSegments, setRouteSegments] = useState([]);
    const [nearestCenter, setNearestCenter] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [error, setError] = useState(null);
    const [routeRiskSummary, setRouteRiskSummary] = useState(null);
    const map = useMap();

    // Calculate route when user location changes
    useEffect(() => {
        if (userLocation) {
            findNearestEvacuationCenter();
        }
    }, [userLocation]);

    const findNearestEvacuationCenter = async () => {
        if (!userLocation) {
            return;
        }

        setIsCalculating(true);
        setError(null);

        try {
            // Find nearest evacuation center
            const response = await api.post(API_ENDPOINTS.AI.EVACUATION_CENTER, {
                latitude: userLocation.lat,
                longitude: userLocation.lng,
            });

            const data = response.data;

            if (data.found && data.nearest) {
                setNearestCenter(data.nearest);

                // Use OSRM for real road-based routing
                try {
                    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${data.nearest.longitude},${data.nearest.latitude}?overview=full&geometries=geojson`;

                    const osrmResponse = await fetch(osrmUrl);
                    const osrmData = await osrmResponse.json();

                    if (osrmData.routes && osrmData.routes.length > 0) {
                        const route = osrmData.routes[0];

                        // Convert GeoJSON coordinates to Leaflet format [lat, lng]
                        const routePoints = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

                        const distance = route.distance / 1000; // Convert meters to km
                        const estimatedTime = Math.ceil(route.duration / 60); // Convert seconds to minutes

                        // Analyze route segments for risk
                        const segments = await analyzeRouteRisk(route.geometry.coordinates);
                        setRouteSegments(segments);

                        // Calculate risk summary
                        const riskSummary = calculateRiskSummary(segments);
                        setRouteRiskSummary(riskSummary);

                        const routeData = {
                            points: routePoints,
                            distance: distance,
                            estimatedTime: estimatedTime,
                            center: data.nearest,
                            segments: segments,
                            riskSummary: riskSummary,
                        };

                        setRoute(routeData);

                        if (onRouteCalculated) {
                            onRouteCalculated(routeData);
                        }

                        toast.success(`Route calculated: ${distance.toFixed(2)} km, ~${estimatedTime} min`);
                    } else {
                        // Fallback to straight line if OSRM fails
                        const routePoints = [
                            [userLocation.lat, userLocation.lng],
                            [data.nearest.latitude, data.nearest.longitude],
                        ];

                        const distance = data.nearest.distance;
                        const estimatedTime = Math.ceil((distance / 5) * 60);

                        const routeData = {
                            points: routePoints,
                            distance: distance,
                            estimatedTime: estimatedTime,
                            center: data.nearest,
                        };

                        setRoute(routeData);

                        if (onRouteCalculated) {
                            onRouteCalculated(routeData);
                        }

                        toast.success(`Nearest evacuation center: ${data.nearest.name}`);
                    }
                } catch (osrmError) {
                    console.error('OSRM routing failed, using straight line:', osrmError);

                    // Fallback to straight line
                    const routePoints = [
                        [userLocation.lat, userLocation.lng],
                        [data.nearest.latitude, data.nearest.longitude],
                    ];

                    const distance = data.nearest.distance;
                    const estimatedTime = Math.ceil((distance / 5) * 60);

                    const routeData = {
                        points: routePoints,
                        distance: distance,
                        estimatedTime: estimatedTime,
                        center: data.nearest,
                    };

                    setRoute(routeData);

                    if (onRouteCalculated) {
                        onRouteCalculated(routeData);
                    }

                    toast.success(`Nearest evacuation center: ${data.nearest.name}`);
                }
            } else {
                setError('No evacuation centers found nearby');
                toast.error('No evacuation centers found nearby');
            }
        } catch (err) {
            console.error('Error finding evacuation center:', err);
            setError('Failed to calculate evacuation route');
            toast.error('Failed to calculate evacuation route');
        } finally {
            setIsCalculating(false);
        }
    };

    // Analyze route risk by checking which barangays it passes through
    const analyzeRouteRisk = async (coordinates) => {
        try {
            console.log('Starting route risk analysis with', coordinates.length, 'coordinate points');

            // Load barangay GeoJSON data directly from file (same as BarangayLayer)
            const response = await fetch('/data/lipa_barangays_risk_fixed.geojson');
            const geoData = await response.json();

            if (!geoData || !geoData.features || geoData.features.length === 0) {
                console.warn('No barangay features found in GeoJSON');
                return coordinates.slice(0, -1).map((coord, i) => ({
                    points: [[coord[1], coord[0]], [coordinates[i + 1][1], coordinates[i + 1][0]]],
                    risk: 'unknown',
                    color: '#6b7280', // Gray - unknown
                }));
            }

            console.log('Loaded', geoData.features.length, 'barangay features from GeoJSON');

            const segments = [];

            // Create segments between consecutive points
            for (let i = 0; i < coordinates.length - 1; i++) {
                const start = coordinates[i];
                const end = coordinates[i + 1];

                const segment = {
                    points: [[start[1], start[0]], [end[1], end[0]]],
                    risk: 'low',
                    color: '#22c55e', // Green - safe
                    barangayName: null,
                };

                // Check if segment intersects with any barangay
                const segmentLine = turf.lineString([start, end]);

                for (const feature of geoData.features) {
                    try {
                        // Check intersection with barangay polygon
                        const intersects = turf.booleanIntersects(segmentLine, feature);

                        if (intersects) {
                            const properties = feature.properties || {};
                            const barangayName = properties.ADM4_EN || 'Unknown';

                            // Get flood risk (0-1 scale from GeoJSON)
                            const floodRisk = properties.flood_risk || 0;

                            console.log(`Segment ${i} intersects ${barangayName}, flood_risk: ${floodRisk}`);

                            // Determine segment risk level based on flood_risk value
                            // Critical: >= 0.75, High: >= 0.65, Medium: >= 0.55, Low: < 0.55
                            if (floodRisk >= 0.65) {
                                segment.risk = 'high';
                                segment.color = '#dc2626'; // Red - dangerous
                                segment.barangayName = barangayName;
                                break; // Stop checking once we find high risk
                            } else if (floodRisk >= 0.55) {
                                if (segment.risk !== 'high') {
                                    segment.risk = 'medium';
                                    segment.color = '#facc15'; // Yellow - caution
                                    segment.barangayName = barangayName;
                                }
                            } else {
                                // Only update if we haven't found a higher risk
                                if (segment.risk === 'low' && !segment.barangayName) {
                                    segment.barangayName = barangayName;
                                }
                            }
                        }
                    } catch (e) {
                        console.warn('Error checking barangay intersection:', e);
                    }
                }

                console.log(`Segment ${i}: risk=${segment.risk}, color=${segment.color}, barangay=${segment.barangayName}`);
                segments.push(segment);
            }

            console.log('Route risk analysis complete:', segments.length, 'segments analyzed');
            return segments;
        } catch (error) {
            console.error('Error analyzing route risk:', error);
            // Return default segments if analysis fails
            return coordinates.slice(0, -1).map((coord, i) => ({
                points: [[coord[1], coord[0]], [coordinates[i + 1][1], coordinates[i + 1][0]]],
                risk: 'unknown',
                color: '#6b7280', // Gray - unknown
            }));
        }
    };

    // Calculate risk summary
    const calculateRiskSummary = (segments) => {
        const total = segments.length;
        const high = segments.filter(s => s.risk === 'high').length;
        const medium = segments.filter(s => s.risk === 'medium').length;
        const low = segments.filter(s => s.risk === 'low').length;

        let overallRisk = 'Low';
        if (high > 0) {
            overallRisk = 'High';
        } else if (medium > total * 0.3) {
            overallRisk = 'Medium';
        }

        return {
            total,
            high,
            medium,
            low,
            overallRisk,
            highPercentage: ((high / total) * 100).toFixed(0),
            mediumPercentage: ((medium / total) * 100).toFixed(0),
            lowPercentage: ((low / total) * 100).toFixed(0),
        };
    };

    if (!userLocation || !route) {
        return null;
    }

    return (
        <>
            {/* Colored Route Segments based on Risk */}
            {routeSegments.length > 0 ? (
                <>
                    {/* White outline for all segments */}
                    {routeSegments.map((segment, index) => (
                        <Polyline
                            key={`outline-${index}`}
                            positions={segment.points}
                            pathOptions={{
                                color: '#ffffff',
                                weight: 8,
                                opacity: 0.8,
                            }}
                        />
                    ))}
                    {/* Colored segments */}
                    {routeSegments.map((segment, index) => (
                        <Polyline
                            key={`segment-${index}`}
                            positions={segment.points}
                            pathOptions={{
                                color: segment.color,
                                weight: 5,
                                opacity: 1,
                            }}
                        />
                    ))}
                </>
            ) : (
                <>
                    {/* Fallback: Single colored route */}
                    <Polyline
                        positions={route.points}
                        pathOptions={{
                            color: '#ffffff',
                            weight: 8,
                            opacity: 0.8,
                        }}
                    />
                    <Polyline
                        positions={route.points}
                        pathOptions={{
                            color: '#22c55e',
                            weight: 5,
                            opacity: 1,
                        }}
                    />
                </>
            )}

            {/* Destination Marker */}
            {nearestCenter && (
                <Marker
                    position={[nearestCenter.latitude, nearestCenter.longitude]}
                    icon={createDestinationIcon()}
                >
                    <Popup maxWidth={320}>
                        <div className="p-3">
                            <div className="mb-3">
                                <h3 className="font-bold text-gray-900 text-base mb-1">
                                    Nearest Evacuation Center
                                </h3>
                                <h4 className="font-semibold text-primary-600 text-sm">
                                    {nearestCenter.name}
                                </h4>
                            </div>

                            <div className="space-y-2 mb-3 text-sm">
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                    <span className="text-gray-700">{nearestCenter.address}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Navigation className="h-4 w-4 mr-2 text-gray-500" />
                                        <span className="text-gray-700">
                                            {route.distance.toFixed(2)} km away
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                        <span className="text-gray-700">
                                            ~{route.estimatedTime} min walk
                                        </span>
                                    </div>
                                </div>

                                {nearestCenter.capacity && (
                                    <div>
                                        <span className="text-xs text-gray-600">
                                            Capacity: {nearestCenter.capacity} people
                                        </span>
                                    </div>
                                )}

                                {nearestCenter.contact && (
                                    <div className="flex items-center">
                                        <span className="text-xs text-gray-600">
                                            Contact: {nearestCenter.contact}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Route Risk Summary */}
                            {routeRiskSummary && (
                                <div className="mb-3 p-2 bg-gray-50 rounded border border-gray-200">
                                    <h5 className="text-xs font-semibold text-gray-700 mb-2">
                                        Route Risk Analysis
                                    </h5>
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-gray-600">Overall Risk:</span>
                                        <Badge variant={
                                            routeRiskSummary.overallRisk === 'High' ? 'danger' :
                                                routeRiskSummary.overallRisk === 'Medium' ? 'warning' : 'success'
                                        }>
                                            {routeRiskSummary.overallRisk}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1 text-xs text-gray-600">
                                        {routeRiskSummary.high > 0 && (
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center">
                                                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                                                    High Risk
                                                </span>
                                                <span>{routeRiskSummary.highPercentage}%</span>
                                            </div>
                                        )}
                                        {routeRiskSummary.medium > 0 && (
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center">
                                                    <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                                                    Medium Risk
                                                </span>
                                                <span>{routeRiskSummary.mediumPercentage}%</span>
                                            </div>
                                        )}
                                        {routeRiskSummary.low > 0 && (
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center">
                                                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                                    Low Risk
                                                </span>
                                                <span>{routeRiskSummary.lowPercentage}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${nearestCenter.latitude},${nearestCenter.longitude}&travelmode=walking`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <Button variant="primary" size="sm" fullWidth>
                                        <Navigation className="h-4 w-4 mr-2" />
                                        Start Navigation
                                    </Button>
                                </a>
                                {nearestCenter.contact && (
                                    <a href={`tel:${nearestCenter.contact}`} className="block">
                                        <Button variant="secondary" size="sm" fullWidth>
                                            Call Center
                                        </Button>
                                    </a>
                                )}
                            </div>

                            <div className="mt-3 p-2 bg-warning-50 border border-warning-200 rounded">
                                <div className="flex items-start">
                                    <AlertTriangle className="h-4 w-4 text-warning-600 mr-2 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-warning-800">
                                        Follow official evacuation orders. Bring essentials and stay safe.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            )}
        </>
    );
};

export default EvacuationRoute;
