/**
 * Sidebar Component
 * Side navigation menu
 */

import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Map,
    AlertTriangle,
    FileText,
    Bell,
    Users,
    Settings,
    X,
    Phone,
    BarChart3,
    Home,
    Radio,
} from 'lucide-react';
import useAuthStore from '../stores/authStore';
import useUIStore from '../stores/uiStore';
import { cn } from '../utils/cn';

const Sidebar = () => {
    const { user } = useAuthStore();
    const { sidebarOpen, mobileMenuOpen, toggleMobileMenu } = useUIStore();
    const isAdmin = user?.role === 'admin';
    const isStaff = user?.role === 'staff' || isAdmin;

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, show: true },
        { name: 'Map View', href: '/map', icon: Map, show: true },
        { name: 'Incidents', href: '/incidents', icon: AlertTriangle, show: true },
        { name: 'Reports', href: '/reports', icon: FileText, show: true },
        { name: 'Emergency Hotlines', href: '/emergency/hotlines', icon: Phone, show: true },
        { name: 'Notifications', href: '/notifications', icon: Bell, show: true },
    ];

    const adminNavigation = [
        { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'User Management', href: '/admin/users', icon: Users },
        { name: 'Incident Management', href: '/admin/incidents', icon: AlertTriangle },
        { name: 'Report Moderation', href: '/admin/reports', icon: FileText },
        { name: 'Shelter Management', href: '/admin/shelters', icon: Home },
        { name: 'Emergency Broadcast', href: '/admin/broadcast', icon: Radio },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ];

    const NavItem = ({ item }) => (
        <NavLink
            to={item.href}
            className={({ isActive }) =>
                cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                )
            }
        >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
        </NavLink>
    );

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Mobile close button */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
                <span className="text-lg font-semibold text-gray-900">Menu</span>
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {/* Main Navigation */}
                {navigation.map((item) => item.show && <NavItem key={item.name} item={item} />)}

                {/* Admin Navigation */}
                {isAdmin && (
                    <>
                        <div className="pt-6 pb-2">
                            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Administration
                            </p>
                        </div>
                        {adminNavigation.map((item) => (
                            <NavItem key={item.name} item={item} />
                        ))}
                    </>
                )}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <NavLink
                    to="/settings"
                    className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                </NavLink>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    'hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-20',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            {mobileMenuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={toggleMobileMenu}
                    />

                    {/* Sidebar */}
                    <aside className="lg:hidden fixed left-0 top-0 h-full w-64 bg-white z-50 shadow-xl">
                        <SidebarContent />
                    </aside>
                </>
            )}
        </>
    );
};

export default Sidebar;
