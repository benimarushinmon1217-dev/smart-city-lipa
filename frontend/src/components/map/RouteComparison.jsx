/**
 * RouteComparison Component
 * Displays comparison between initial nearest route and best safe route
 */

import { ArrowRight, Navigation, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '../common';

const RouteComparison = ({ initialRoute, bestRoute, onClose }) => {
    if (!initialRoute || !bestRoute) return null;

    // Calculate differences
    const distanceDiff = bestRoute.distance - initialRoute.distance;
    const timeDiff = bestRoute.estimatedTime - initialRoute.estimatedTime;
    const isShorter = distanceDiff < 0;
    const isFaster = timeDiff < 0;

    // Determine if routes are the same
    const isSameRoute = Math.abs(distanceDiff) < 0.1 &&
        initialRoute.center?.id === bestRoute.center?.id;

    return (
        <div className="absolute bottom-4 left-4 z-[1001] w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Route Comparison</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                        ✕
                    </button>
                </div>
                <p className="text-xs text-white/90 mt-1">
                    Comparing nearest vs safest route
                </p>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {isSameRoute ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-green-900 mb-1">
                            Optimal Route Selected
                        </p>
                        <p className="text-xs text-green-800">
                            The nearest evacuation center is also the safest option.
                            No alternative route needed.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Initial Route (Nearest) */}
                        <div className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-gray-900">
                                    Initial Route (Nearest)
                                </h4>
                                <Badge variant="default" size="sm">Straight Line</Badge>
                            </div>
                            <p className="text-xs text-gray-700 mb-2">
                                {initialRoute.center?.name || 'Unknown Center'}
                            </p>
                            <div className="space-y-1 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 flex items-center">
                                        <Navigation className="h-3 w-3 mr-1" />
                                        Distance
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {initialRoute.distance.toFixed(2)} km
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Est. Time
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        ~{initialRoute.estimatedTime} min
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Arrow Indicator */}
                        <div className="flex items-center justify-center">
                            <ArrowRight className="h-6 w-6 text-primary-600" />
                        </div>

                        {/* Best Route (Safest) */}
                        <div className="border-2 border-primary-500 rounded-lg p-3 bg-primary-50">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-primary-900">
                                    Best Route (Recommended)
                                </h4>
                                <Badge variant="success" size="sm">Road-Based</Badge>
                            </div>
                            <p className="text-xs text-primary-800 mb-2">
                                {bestRoute.center?.name || 'Unknown Center'}
                            </p>
                            <div className="space-y-1 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-primary-700 flex items-center">
                                        <Navigation className="h-3 w-3 mr-1" />
                                        Distance
                                    </span>
                                    <span className="font-medium text-primary-900">
                                        {bestRoute.distance.toFixed(2)} km
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-primary-700 flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Est. Time
                                    </span>
                                    <span className="font-medium text-primary-900">
                                        ~{bestRoute.estimatedTime} min
                                    </span>
                                </div>
                                {bestRoute.riskSummary && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-primary-700 flex items-center">
                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                            Risk Level
                                        </span>
                                        <Badge
                                            variant={
                                                bestRoute.riskSummary.overallRisk === 'High' ? 'danger' :
                                                    bestRoute.riskSummary.overallRisk === 'Medium' ? 'warning' : 'success'
                                            }
                                            size="sm"
                                        >
                                            {bestRoute.riskSummary.overallRisk}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Difference Summary */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <h5 className="text-xs font-semibold text-gray-700 mb-2">
                                Difference
                            </h5>
                            <div className="space-y-1 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Distance</span>
                                    <span className={`font-medium ${isShorter ? 'text-green-600' : 'text-orange-600'
                                        }`}>
                                        {isShorter ? '−' : '+'}{Math.abs(distanceDiff).toFixed(2)} km
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Time</span>
                                    <span className={`font-medium ${isFaster ? 'text-green-600' : 'text-orange-600'
                                        }`}>
                                        {isFaster ? '−' : '+'}{Math.abs(timeDiff)} min
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Explanation */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <h5 className="text-xs font-semibold text-blue-900 mb-1">
                                💡 Why this route?
                            </h5>
                            <ul className="text-xs text-blue-800 space-y-1">
                                {bestRoute.riskSummary?.overallRisk === 'Low' && (
                                    <li>✓ Passes through safer areas</li>
                                )}
                                {bestRoute.riskSummary?.high === 0 && (
                                    <li>✓ Avoids high-risk zones</li>
                                )}
                                <li>✓ Uses actual roads and highways</li>
                                {!isShorter && distanceDiff < 2 && (
                                    <li>✓ Slightly longer but significantly safer</li>
                                )}
                                {isShorter && (
                                    <li>✓ Shorter and safer route available</li>
                                )}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RouteComparison;
