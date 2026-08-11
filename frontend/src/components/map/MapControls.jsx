/**
 * MapControls Component
 * Map layer controls and quick actions
 */

import { useState } from 'react';
import { Layers, MapPin, Home, AlertTriangle, Navigation, Building2 } from 'lucide-react';
import { Button } from '../common';

const MapControls = ({ filters, onFilterChange, onFlyTo }) => {
    const [showControls, setShowControls] = useState(false);

    const controls = [
        {
            key: 'incidents',
            label: 'Incidents',
            icon: AlertTriangle,
            color: 'text-danger-600',
        },
        {
            key: 'shelters',
            label: 'Shelters',
            icon: Home,
            color: 'text-success-600',
        },
        {
            key: 'facilities',
            label: 'Facilities',
            icon: Building2,
            color: 'text-blue-600',
        },
        {
            key: 'hazards',
            label: 'Hazards',
            icon: AlertTriangle,
            color: 'text-warning-600',
        },
        {
            key: 'barangays',
            label: 'Barangays',
            icon: MapPin,
            color: 'text-primary-600',
        },
    ];

    return (
        <div className="absolute bottom-4 right-4 z-[1000]">
            <div className="bg-white rounded-lg shadow-lg">
                {/* Toggle Button */}
                <button
                    onClick={() => setShowControls(!showControls)}
                    className="p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2"
                >
                    <Layers className="h-5 w-5 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">Layers</span>
                </button>

                {/* Controls Panel */}
                {showControls && (
                    <div className="border-t border-gray-200 p-3 space-y-2">
                        {controls.map((control) => {
                            const Icon = control.icon;
                            const isActive = filters[control.key];

                            return (
                                <button
                                    key={control.key}
                                    onClick={() => onFilterChange(control.key)}
                                    className={`
                    w-full flex items-center space-x-3 p-2 rounded-lg transition-colors
                    ${isActive
                                            ? 'bg-primary-50 border border-primary-200'
                                            : 'hover:bg-gray-50 border border-transparent'
                                        }
                  `}
                                >
                                    <Icon className={`h-4 w-4 ${isActive ? 'text-primary-600' : control.color}`} />
                                    <span className={`text-sm ${isActive ? 'font-medium text-primary-900' : 'text-gray-700'}`}>
                                        {control.label}
                                    </span>
                                    <div className="ml-auto">
                                        <div className={`
                      w-4 h-4 rounded border-2 flex items-center justify-center
                      ${isActive
                                                ? 'bg-primary-600 border-primary-600'
                                                : 'border-gray-300'
                                            }
                    `}>
                                            {isActive && (
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}

                        {/* Quick Actions */}
                        <div className="pt-2 border-t border-gray-200 space-y-1">
                            <button
                                onClick={() => onFlyTo(13.9414, 121.1628, 13)}
                                className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Navigation className="h-4 w-4 text-gray-600" />
                                <span className="text-sm text-gray-700">Reset View</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapControls;
