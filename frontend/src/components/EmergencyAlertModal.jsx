/**
 * EmergencyAlertModal Component
 * Full-screen emergency alert modal with flashing red animation
 */

import { useState, useEffect } from 'react';
import { AlertTriangle, X, Volume2, VolumeX } from 'lucide-react';
import { Button } from './common';

const EmergencyAlertModal = ({ alert, onClose }) => {
    const [isFlashing, setIsFlashing] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);

    useEffect(() => {
        // Stop flashing after 15 seconds (increased from 10)
        const flashTimer = setTimeout(() => {
            setIsFlashing(false);
        }, 15000);

        // Play alert sound
        if (soundEnabled) {
            playAlertSound();
        }

        return () => clearTimeout(flashTimer);
    }, [soundEnabled]);

    const playAlertSound = () => {
        try {
            // Create REALISTIC emergency siren sound
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Play continuous siren for 8 seconds (4 cycles)
            playContinuousSiren(audioContext, 4);
        } catch (error) {
            console.error('Failed to play alert sound:', error);
        }
    };

    const playContinuousSiren = (audioContext, cycles) => {
        for (let i = 0; i < cycles; i++) {
            setTimeout(() => {
                playSirenCycle(audioContext);
            }, i * 2000); // Each cycle is 2 seconds
        }
    };

    const playSirenCycle = (audioContext) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const startTime = audioContext.currentTime;
        const duration = 2; // 2 seconds per cycle

        // Real emergency siren frequencies: 
        // Low: 300Hz, High: 600Hz (much lower than before)
        // Sweep up from 300Hz to 600Hz, then down to 300Hz
        oscillator.frequency.setValueAtTime(300, startTime);
        oscillator.frequency.linearRampToValueAtTime(600, startTime + duration / 2);
        oscillator.frequency.linearRampToValueAtTime(300, startTime + duration);

        // Use sawtooth wave for more realistic siren sound
        oscillator.type = 'sawtooth';

        // Volume envelope - louder and more sustained
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.1); // Quick attack
        gainNode.gain.setValueAtTime(0.4, startTime + duration - 0.1); // Sustain
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration); // Quick release

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    };

    const toggleSound = () => {
        setSoundEnabled(!soundEnabled);
    };

    const getPriorityColor = () => {
        const priority = alert?.announcement?.priority || alert?.priority;
        switch (priority) {
            case 'urgent':
                return 'bg-red-600';
            case 'high':
                return 'bg-orange-600';
            case 'medium':
                return 'bg-yellow-600';
            default:
                return 'bg-red-600';
        }
    };

    const getAlertType = () => {
        const type = alert?.announcement?.type || alert?.type;
        switch (type) {
            case 'emergency':
                return '🚨 EMERGENCY ALERT';
            case 'evacuation':
                return '🏃 EVACUATION ORDER';
            case 'weather':
                return '⛈️ WEATHER ALERT';
            case 'warning':
                return '⚠️ WARNING';
            default:
                return '🚨 EMERGENCY ALERT';
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop with flashing effect */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-500 ${isFlashing ? 'animate-pulse opacity-70' : 'opacity-50'
                    }`}
                onClick={onClose}
            />

            {/* Alert Modal */}
            <div
                className={`relative w-full max-w-2xl mx-4 rounded-lg shadow-2xl overflow-hidden transform transition-all border-4 border-red-600 ${isFlashing ? 'animate-bounce-slow' : ''
                    }`}
            >
                {/* Flashing Header */}
                <div
                    className={`${getPriorityColor()} ${isFlashing ? 'animate-flash' : ''
                        } text-white px-6 py-4 flex items-center justify-between`}
                >
                    <div className="flex items-center space-x-3">
                        <AlertTriangle className={`h-10 w-10 ${isFlashing ? 'animate-shake' : 'animate-pulse'}`} />
                        <div>
                            <h2 className="text-3xl font-black tracking-wide">{getAlertType()}</h2>
                            <p className="text-sm opacity-90 font-bold">
                                {new Date(alert?.timestamp || Date.now()).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={toggleSound}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            title={soundEnabled ? 'Mute' : 'Unmute'}
                        >
                            {soundEnabled ? (
                                <Volume2 className="h-6 w-6" />
                            ) : (
                                <VolumeX className="h-6 w-6" />
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            title="Close"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Alert Content */}
                <div className="bg-white px-6 py-8">
                    {/* Title */}
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        {alert?.announcement?.title || alert?.message || 'Emergency Alert'}
                    </h3>

                    {/* Message */}
                    <div className="bg-gray-50 border-l-4 border-red-600 p-4 mb-6">
                        <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {alert?.announcement?.content ||
                                alert?.announcement?.message ||
                                alert?.message ||
                                'Please follow emergency procedures and stay safe.'}
                        </p>
                    </div>

                    {/* Priority Badge */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-600">Priority:</span>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-bold text-white ${(alert?.announcement?.priority || alert?.priority) === 'urgent'
                                    ? 'bg-red-600'
                                    : (alert?.announcement?.priority || alert?.priority) === 'high'
                                        ? 'bg-orange-600'
                                        : 'bg-yellow-600'
                                    }`}
                            >
                                {(alert?.announcement?.priority || alert?.priority || 'urgent').toUpperCase()}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-600">Type:</span>
                            <span className="px-3 py-1 bg-gray-200 rounded-full text-sm font-medium text-gray-800">
                                {(alert?.announcement?.type || alert?.type || 'emergency').toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Action Instructions */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <h4 className="font-bold text-yellow-900 mb-2 flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            What to do:
                        </h4>
                        <ul className="text-sm text-yellow-800 space-y-1 ml-7">
                            <li>• Stay calm and follow official instructions</li>
                            <li>• Check for updates regularly</li>
                            <li>• Ensure your safety and that of your family</li>
                            <li>• Contact emergency services if needed: 911</li>
                        </ul>
                    </div>

                    {/* Close Button */}
                    <Button
                        onClick={onClose}
                        variant="danger"
                        size="lg"
                        fullWidth
                        className="font-bold"
                    >
                        I UNDERSTAND - CLOSE ALERT
                    </Button>
                </div>

                {/* Bottom Warning Strip */}
                <div className={`${getPriorityColor()} text-white text-center py-2 text-sm font-medium`}>
                    ⚠️ This is an official emergency alert from Smart City Lipa ⚠️
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes flash {
                    0%, 100% { 
                        opacity: 1; 
                        background-color: rgb(220, 38, 38);
                    }
                    50% { 
                        opacity: 0.4; 
                        background-color: rgb(153, 27, 27);
                    }
                }
                
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0) scale(1); }
                    25% { transform: translateY(-20px) scale(1.02); }
                    50% { transform: translateY(0) scale(1); }
                    75% { transform: translateY(-10px) scale(1.01); }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }

                @keyframes pulse-ring {
                    0% {
                        transform: scale(0.8);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }

                .animate-flash {
                    animation: flash 0.5s ease-in-out infinite;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 1s ease-in-out 5;
                }

                .animate-shake {
                    animation: shake 0.5s ease-in-out infinite;
                }

                .animate-pulse-ring {
                    animation: pulse-ring 1.5s ease-out infinite;
                }
            `}</style>
        </div>
    );
};

export default EmergencyAlertModal;
