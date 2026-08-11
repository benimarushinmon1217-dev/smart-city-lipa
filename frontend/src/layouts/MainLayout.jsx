/**
 * Main Layout
 * Layout for authenticated pages with navbar and sidebar
 */

import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import useUIStore from '../stores/uiStore';

const MainLayout = () => {
    const { sidebarOpen } = useUIStore();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            <div className="flex">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main
                    className={`flex-1 transition-all duration-300 pt-16 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
                        }`}
                >
                    <div className="p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
