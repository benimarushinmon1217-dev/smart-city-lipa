/**
 * GlobalEmergencyAlert Component
 * Listens for emergency alerts globally and shows modal on any page
 */

import { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import EmergencyAlertModal from './EmergencyAlertModal';

const GlobalEmergencyAlert = () => {
    const [emergencyAlert, setEmergencyAlert] = useState(null);
    const { on, off, connect } = useSocket();

    // Log component mount
    useEffect(() => {
        console.log('🌐 [GLOBAL ALERT] Component mounted');

        // Add global test function
        window.testEmergencyAlert = () => {
            console.log('🧪 [TEST] Manually triggering emergency alert');
            setEmergencyAlert({
                announcement: {
                    title: 'TEST EMERGENCY ALERT',
                    content: 'This is a manual test of the emergency alert system.',
                    type: 'emergency',
                    priority: 'urgent',
                },
                timestamp: new Date().toISOString(),
            });
        };
        console.log('🧪 [TEST] Added window.testEmergencyAlert() function');

        return () => {
            console.log('🌐 [GLOBAL ALERT] Component unmounted');
            delete window.testEmergencyAlert;
        };
    }, []);

    useEffect(() => {
        console.log('🌐 [GLOBAL ALERT] Setting up emergency alert listeners');

        // Connect socket first
        connect();

        // Small delay to ensure socket is connected before setting up listeners
        const setupTimer = setTimeout(() => {
            console.log('🌐 [GLOBAL ALERT] Socket service:', { on, off, connect });

            // Listen for emergency alerts
            on('emergency:alert', (data) => {
                console.log('🚨 [GLOBAL ALERT] emergency:alert received:', data);
                console.log('🚨 [GLOBAL ALERT] Setting emergencyAlert state');
                setEmergencyAlert(data);
            });

            // Listen for announcements - show modal for urgent ones
            on('announcement:new', (data) => {
                console.log('📢 [GLOBAL ALERT] announcement:new received:', data);
                console.log('📢 [GLOBAL ALERT] Full data:', JSON.stringify(data, null, 2));
                const priority = data?.announcement?.priority || data?.priority;
                const type = data?.announcement?.type || data?.type;

                console.log('📢 [GLOBAL ALERT] Priority:', priority, 'Type:', type);

                // Show modal for urgent/high priority or emergency type
                if (priority === 'urgent' || priority === 'high' || type === 'emergency' || type === 'evacuation') {
                    console.log('🚨 [GLOBAL ALERT] Showing emergency modal for announcement');
                    setEmergencyAlert(data);
                } else {
                    console.log('📢 [GLOBAL ALERT] Not showing modal - priority/type not urgent');
                }
            });

            console.log('✅ [GLOBAL ALERT] Socket listeners registered');
        }, 500);

        // Listen for custom emergency-alert event (fallback for when socket doesn't work)
        const handleCustomEmergencyAlert = (event) => {
            console.log('🚨 [CUSTOM EVENT] Emergency alert triggered:', event.detail);
            setEmergencyAlert(event.detail);
        };
        window.addEventListener('emergency-alert', handleCustomEmergencyAlert);

        return () => {
            clearTimeout(setupTimer);
            console.log('🌐 [GLOBAL ALERT] Cleaning up listeners');
            off('emergency:alert');
            off('announcement:new');
            window.removeEventListener('emergency-alert', handleCustomEmergencyAlert);
        };
    }, [on, off, connect]);

    if (!emergencyAlert) {
        console.log('🌐 [GLOBAL ALERT] No emergency alert to show');
        return null;
    }

    console.log('🚨 [GLOBAL ALERT] Rendering emergency modal with alert:', emergencyAlert);

    return (
        <EmergencyAlertModal
            alert={emergencyAlert}
            onClose={() => {
                console.log('🚨 [GLOBAL ALERT] Closing emergency modal');
                setEmergencyAlert(null);
            }}
        />
    );
};

export default GlobalEmergencyAlert;
