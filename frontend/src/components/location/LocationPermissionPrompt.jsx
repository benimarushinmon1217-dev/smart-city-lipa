import { MapPin, X } from 'lucide-react';
import { useUserLocation } from '../../hooks/useUserLocation';

const LocationPermissionPrompt = () => {
    const { consent, isLocating, error, allowLocation, denyLocation } = useUserLocation();

    if (consent || isLocating) return null;

    return (
        <div className="fixed bottom-5 left-5 z-[1300] w-[min(22rem,calc(100vw-2.5rem))] rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
            <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-50 p-2 text-primary-600">
                    <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-gray-900">Use your location?</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Smart City Lipa can use your location to assess nearby flood elevation and ashfall risk and tailor safety guidance.
                    </p>
                    {error && <p className="mt-2 text-xs text-danger-600">{error}</p>}
                    <div className="mt-3 flex justify-end gap-2">
                        <button type="button" onClick={denyLocation} className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                            Not now
                        </button>
                        <button type="button" onClick={allowLocation} className="rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700">
                            Allow location
                        </button>
                    </div>
                </div>
                <button type="button" onClick={denyLocation} aria-label="Dismiss location prompt" className="text-gray-400 hover:text-gray-700">
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default LocationPermissionPrompt;