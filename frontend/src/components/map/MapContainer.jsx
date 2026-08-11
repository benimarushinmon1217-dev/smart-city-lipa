/**
 * MapContainer Component
 * Main Leaflet map container with real-time updates and geolocation
 */

import { useEffect, useRef, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, ZoomControl, Marker, Popup, Circle } from 'react-leaflet';
import { MAP_CONFIG } from '../../config/map.config';
import BarangayLayer from './BarangayLayer';
import IncidentMarkers from './IncidentMarkers';
import HazardOverlay from './HazardOverlay';
import ShelterMarkers from './ShelterMarkers';
import FacilityMarkers from './FacilityMarkers';
import EvacuationRoute from './EvacuationRoute';
import MapControls from './MapControls';
import WindAnimation from './WindAnimation';
import WindBarbs from './WindBarbs';
import WindControl from './WindControl';
import BarangayInfoPanel from './BarangayInfoPanel';
import RouteComparison from './RouteComparison';
import { useSocket } from '../../hooks/useSocket';
import { useIncidents } from '../../hooks/useIncidents';
import { useWindChangeDetection } from '../../hooks/useWindChangeDetection';
import { useRouteCache } from '../../hooks/useRouteCache';
import { useMapStore } from '../../stores/mapStore';
import { Spinner, Button } from '../common';
import { Navigation, MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';

// Custom user location icon
const createUserLocationIcon = () => {
    return L.divIcon({
        className: 'custom-user-location-marker',
        html: `
      <div style="
        background-color: #3b82f6;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3);
        animation: pulse 2s infinite;
      "></div>
    `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });
};

const MapContainer = ({
    showIncidents = true,
    showShelters = true,
    showHazards = true,
    showRoutes = false,
    selectedRoute = null,
    onIncidentClick = null,
    height = '600px',
    centerOnUserLocation = false, // Changed default to false - user must click button
}) => {
    const mapRef = useRef(null);
    const [mapReady, setMapReady] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [showEvacuationRoute, setShowEvacuationRoute] = useState(false);
    const [showBarangayInfo, setShowBarangayInfo] = useState(false);

    // Route comparison
    const [initialRoute, setInitialRoute] = useState(null);
    const [bestRoute, setBestRoute] = useState(null);
    const [showRouteComparison, setShowRouteComparison] = useState(false);

    // Use map store for shared state
    const {
        userLocation,
        setUserLocation,
        selectedBarangay,
        setSelectedBarangay,
        windDirection,
        windSpeed,
        setWindDirection,
        setWindSpeed,
        activeFilters,
        toggleFilter,
        evacuationRoute,
        setEvacuationRoute,
        showWindAnimation,
        showWindBarbs,
        setShowWindAnimation,
        setShowWindBarbs,
    } = useMapStore();

    const { incidents, refetch: refetchIncidents } = useIncidents({});
    const { connect, on, off } = useSocket();

    // Route caching
    const { getCacheStats, clearCache } = useRouteCache();

    // Wind change detection
    useWindChangeDetection({
        windDirection,
        windSpeed,
        enabled: showWindAnimation || showWindBarbs,
        onWindChange: (changeData) => {
            console.log('🌬️ Wind changed:', changeData);

            // If route is displayed and wind changed significantly, suggest recalculation
            if (showEvacuationRoute && changeData.severity === 'high') {
                toast((t) => (
                    <div>
                        <p className="font-semibold mb-1">Wind conditions changed</p>
                        <p className="text-sm text-gray-600 mb-2">{changeData.recommendation}</p>
                        <button
                            onClick={() => {
                                setShowEvacuationRoute(false);
                                setTimeout(() => setShowEvacuationRoute(true), 100);
                                toast.dismiss(t.id);
                            }}
                            className="text-xs bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700"
                        >
                            Recalculate Route
                        </button>
                    </div>
                ), {
                    duration: 10000,
                    icon: '🌬️',
                });
            }
        },
    });

    // Initialize map
    useEffect(() => {
        setMapReady(true);
    }, []);

    // Get user's location on mount
    useEffect(() => {
        if (centerOnUserLocation && mapReady) {
            getUserLocation();
        }
    }, [centerOnUserLocation, mapReady]);

    // Get user's current location
    const getUserLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                const location = { lat: latitude, lng: longitude };

                setUserLocation(location);
                setIsLocating(false);

                // Center map on user location
                if (mapRef.current) {
                    mapRef.current.flyTo([latitude, longitude], 15, {
                        duration: 1.5,
                    });
                }

                // Show accuracy warning if location is not precise
                if (accuracy > 100) {
                    toast.success(`Location found (±${Math.round(accuracy)}m accuracy)`, {
                        duration: 4000,
                    });
                    console.log('📍 User location (low accuracy):', location, `±${accuracy}m`);
                } else {
                    toast.success('Location found!');
                    console.log('📍 User location:', location, `±${accuracy}m`);
                }
            },
            (error) => {
                setIsLocating(false);
                let errorMessage = 'Unable to get your location';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable. Try moving to an area with better GPS signal.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out. Please try again.';
                        break;
                    default:
                        errorMessage = 'An unknown error occurred while getting your location.';
                }

                setLocationError(errorMessage);
                toast.error(errorMessage, { duration: 5000 });
                console.error('📍 Location error:', error);
            },
            {
                enableHighAccuracy: true, // Request GPS instead of network location
                timeout: 10000, // 10 second timeout
                maximumAge: 0, // Don't use cached location
            }
        );
    };

    // Setup real-time updates
    useEffect(() => {
        // Connect to socket
        connect();

        // Listen for incident updates
        on('incident:new', () => {
            refetchIncidents();
        });

        on('incident:updated', () => {
            refetchIncidents();
        });

        on('incident:deleted', () => {
            refetchIncidents();
        });

        // Listen for hazard updates
        on('hazard:flood', () => {
            refetchIncidents();
        });

        on('hazard:wind', () => {
            refetchIncidents();
        });

        on('route:unsafe', () => {
            refetchIncidents();
        });

        return () => {
            off('incident:new');
            off('incident:updated');
            off('incident:deleted');
            off('hazard:flood');
            off('hazard:wind');
            off('route:unsafe');
        };
    }, [connect, on, off, refetchIncidents]);

    // Handle filter changes
    const handleFilterChange = (filter) => {
        toggleFilter(filter);
    };

    // Fly to location
    const flyToLocation = (lat, lng, zoom = 15) => {
        if (mapRef.current) {
            mapRef.current.flyTo([lat, lng], zoom, {
                duration: 1.5,
            });
        }
    };

    if (!mapReady) {
        return (
            <div
                className="flex items-center justify-center bg-gray-100 rounded-lg"
                style={{ height }}
            >
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="relative" style={{ height }}>
            <LeafletMap
                ref={mapRef}
                center={[MAP_CONFIG.CENTER.lat, MAP_CONFIG.CENTER.lng]}
                zoom={MAP_CONFIG.DEFAULT_ZOOM}
                style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
                zoomControl={false}
            >
                {/* Base Map Tiles */}
                <TileLayer
                    attribution={MAP_CONFIG.TILE_LAYER.attribution}
                    url={MAP_CONFIG.TILE_LAYER.url}
                    maxZoom={MAP_CONFIG.MAX_ZOOM}
                    minZoom={MAP_CONFIG.MIN_ZOOM}
                />

                {/* Zoom Control */}
                <ZoomControl position="topright" />

                {/* User Location Marker */}
                {userLocation && (
                    <>
                        <Marker
                            position={[userLocation.lat, userLocation.lng]}
                            icon={createUserLocationIcon()}
                        >
                            <Popup>
                                <div className="p-2">
                                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                        Your Location
                                    </h3>
                                    <p className="text-xs text-gray-600">
                                        Lat: {userLocation.lat.toFixed(6)}<br />
                                        Lng: {userLocation.lng.toFixed(6)}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                        {/* Accuracy circle */}
                        <Circle
                            center={[userLocation.lat, userLocation.lng]}
                            radius={50}
                            pathOptions={{
                                color: '#3b82f6',
                                fillColor: '#3b82f6',
                                fillOpacity: 0.1,
                                weight: 2,
                            }}
                        />
                    </>
                )}

                {/* Barangay Boundaries */}
                {activeFilters.barangays && (
                    <BarangayLayer
                        onBarangayClick={(feature, latlng) => {
                            setSelectedBarangay(feature);
                            setShowBarangayInfo(true);
                        }}
                    />
                )}

                {/* Hazard Overlays */}
                {showHazards && activeFilters.hazards && (
                    <HazardOverlay />
                )}

                {/* Incident Markers */}
                {showIncidents && activeFilters.incidents && (
                    <IncidentMarkers
                        incidents={incidents}
                        onIncidentClick={onIncidentClick}
                    />
                )}

                {/* Shelter/Evacuation Center Markers */}
                {showShelters && activeFilters.shelters && (
                    <ShelterMarkers userLocation={userLocation} />
                )}

                {/* Facility Markers (Schools, Hospitals, Churches, etc.) */}
                {activeFilters.facilities && (
                    <FacilityMarkers
                        showTypes={['school', 'church', 'government', 'hospital', 'clinic']}
                    />
                )}

                {/* Route Display */}
                {showRoutes && selectedRoute && (
                    <RouteDisplay route={selectedRoute} />
                )}

                {/* Evacuation Route */}
                {showEvacuationRoute && userLocation && (
                    <EvacuationRoute
                        userLocation={userLocation}
                        onRouteCalculated={(route) => {
                            setEvacuationRoute(route);

                            // Store as best route for comparison
                            if (!bestRoute) {
                                setBestRoute(route);
                            }

                            // If this is the first route, also store as initial
                            if (!initialRoute) {
                                setInitialRoute(route);
                            } else {
                                // Update best route and show comparison
                                setBestRoute(route);
                                setShowRouteComparison(true);
                            }
                        }}
                    />
                )}

                {/* Wind Animation */}
                {showWindAnimation && (
                    <WindAnimation
                        windDirection={windDirection}
                        windSpeed={windSpeed}
                        enabled={showWindAnimation}
                    />
                )}

                {/* Wind Barbs */}
                {showWindBarbs && (
                    <WindBarbs
                        windDirection={windDirection}
                        windSpeed={windSpeed}
                        enabled={showWindBarbs}
                    />
                )}
            </LeafletMap>

            {/* Barangay Info Panel */}
            {showBarangayInfo && selectedBarangay && (
                <BarangayInfoPanel
                    barangay={selectedBarangay}
                    userLocation={userLocation}
                    windDirection={windDirection}
                    windSpeed={windSpeed}
                    onClose={() => {
                        setShowBarangayInfo(false);
                        setSelectedBarangay(null);
                    }}
                />
            )}

            {/* Route Comparison */}
            {showRouteComparison && initialRoute && bestRoute && (
                <RouteComparison
                    initialRoute={initialRoute}
                    bestRoute={bestRoute}
                    onClose={() => setShowRouteComparison(false)}
                />
            )}

            {/* Map Controls */}
            <MapControls
                filters={activeFilters}
                onFilterChange={handleFilterChange}
                onFlyTo={flyToLocation}
            />

            {/* Wind Control */}
            <WindControl
                windDirection={windDirection}
                windSpeed={windSpeed}
                onDirectionChange={setWindDirection}
                onSpeedChange={setWindSpeed}
                showAnimation={showWindAnimation}
                onToggleAnimation={() => setShowWindAnimation(!showWindAnimation)}
                showBarbs={showWindBarbs}
                onToggleBarbs={() => setShowWindBarbs(!showWindBarbs)}
            />

            {/* Locate Me Button - Moved higher to avoid overlap */}
            <div className="absolute bottom-32 right-4 z-[1001] flex flex-col space-y-2">
                <Button
                    variant={userLocation ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={getUserLocation}
                    disabled={isLocating}
                    className="shadow-lg"
                    title="Find my location"
                >
                    {isLocating ? (
                        <Spinner size="sm" />
                    ) : (
                        <Navigation className="h-5 w-5" />
                    )}
                </Button>

                {userLocation && (
                    <Button
                        variant={showEvacuationRoute ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setShowEvacuationRoute(!showEvacuationRoute)}
                        className="shadow-lg"
                        title={showEvacuationRoute ? 'Hide evacuation route' : 'Show evacuation route'}
                    >
                        <MapPin className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Real-time Indicator */}
            <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md flex items-center space-x-2 z-[999]">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">Live Updates</span>
            </div>

            {/* Location Status - Moved to avoid overlap with WindControl */}
            {userLocation && (
                <div className="absolute top-16 left-4 bg-white px-3 py-2 rounded-lg shadow-md flex items-center space-x-2 z-[999]">
                    <MapPin className="h-4 w-4 text-primary-600" />
                    <span className="text-xs font-medium text-gray-700">Location Active</span>
                </div>
            )}

            {/* Add pulse animation CSS */}
            <style>{`
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.8;
                    }
                }
            `}</style>
        </div>
    );
};

export default MapContainer;
