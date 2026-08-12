/**
 * AIAdvisorWidget Component
 * Proactive AI evacuation advisor widget
 */

import { useState, useEffect } from 'react';
import {
    MessageCircle,
    X,
    Send,
    Minimize2,
    Maximize2,
    Volume2,
    VolumeX,
    Sparkles
} from 'lucide-react';
import { Button, Badge, Spinner } from '../common';
import {
    useAIAdvisor,
    getAdvisoryColor,
    getAdvisoryIcon,
    ADVISORY_PRIORITIES
} from '../../hooks/useAIAdvisor';
import { useMapStore } from '../../stores/mapStore';
import { calculateAshfallRisk, getWindDirectionName } from '../../utils/ashfallCalculator';
import { formatDistanceToNow } from 'date-fns';

const AIAdvisorWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    // Get map data for hazard context
    const { selectedBarangay, userLocation, windDirection, windSpeed } = useMapStore();

    const {
        advisories,
        isListening,
        askQuestion,
        isAsking,
        toggleListening,
        clearAdvisories,
    } = useAIAdvisor();

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || isAsking) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: message,
            timestamp: new Date(),
        };

        setChatHistory(prev => [...prev, userMessage]);
        setMessage('');

        // Helper function to convert numeric risk (0-1) to descriptive level
        const convertRiskLevel = (numericRisk) => {
            if (!numericRisk && numericRisk !== 0) return 'unknown';
            const risk = parseFloat(numericRisk);
            if (risk >= 0.75) return 'Very High';
            if (risk >= 0.65) return 'High';
            if (risk >= 0.55) return 'Medium';
            if (risk >= 0.45) return 'Low-Medium';
            return 'Low';
        };

        // Calculate ashfall risk based on current wind direction
        const getAshfallRisk = () => {
            if (!selectedBarangay || !windDirection) return 'unknown';

            try {
                // Get barangay center coordinates from GeoJSON
                const barangayProps = selectedBarangay.properties || {};

                // Try to get coordinates from various possible fields
                let lat = barangayProps.latitude || barangayProps.lat;
                let lng = barangayProps.longitude || barangayProps.lng || barangayProps.lon;

                // If not in properties, try to calculate from geometry
                if (!lat || !lng) {
                    if (selectedBarangay.geometry && selectedBarangay.geometry.type === 'Polygon') {
                        // Get first coordinate as approximation
                        const coords = selectedBarangay.geometry.coordinates[0][0];
                        lng = coords[0];
                        lat = coords[1];
                    } else if (userLocation) {
                        // Fallback to user location
                        lat = userLocation.lat;
                        lng = userLocation.lng;
                    }
                }

                if (!lat || !lng) return 'unknown';

                // Calculate ashfall risk based on wind
                const windDir = getWindDirectionName(windDirection);
                const ashfallData = calculateAshfallRisk(lat, lng, windDir);

                return ashfallData.level || 'unknown';
            } catch (error) {
                console.error('Error calculating ashfall risk:', error);
                return 'unknown';
            }
        };

        // Extract properties from GeoJSON feature
        const barangayProps = selectedBarangay?.properties || {};

        // Build comprehensive hazard data context
        const hazardData = {
            // Barangay risk data - convert numeric to descriptive strings
            flood_risk: convertRiskLevel(barangayProps.flood_risk || barangayProps.flood_level),
            ashfall_risk: getAshfallRisk(), // Calculate dynamically based on wind

            // Geographic data
            elevation: barangayProps.mean_elev || barangayProps.elevation || barangayProps.elev_mean || 'unknown',
            distance_to_volcano: barangayProps.taal_distance || barangayProps.distance_km || barangayProps.HubDist || 'unknown',

            // Location info
            barangay_name: String(barangayProps.ADM4_EN || barangayProps.name || 'your area'),
            barangay_code: barangayProps.ADM4_PCODE || 'unknown',
            latitude: userLocation?.lat || barangayProps.latitude,
            longitude: userLocation?.lng || barangayProps.longitude,

            // Wind conditions - ensure strings
            wind_direction: String(windDirection || 'unknown'),
            wind_speed: String(windSpeed || 'unknown'),

            // Additional risk factors
            river_risk: barangayProps.river_risk || 'unknown',
            elev_risk: barangayProps.elev_risk || 'unknown',
        };

        console.log('=== AI ADVISOR DEBUG ===');
        console.log('Selected Barangay:', selectedBarangay);
        console.log('Barangay Properties:', barangayProps);
        console.log('User Location:', userLocation);
        console.log('Wind Direction:', windDirection);
        console.log('Wind Speed:', windSpeed);
        console.log('Calculated Flood Risk:', hazardData.flood_risk);
        console.log('Calculated Ashfall Risk:', hazardData.ashfall_risk);
        console.log('Final Hazard Data:', hazardData);
        console.log('======================');

        // Ask AI with full context
        askQuestion(
            {
                question: message,
                context: hazardData,
            },
            {
                onSuccess: (data) => {
                    console.log('Chatbot response:', data);

                    // The response structure is: { reply, context, source }
                    // data.reply contains the AI response text
                    const replyText = data?.reply || 'No response received';

                    const aiMessage = {
                        id: Date.now() + 1,
                        type: 'ai',
                        content: replyText,
                        timestamp: new Date(),
                    };
                    setChatHistory(prev => [...prev, aiMessage]);
                },
                onError: (error) => {
                    console.error('Chatbot error:', error);
                    const errorMessage = {
                        id: Date.now() + 1,
                        type: 'ai',
                        content: 'Sorry, I encountered an error. Please try again.',
                        timestamp: new Date(),
                    };
                    setChatHistory(prev => [...prev, errorMessage]);
                },
            }
        );
    };

    const unreadAdvisories = advisories.filter(a =>
        a.priority === ADVISORY_PRIORITIES.CRITICAL ||
        a.priority === ADVISORY_PRIORITIES.HIGH
    ).length;

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-[1200] bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
                >
                    <div className="relative">
                        <Sparkles className="h-6 w-6 animate-pulse" />
                        {unreadAdvisories > 0 && (
                            <span className="absolute -top-2 -right-2 bg-danger-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                                {unreadAdvisories}
                            </span>
                        )}
                    </div>
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        AI Emergency Advisor
                    </span>
                </button>
            )}

            {/* Widget Panel */}
            {isOpen && (
                <div
                    className={`
            fixed bottom-6 right-6 z-[1200] bg-white rounded-lg shadow-2xl border border-gray-200
            transition-all duration-300
            ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'}
          `}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-t-lg">
                        <div className="flex items-center space-x-2">
                            <Sparkles className="h-5 w-5" />
                            <div>
                                <h3 className="font-semibold text-sm">AI Emergency Advisor</h3>
                                <p className="text-xs opacity-90">
                                    {isListening ? 'Monitoring' : 'Paused'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={toggleListening}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                            >
                                {isListening ? (
                                    <Volume2 className="h-4 w-4" />
                                ) : (
                                    <VolumeX className="h-4 w-4" />
                                )}
                            </button>
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                            >
                                {isMinimized ? (
                                    <Maximize2 className="h-4 w-4" />
                                ) : (
                                    <Minimize2 className="h-4 w-4" />
                                )}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {!isMinimized && (
                        <>
                            {/* Advisories Section */}
                            <div className="h-48 overflow-y-auto p-4 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-semibold text-gray-900">
                                        Active Advisories
                                    </h4>
                                    {advisories.length > 0 && (
                                        <button
                                            onClick={clearAdvisories}
                                            className="text-xs text-gray-600 hover:text-gray-900"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>

                                {advisories.length === 0 ? (
                                    <div className="text-center py-6">
                                        <Sparkles className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No active advisories</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            I'll notify you of any hazards
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {advisories.map((advisory) => (
                                            <div
                                                key={advisory.id}
                                                className={`
                          p-3 rounded-lg border text-sm
                          ${getAdvisoryColor(advisory.type, advisory.priority)}
                          ${advisory.priority === ADVISORY_PRIORITIES.CRITICAL ? 'animate-pulse' : ''}
                        `}
                                            >
                                                <div className="flex items-start space-x-2">
                                                    <span className="text-lg flex-shrink-0">
                                                        {getAdvisoryIcon(advisory.type)}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <p className="font-semibold text-xs">
                                                                {advisory.title}
                                                            </p>
                                                            <Badge
                                                                variant={
                                                                    advisory.priority === ADVISORY_PRIORITIES.CRITICAL ? 'danger' :
                                                                        advisory.priority === ADVISORY_PRIORITIES.HIGH ? 'warning' : 'default'
                                                                }
                                                                size="sm"
                                                            >
                                                                {advisory.priority}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs mb-1">{advisory.message}</p>
                                                        {advisory.recommendation && (
                                                            <p className="text-xs font-medium mt-2">
                                                                💡 {advisory.recommendation}
                                                            </p>
                                                        )}
                                                        <p className="text-xs opacity-75 mt-1">
                                                            {formatDistanceToNow(advisory.timestamp, { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Chat Section */}
                            <div className="flex-1 flex flex-col h-[calc(600px-16rem)]">
                                {/* Chat History */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {chatHistory.length === 0 ? (
                                        <div className="text-center py-8">
                                            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-sm text-gray-500">
                                                Ask me anything about evacuation, hazards, or safety
                                            </p>
                                            <div className="mt-4 space-y-2">
                                                <button
                                                    onClick={() => setMessage('What hazards are near me?')}
                                                    className="block w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs text-gray-700 transition-colors"
                                                >
                                                    What hazards are near me?
                                                </button>
                                                <button
                                                    onClick={() => setMessage('Where is the nearest shelter?')}
                                                    className="block w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs text-gray-700 transition-colors"
                                                >
                                                    Where is the nearest shelter?
                                                </button>
                                                <button
                                                    onClick={() => setMessage('Should I evacuate now?')}
                                                    className="block w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs text-gray-700 transition-colors"
                                                >
                                                    Should I evacuate now?
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        chatHistory.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`
                            max-w-[80%] rounded-lg px-4 py-2 text-sm
                            ${msg.type === 'user'
                                                            ? 'bg-primary-600 text-white'
                                                            : 'bg-gray-100 text-gray-900'
                                                        }
                          `}
                                                >
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {isAsking && (
                                        <div className="flex justify-start">
                                            <div className="bg-gray-100 rounded-lg px-4 py-2">
                                                <Spinner size="sm" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Ask about safety, hazards, routes..."
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            disabled={isAsking}
                                        />
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="sm"
                                            disabled={!message.trim() || isAsking}
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default AIAdvisorWidget;
