/**
 * Navbar Component
 * Top navigation bar with user menu and notifications
 */

import { Menu } from '@headlessui/react';
import { Menu as MenuIcon, User, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { APP_NAME } from '../utils/constants';
import NotificationBell from '../components/notifications/NotificationBell';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { toggleSidebar, toggleMobileMenu } = useUIStore();

    const handleLogout = async () => {
        logout();
    };

    return (
        <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side */}
                    <div className="flex items-center">
                        {/* Mobile menu button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 mr-2"
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>

                        {/* Sidebar toggle (desktop) */}
                        <button
                            onClick={toggleSidebar}
                            className="hidden lg:block p-2 rounded-md text-gray-600 hover:bg-gray-100 mr-4"
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>

                        {/* Logo */}
                        <Link to="/dashboard" className="flex items-center">
                            <span className="text-xl font-bold text-primary-600">
                                {APP_NAME}
                            </span>
                        </Link>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <NotificationBell />

                        {/* User menu */}
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100">
                                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.first_name} {user?.last_name}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                </div>
                            </Menu.Button>

                            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/profile"
                                                className={`${active ? 'bg-gray-100' : ''
                                                    } flex items-center px-4 py-2 text-sm text-gray-700`}
                                            >
                                                <User className="h-4 w-4 mr-3" />
                                                Profile
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/settings"
                                                className={`${active ? 'bg-gray-100' : ''
                                                    } flex items-center px-4 py-2 text-sm text-gray-700`}
                                            >
                                                <Settings className="h-4 w-4 mr-3" />
                                                Settings
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <div className="border-t border-gray-100"></div>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={handleLogout}
                                                className={`${active ? 'bg-gray-100' : ''
                                                    } flex items-center w-full px-4 py-2 text-sm text-danger-600`}
                                            >
                                                <LogOut className="h-4 w-4 mr-3" />
                                                Logout
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Menu>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
