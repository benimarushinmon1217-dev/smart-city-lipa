/**
 * UI Store
 * Zustand store for UI state (sidebar, modals, etc.)
 */

import { create } from 'zustand';

const useUIStore = create((set) => ({
    // Sidebar state
    sidebarOpen: true,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    // Mobile menu state
    mobileMenuOpen: false,
    toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
    setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

    // Modal state
    modals: {},
    openModal: (modalId) => set((state) => ({
        modals: { ...state.modals, [modalId]: true },
    })),
    closeModal: (modalId) => set((state) => ({
        modals: { ...state.modals, [modalId]: false },
    })),
    isModalOpen: (modalId) => (state) => state.modals[modalId] || false,

    // Loading state
    globalLoading: false,
    setGlobalLoading: (loading) => set({ globalLoading: loading }),

    // Theme
    theme: localStorage.getItem('theme') || 'light',
    setTheme: (theme) => {
        localStorage.setItem('theme', theme);
        set({ theme });
    },
    toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        return { theme: newTheme };
    }),

    // Chatbot
    chatbotOpen: false,
    toggleChatbot: () => set((state) => ({ chatbotOpen: !state.chatbotOpen })),
    setChatbotOpen: (open) => set({ chatbotOpen: open }),
}));

export default useUIStore;
export { useUIStore };

