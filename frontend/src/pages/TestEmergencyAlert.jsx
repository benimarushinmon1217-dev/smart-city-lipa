/**
 * Test Emergency Alert Page
 * For testing the emergency alert modal and socket connection
 */

import { useState, useEffect } from 'react';
import { Button, Card } from '../components/common';
import EmergencyAlertModal from '../components/EmergencyAlertModal';
import { useSocket } from '../hooks/useSocket';

const TestEmergencyAlert = () => {
    const [showModal, setShowModal] = useState(false);
    const [socketStatus, setSocketStatus] = useState('checking...');
    const [receivedEvents, setReceivedEvents] = useState([]);
    const { on, off, connect } = useSocket();

    useEffect(() => {
        // Connect socket
        connect();

        // Check socket connection status
        const checkConnection = setInterval(async () => {
            try {
                const socketService = (await import('../services/socketService')).default;
                const isConnected = socketService.isConnected();
                const socketId = socketService.getSocketId();
                setSocketStatus(isConnected ? `Connected (${socketId})` : 'Disconnected');
            } catch (error) {
                setSocketStatus('Error checking connection');
            }
        }, 1000);

        // Listen for emergency events
        const handleEmergencyAlert = (data) => {
            console.log('🚨 [TEST PAGE] Received emergency:alert:', data);
            setReceivedEvents(prev => [...prev, { event: 'emergency:alert', data, time: new Date().toISOString() }]);
        };

        const handleAnnouncementNew = (data) => {
            console.log('📢 [TEST PAGE] Received announcement:new:', data);
            setReceivedEvents(prev => [...prev, { event: 'announcement:new', data, time: new Date().toISOString() }]);
        };

        on('emergency:alert', handleEmergencyAlert);
        on('announcement:new', handleAnnouncementNew);

        return () => {
            clearInterval(checkConnection);
            off('emergency:alert', handleEmergencyAlert);
            off('announcement:new', handleAnnouncementNew);
        };
    }, [on, off, connect]);

    const testAlert = {
        announcement: {
            title: 'TEST EMERGENCY ALERT',
            content: 'This is a test of the emergency alert system. If this was a real emergency, you would receive instructions on what to do.',
            type: 'emergency',
            priority: 'urgent',
        },
        timestamp: new Date().toISOString(),
    };

    const triggerCustomEvent = () => {
        console.log('🧪 [TEST] Manually triggering custom event');
        window.dispatchEvent(new CustomEvent('emergency-alert', {
            detail: testAlert
        }));
    };

    return (
        <div className="space-y-6">
            {/* Socket Status */}
            <Card title="Socket Connection Status">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${socketStatus.includes('Connected') ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="font-medium">{socketStatus}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                        {socketStatus.includes('Connected')
                            ? '✅ Socket is connected and ready to receive events'
                            : '❌ Socket is not connected. Emergency alerts will not be received.'}
                    </p>
                </div>
            </Card>

            {/* Test Buttons */}
            <Card title="Test Emergency Alert Modal">
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Test the emergency alert modal using different methods:
                    </p>

                    <div className="space-y-2">
                        <Button
                            variant="danger"
                            size="lg"
                            fullWidth
                            onClick={() => setShowModal(true)}
                        >
                            🚨 Show Modal Directly (Local Test)
                        </Button>

                        <Button
                            variant="warning"
                            size="lg"
                            fullWidth
                            onClick={triggerCustomEvent}
                        >
                            📡 Trigger Custom Event (Simulates Admin Broadcast)
                        </Button>

                        <Button
                            variant="default"
                            size="lg"
                            fullWidth
                            onClick={() => {
                                if (window.testEmergencyAlert) {
                                    window.testEmergencyAlert();
                                } else {
                                    alert('GlobalEmergencyAlert component not mounted');
                                }
                            }}
                        >
                            🧪 Use Global Test Function
                        </Button>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-bold mb-2">Test Data:</h3>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(testAlert, null, 2)}
                        </pre>
                    </div>
                </div>
            </Card>

            {/* Received Events Log */}
            <Card title="Received Socket Events">
                <div className="space-y-2">
                    {receivedEvents.length === 0 ? (
                        <p className="text-sm text-gray-500">No events received yet. Send an emergency broadcast from admin dashboard to test.</p>
                    ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {receivedEvents.map((item, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm">{item.event}</span>
                                        <span className="text-xs text-gray-500">{new Date(item.time).toLocaleTimeString()}</span>
                                    </div>
                                    <pre className="text-xs overflow-auto">
                                        {JSON.stringify(item.data, null, 2)}
                                    </pre>
                                </div>
                            ))}
                        </div>
                    )}
                    {receivedEvents.length > 0 && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setReceivedEvents([])}
                        >
                            Clear Log
                        </Button>
                    )}
                </div>
            </Card>

            {/* Instructions */}
            <Card title="Testing Instructions">
                <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>1. Check Socket Status:</strong> Ensure socket is connected (green indicator)</p>
                    <p><strong>2. Test Local Modal:</strong> Click "Show Modal Directly" to test the modal UI</p>
                    <p><strong>3. Test Custom Event:</strong> Click "Trigger Custom Event" to simulate admin broadcast</p>
                    <p><strong>4. Test Real Broadcast:</strong> Go to Admin Dashboard → Emergency Broadcast and send an alert</p>
                    <p><strong>5. Check Events Log:</strong> Verify that socket events are being received</p>
                    <p className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <strong>⚠️ Note:</strong> If socket is disconnected, check browser console for errors and ensure backend is running.
                    </p>
                </div>
            </Card>

            {showModal && (
                <EmergencyAlertModal
                    alert={testAlert}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default TestEmergencyAlert;
