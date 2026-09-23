import { useCallback, useEffect, useState } from 'react';
import { booleanPointInPolygon, point } from '@turf/turf';
import { useMapStore } from '../stores/mapStore';

const CONSENT_KEY = 'smart-city-location-consent';

export const useUserLocation = () => {
    const { userLocation, setUserLocation, setLocationBarangay } = useMapStore();
    const [consent, setConsent] = useState(() => localStorage.getItem(CONSENT_KEY));
    const [isLocating, setIsLocating] = useState(false);
    const [error, setError] = useState(null);

    const resolveBarangay = useCallback(async (location) => {
        try {
            const response = await fetch('/data/lipa_barangays_risk_fixed.geojson');
            if (!response.ok) throw new Error('Unable to load barangay risk data');

            const geoData = await response.json();
            const userPoint = point([location.lng, location.lat]);
            const match = geoData.features?.find((feature) => {
                try {
                    return booleanPointInPolygon(userPoint, feature);
                } catch {
                    return false;
                }
            });

            setLocationBarangay(match || null);
        } catch (resolveError) {
            console.warn('Unable to resolve user location to a barangay:', resolveError);
            setLocationBarangay(null);
        }
    }, [setLocationBarangay]);

    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError('Location is not supported by this browser.');
            return;
        }

        setIsLocating(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const location = {
                    lat: coords.latitude,
                    lng: coords.longitude,
                    accuracy: coords.accuracy,
                };
                setUserLocation(location);
                setIsLocating(false);
                resolveBarangay(location);
            },
            (locationError) => {
                setIsLocating(false);
                setError(locationError.code === 1
                    ? 'Location access was denied. You can enable it in browser settings.'
                    : 'We could not determine your location.');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
    }, [resolveBarangay, setUserLocation]);

    useEffect(() => {
        if (consent === 'allowed' && !userLocation) requestLocation();
    }, [consent, requestLocation, userLocation]);

    const allowLocation = useCallback(() => {
        localStorage.setItem(CONSENT_KEY, 'allowed');
        setConsent('allowed');
        requestLocation();
    }, [requestLocation]);

    const denyLocation = useCallback(() => {
        localStorage.setItem(CONSENT_KEY, 'denied');
        setConsent('denied');
    }, []);

    return {
        consent,
        userLocation,
        isLocating,
        error,
        allowLocation,
        denyLocation,
        requestLocation,
    };
};