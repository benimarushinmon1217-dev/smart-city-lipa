/**
 * WindControl Component
 * Control panel for wind animation and direction
 */

import { useState } from 'react';
import { Wind, ChevronDown, ChevronUp } from 'lucide-react';
import { Button, Badge } from '../common';

const WIND_DIRECTIONS = [
    { value: 0, label: 'N', name: 'North' },
    { value: 45, label: 'NE', name: 'Northeast' },
    { value: 90, label: 'E', name: 'East' },
    { value: 135, label: 'SE', name: 'Southeast' },
    { value: 180, label: 'S', name: 'South' },
    { value: 225, label: 'SW', name: 'Southwest' },
    { value: 270, label: 'W', name: 'West' },
    { value: 315, label: 'NW', name: 'Northwest' },
];

const WIND_SPEEDS = [
    { value: 10, label: 'Calm', color: 'bg-gray-500' },
    { value: 20, label: 'Light', color: 'bg-blue-500' },
    { value: 30, label: 'Moderate', color: 'bg-yellow-500' },
    { value: 45, label: 'Strong', color: 'bg-orange-500' },
    { value: 60, label: 'Very Strong', color: 'bg-red-500' },
];

const WindControl = ({
    windDirection = 90,
    windSpeed = 20,
    onDirectionChange,
    onSpeedChange,
    showAnimation = true,
    onToggleAnimation,
    showBarbs = false,
    onToggleBarbs
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const currentDirection = WIND_DIRECTIONS.find(d => d.value === windDirection) || WIND_DIRECTIONS[2];
    const currentSpeed = WIND_SPEEDS.find(s => s.value >= windSpeed) || WIND_SPEEDS[1];

    return (
        <div className="absolute top-4 right-4 z-[998] bg-white rounded-lg shadow-lg max-w-xs">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-3 flex items-center justify-between hover:bg-gray-50 rounded-t-lg transition-colors"
            >
                <div className="flex items-center space-x-2">
                    <Wind className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Wind Conditions</span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
            </button>

            {/* Compact View */}
            {!isExpanded && (
                <div className="px-3 pb-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Direction:</span>
                        <Badge variant="info" size="sm">
                            {currentDirection.label} ({currentDirection.name})
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Speed:</span>
                        <Badge variant="warning" size="sm">
                            {windSpeed} km/h ({currentSpeed.label})
                        </Badge>
                    </div>
                </div>
            )}

            {/* Expanded View */}
            {isExpanded && (
                <div className="border-t border-gray-200 p-4 space-y-4">
                    {/* Current Status */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Direction</span>
                            <Badge variant="info">
                                {currentDirection.label} - {currentDirection.name}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Speed</span>
                            <Badge variant="warning">
                                {windSpeed} km/h - {currentSpeed.label}
                            </Badge>
                        </div>
                    </div>

                    {/* Wind Direction Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Wind Direction
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {WIND_DIRECTIONS.map((dir) => (
                                <button
                                    key={dir.value}
                                    onClick={() => onDirectionChange(dir.value)}
                                    className={`
                                        px-3 py-2 text-sm font-medium rounded-lg transition-colors
                                        ${windDirection === dir.value
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }
                                    `}
                                    title={dir.name}
                                >
                                    {dir.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Wind Speed Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Wind Speed
                        </label>
                        <div className="space-y-2">
                            {WIND_SPEEDS.map((speed) => (
                                <button
                                    key={speed.value}
                                    onClick={() => onSpeedChange(speed.value)}
                                    className={`
                                        w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors
                                        flex items-center justify-between
                                        ${windSpeed === speed.value
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }
                                    `}
                                >
                                    <span>{speed.label}</span>
                                    <span>{speed.value} km/h</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Visualization Options */}
                    <div className="pt-3 border-t border-gray-200 space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Visualization
                        </label>

                        <button
                            onClick={onToggleAnimation}
                            className={`
                                w-full flex items-center justify-between p-2 rounded-lg transition-colors
                                ${showAnimation
                                    ? 'bg-blue-50 border border-blue-200'
                                    : 'hover:bg-gray-50 border border-transparent'
                                }
                            `}
                        >
                            <span className="text-sm text-gray-700">Particle Animation</span>
                            <div className={`
                                w-4 h-4 rounded border-2 flex items-center justify-center
                                ${showAnimation
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-gray-300'
                                }
                            `}>
                                {showAnimation && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </button>

                        <button
                            onClick={onToggleBarbs}
                            className={`
                                w-full flex items-center justify-between p-2 rounded-lg transition-colors
                                ${showBarbs
                                    ? 'bg-blue-50 border border-blue-200'
                                    : 'hover:bg-gray-50 border border-transparent'
                                }
                            `}
                        >
                            <span className="text-sm text-gray-700">Wind Barbs (PAGASA)</span>
                            <div className={`
                                w-4 h-4 rounded border-2 flex items-center justify-center
                                ${showBarbs
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-gray-300'
                                }
                            `}>
                                {showBarbs && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Info */}
                    <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                            💡 Wind direction shows where wind is <strong>coming from</strong>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WindControl;
