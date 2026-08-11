/**
 * BarangayInfoPanel Component
 * Displays detailed information about selected barangay
 */

import { useEffect, useState } from 'react';
import { X, MapPin, Droplets, Wind, Mountain, Waves, Maximize2 } from 'lucide-react';
import { Badge } from '../common';
import { calculateAshfallRisk, getWindDirectionName } from '../../utils/ashfallCalculator';
import * as turf from '@turf/turf';

const BarangayInfoPanel = ({ barangay, onClose, userLocation, windDirection = 90, windSpeed = 20 }) => {
    const [barangayImage, setBarangayImage] = useState(null);
    const [ashfallData, setAshfallData] = useState(null);

    // Calculate barangay center coordinates
    const getBarangayCenter = () => {
        if (!barangay || !barangay.geometry) return null;

        try {
            const center = turf.centerOfMass(barangay).geometry.coordinates;
            return { lat: center[1], lng: center[0] };
        } catch (e) {
            console.warn('Could not calculate barangay center:', e);
            return null;
        }
    };

    // Calculate ashfall risk when barangay or wind changes
    useEffect(() => {
        const center = getBarangayCenter();
        if (center) {
            const windDir = getWindDirectionName(windDirection);
            const ashfall = calculateAshfallRisk(center.lat, center.lng, windDir);
            setAshfallData(ashfall);
        }
    }, [barangay, windDirection]);

    useEffect(() => {
        if (barangay?.properties?.ADM4_EN) {
            // Normalize barangay name for image lookup
            // Using UNDERSCORES to match original filename convention
            const normalizedName = barangay.properties.ADM4_EN
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")  // Remove diacritics
                .replace(/\s+/g, '_')  // Replace spaces with UNDERSCORES (not hyphens!)
                .replace(/[^\w]/g, '');  // Remove non-word characters

            // Try to load barangay image
            const imagePath = `/images/${normalizedName}.jpg`;
            console.log('🖼️ Loading image for:', barangay.properties.ADM4_EN);
            console.log('📁 Normalized name:', normalizedName);
            console.log('🔗 Image path:', imagePath);
            setBarangayImage(imagePath);
        }
    }, [barangay]);

    if (!barangay) return null;

    const props = barangay.properties || {};
    const name = props.ADM4_EN || props.name || 'Unknown Area';

    // Risk levels - handle both numeric (0-1) and string formats
    const floodRiskRaw = props.flood_level || props.flood_risk || 'Unknown';

    // Use calculated ashfall data if available, otherwise fall back to properties
    const ashfallRiskRaw = ashfallData
        ? ashfallData.level
        : (props.ashfall_level || props.ashfall_risk || props.ashfall || 'Unknown');

    // Convert numeric risk to string labels
    const formatRiskLevel = (risk) => {
        if (!risk || risk === 'Unknown') return 'Unknown';

        // If already a string, return it
        if (typeof risk === 'string') return risk;

        // If numeric (0-1 scale), convert to label
        if (typeof risk === 'number') {
            if (risk >= 0.75) return 'High';
            if (risk >= 0.65) return 'Medium-High';
            if (risk >= 0.55) return 'Medium';
            if (risk >= 0.45) return 'Low-Medium';
            return 'Low';
        }

        return 'Unknown';
    };

    const floodRisk = formatRiskLevel(floodRiskRaw);
    const ashfallRisk = formatRiskLevel(ashfallRiskRaw);

    // Geographic data
    const taalDistance = ashfallData
        ? ashfallData.distance.toFixed(1)
        : (props.taal_distance || props.distance_km);
    const elevation = props.mean_elev || props.elevation;
    const waterDistance = props.dist_water;
    const area = props.area_sqkm;

    // Wind data - convert degrees to direction name
    const windDirectionName = getWindDirectionName(windDirection);

    // Get risk badge variant
    const getRiskVariant = (risk) => {
        if (!risk || risk === 'Unknown') return 'default';

        // Handle numeric risk values (0-1 scale)
        if (typeof risk === 'number') {
            if (risk >= 0.75) return 'danger';      // High risk
            if (risk >= 0.55) return 'warning';     // Medium risk
            return 'success';                        // Low risk
        }

        // Handle string risk values
        const riskStr = String(risk).toLowerCase();
        if (riskStr.includes('high') || riskStr.includes('very high') || riskStr.includes('critical')) {
            return 'danger';
        }
        if (riskStr.includes('medium') || riskStr.includes('moderate')) {
            return 'warning';
        }
        if (riskStr.includes('low') || riskStr.includes('safe')) {
            return 'success';
        }

        return 'default';
    };

    // Calculate area if geometry exists
    const calculateArea = () => {
        if (area) return area;
        if (barangay.geometry && window.turf) {
            try {
                return (window.turf.area(barangay) / 1_000_000).toFixed(2);
            } catch (e) {
                return null;
            }
        }
        return null;
    };

    const calculatedArea = calculateArea();

    return (
        <div className="absolute top-28 left-4 z-[1002] w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header with Image */}
            <div className="relative h-32 bg-gradient-to-br from-primary-600 to-blue-600">
                {barangayImage && (
                    <img
                        src={barangayImage}
                        alt={name}
                        className="w-full h-full object-cover"
                        onLoad={(e) => {
                            console.log('✅ Image loaded successfully:', barangayImage);
                        }}
                        onError={(e) => {
                            console.error('❌ Image failed to load:', barangayImage);
                            console.error('❌ Error event:', e);
                            e.target.style.display = 'none';
                        }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg">{name}</h3>
                    <p className="text-white/90 text-xs flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        Lipa City, Batangas
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {/* Risk Levels */}
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Risk Assessment
                    </h4>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Droplets className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-gray-700">Flood Risk</span>
                            </div>
                            <Badge variant={getRiskVariant(floodRisk)}>
                                {floodRisk}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Wind className="h-4 w-4 text-gray-600" />
                                <span className="text-sm text-gray-700">Ashfall Risk</span>
                            </div>
                            <Badge variant={getRiskVariant(ashfallRisk)}>
                                {ashfallRisk}
                            </Badge>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Geographic Information */}
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Geographic Data
                    </h4>
                    <div className="space-y-2">
                        {taalDistance && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Distance from Taal</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {typeof taalDistance === 'number'
                                        ? `${taalDistance.toFixed(1)} km`
                                        : taalDistance
                                    }
                                </span>
                            </div>
                        )}
                        {elevation && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                    <Mountain className="h-3 w-3 text-gray-500" />
                                    <span className="text-sm text-gray-600">Mean Elevation</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                    {elevation} m
                                </span>
                            </div>
                        )}
                        {waterDistance && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                    <Waves className="h-3 w-3 text-blue-500" />
                                    <span className="text-sm text-gray-600">Distance to Water</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                    {waterDistance} km
                                </span>
                            </div>
                        )}
                        {calculatedArea && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                    <Maximize2 className="h-3 w-3 text-gray-500" />
                                    <span className="text-sm text-gray-600">Area</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                    {calculatedArea} km²
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Environmental Conditions */}
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Current Conditions
                    </h4>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                                <Wind className="h-3 w-3 text-gray-500" />
                                <span className="text-sm text-gray-600">Wind Direction</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                                {windDirectionName} ({windSpeed} km/h)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Safety Recommendation */}
                {(floodRisk === 'High' || ashfallRisk === 'High' ||
                    floodRisk === 'Very High' || ashfallRisk === 'Very High') && (
                        <>
                            <hr className="border-gray-200" />
                            <div className="bg-danger-50 border border-danger-200 rounded-lg p-3">
                                <p className="text-xs font-semibold text-danger-900 mb-1">
                                    ⚠️ High Risk Area
                                </p>
                                <p className="text-xs text-danger-800">
                                    This area has elevated risk levels. Consider evacuation routes and
                                    stay informed about weather conditions.
                                </p>
                            </div>
                        </>
                    )}

                {/* User Distance (if user location available) */}
                {userLocation && (
                    <>
                        <hr className="border-gray-200" />
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-xs text-blue-800">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                You are currently in or near this barangay
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BarangayInfoPanel;
