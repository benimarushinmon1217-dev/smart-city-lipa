/**
 * Notification Store
 * Zustand store for notifications state
 */

import { create } from 'zustand';

const useNotificationStore = create((set, get) => ({
    // State
    notifications: [],
    unreadCount: 0,
    isLoading: false,

    // Actions
    setNotifications: (notifications) => set({ notifications }),

    addNotification: (notification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        }));
    },

    markAsRead: (notificationId) => {
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === notificationId ? { ...n, is_read: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
        }));
    },

    markAllAsRead: () => {
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
            unreadCount: 0,
        }));
    },

    removeNotification: (notificationId) => {
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== notificationId),
        }));
    },

    setUnreadCount: (count) => set({ unreadCount: count }),

    incrementUnreadCount: () => {
        set((state) => ({ unreadCount: state.unreadCount + 1 }));
    },

    decrementUnreadCount: () => {
        set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) }));
    },

    setLoading: (isLoading) => set({ isLoading }),

    clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));

export default useNotificationStore;
export { useNotificationStore };

