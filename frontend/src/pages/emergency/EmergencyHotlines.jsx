/**
 * Emergency Hotlines Page
 * Display emergency contact numbers and hotlines
 */

import { useState } from 'react';
import { Phone, AlertCircle, Clock, Mail, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useActiveContacts } from '../../hooks/useEmergencyContacts';
import { PageSpinner, Alert } from '../../components/common';

const EmergencyHotlines = () => {
    const { data, isLoading, error } = useActiveContacts();
    const [expandedCategories, setExpandedCategories] = useState({});

    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    // Category display configuration
    const categoryConfig = {
        police: {
            title: 'Philippine National Police (PNP)',
            icon: '🚔',
            color: 'blue'
        },
        fire: {
            title: 'Bureau of Fire Protection (BFP)',
            icon: '🚒',
            color: 'red'
        },
        medical: {
            title: 'Medical & Hospital Services',
            icon: '🏥',
            color: 'green'
        },
        disaster_response: {
            title: 'Lipa CDRRMO',
            icon: '🚨',
            color: 'orange'
        },
        government: {
            title: 'Government Services',
            icon: '🏛️',
            color: 'purple'
        },
        utility: {
            title: 'Utility Services',
            icon: '⚡',
            color: 'yellow'
        },
        other: {
            title: 'Other Emergency Services',
            icon: '📞',
            color: 'gray'
        }
    };

    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200 text-blue-900',
        red: 'bg-red-50 border-red-200 text-red-900',
        green: 'bg-green-50 border-green-200 text-green-900',
        orange: 'bg-orange-50 border-orange-200 text-orange-900',
        purple: 'bg-purple-50 border-purple-200 text-purple-900',
        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        gray: 'bg-gray-50 border-gray-200 text-gray-900'
    };

    if (isLoading) {
        return <PageSpinner message="Loading emergency contacts..." />;
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="danger" title="Error Loading Emergency Contacts">
                    Failed to load emergency contacts. Please try again later.
                </Alert>
            </div>
        );
    }

    const contacts = data?.contacts || {};
    const hasContacts = Object.keys(contacts).length > 0;

    console.log('Emergency contacts data:', data);
    console.log('Contacts:', contacts);
    console.log('Has contacts:', hasContacts);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-red-100 rounded-xl">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Emergency Hotlines</h1>
                            <p className="text-gray-600">Quick access to emergency services in Lipa City</p>
                        </div>
                    </div>
                </div>

                {/* National Emergency - 911 */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-xl p-6 mb-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Phone className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">National Emergency</h2>
                                <p className="text-red-100">For immediate life-threatening emergencies</p>
                            </div>
                        </div>
                        <a
                            href="tel:911"
                            className="text-5xl font-bold hover:scale-110 transition-transform"
                        >
                            911
                        </a>
                    </div>
                </div>

                {/* Emergency Contacts by Category */}
                {hasContacts ? (
                    <div className="space-y-4">
                        {Object.entries(contacts).map(([category, categoryContacts]) => {
                            const config = categoryConfig[category] || categoryConfig.other;
                            const isExpanded = expandedCategories[category] !== false; // Default expanded

                            return (
                                <div
                                    key={category}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                                >
                                    {/* Category Header */}
                                    <button
                                        onClick={() => toggleCategory(category)}
                                        className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{config.icon}</span>
                                            <div className="text-left">
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {config.title}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {categoryContacts.length} contact{categoryContacts.length !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp className="w-6 h-6 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-6 h-6 text-gray-400" />
                                        )}
                                    </button>

                                    {/* Category Contacts */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-100">
                                            {categoryContacts.map((contact) => {
                                                const phoneNumbers = JSON.parse(contact.phone_numbers || '[]');

                                                return (
                                                    <div
                                                        key={contact.id}
                                                        className={`p-5 border-b border-gray-100 last:border-b-0 ${colorClasses[config.color]
                                                            } bg-opacity-30`}
                                                    >
                                                        <div className="flex items-start justify-between mb-3">
                                                            <h4 className="text-lg font-bold text-gray-900">
                                                                {contact.name}
                                                            </h4>
                                                            {contact.is_24_7 && (
                                                                <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                                                    <Clock className="w-3 h-3" />
                                                                    24/7
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Phone Numbers */}
                                                        <div className="space-y-2 mb-3">
                                                            {phoneNumbers.map((phone, idx) => (
                                                                <a
                                                                    key={idx}
                                                                    href={`tel:${phone}`}
                                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors group"
                                                                >
                                                                    <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                                    <span className="text-lg">{phone}</span>
                                                                </a>
                                                            ))}
                                                        </div>

                                                        {/* Email */}
                                                        {contact.email && (
                                                            <a
                                                                href={`mailto:${contact.email}`}
                                                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm mb-2 transition-colors"
                                                            >
                                                                <Mail className="w-4 h-4" />
                                                                {contact.email}
                                                            </a>
                                                        )}

                                                        {/* Address */}
                                                        {contact.address && (
                                                            <div className="flex items-start gap-2 text-gray-600 text-sm mb-2">
                                                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                                <span>{contact.address}</span>
                                                            </div>
                                                        )}

                                                        {/* Operating Hours */}
                                                        {!contact.is_24_7 && contact.operating_hours && (
                                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                                <Clock className="w-4 h-4" />
                                                                <span>{contact.operating_hours}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Emergency Contacts Available
                        </h3>
                        <p className="text-gray-600">
                            Emergency contact information will be displayed here once added by administrators.
                        </p>
                    </div>
                )}

                {/* Important Notice */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mt-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-amber-900 mb-2">Important Notice</h3>
                            <ul className="text-sm text-amber-800 space-y-1">
                                <li>• For life-threatening emergencies, always call <strong>911</strong> first</li>
                                <li>• Keep your phone charged and accessible at all times</li>
                                <li>• Save these numbers in your phone for quick access</li>
                                <li>• Stay calm and provide clear information when calling</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyHotlines;
