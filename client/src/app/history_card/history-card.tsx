'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Navigation, X } from 'lucide-react';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/ui/MapComponent'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl" />
});

export interface Trip {
    _id: string;
    title: string;
    location: string;
    durationDays: number;
    tripType: string;
    imageUrl?: string;
    createdAt?: string;
    routeData?: {
        itinerary: any[];
        tripTitle?: string;
        description?: string;
    };
    weatherForecast?: any;
}

interface HistoryCardProps {
    entry: Trip;
    onClose: () => void;
}

export default function HistoryCard({ entry, onClose }: HistoryCardProps) {
    const [activeTab, setActiveTab] = useState<'details' | 'map'>('details');

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const formattedDate = entry.createdAt
        ? format(new Date(entry.createdAt), 'MMMM d, yyyy')
        : 'Recently';

    const validImageUrl = `https://loremflickr.com/1280/720/${entry.location},${entry.tripType}/all`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative z-10 flex flex-col"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X size={24} className="text-gray-600" />
                </button>

                <div className="relative h-64 flex-shrink-0">
                    <img
                        src={validImageUrl}
                        alt={entry.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <div className="p-8 text-white">
                            <h2 className="text-3xl font-black mb-2">{entry.title}</h2>
                            <div className="flex items-center gap-4 text-white/90">
                                <span className="flex items-center gap-1"><MapPin size={16} /> {entry.location}</span>
                                <span className="flex items-center gap-1"><Navigation size={16} /> {entry.tripType}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex border-b border-gray-100 sticky top-0 bg-white z-10">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'details'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Calendar size={16} />
                            Trip Details
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('map')}
                        className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'map'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Navigation size={16} />
                            Route Map
                        </div>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {activeTab === 'details' ? (
                        <div className="space-y-8">
                            {entry.routeData?.description && (
                                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                    <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                                        Trip Overview
                                    </h4>
                                    <p className="text-indigo-800 italic leading-relaxed">"{entry.routeData.description}"</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Duration</div>
                                    <div className="font-bold text-gray-800 text-lg">{entry.durationDays} Days</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Created</div>
                                    <div className="font-bold text-gray-800 text-lg">{formattedDate}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Distance</div>
                                    <div className="font-bold text-gray-800 text-lg">
                                        {entry.routeData?.itinerary?.reduce((acc: number, day: any) => acc + (parseFloat(day.dailyDistance) || 0), 0) || '?'} km
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Stops</div>
                                    <div className="font-bold text-gray-800 text-lg">
                                        {entry.routeData?.itinerary?.reduce((acc: number, day: any) => acc + (day.activities?.length || 0), 0) || 0}
                                    </div>
                                </div>
                            </div>

                            {entry.routeData?.itinerary && (
                                <div>
                                    <h4 className="font-bold text-xl mb-6 text-gray-900">Itinerary</h4>
                                    <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
                                        {entry.routeData.itinerary.map((day: any, idx: number) => (
                                            <div key={idx} className="relative pl-12 group">
                                                <div className="absolute left-0 top-0 bg-indigo-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-md ring-4 ring-white z-10 text-sm">
                                                    {day.day}
                                                </div>
                                                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h5 className="font-bold text-lg text-gray-900">Day {day.day}</h5>
                                                        <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                                            {day.dailyDistance}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {day.activities?.map((activity: any, actIdx: number) => (
                                                            <div key={actIdx} className="flex gap-3 text-sm text-gray-600">
                                                                <Clock size={14} className="mt-0.5 text-gray-400 flex-shrink-0" />
                                                                <span>
                                                                    <span className="font-bold text-gray-900">{activity.location}</span>: {activity.description}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-[600px] w-full bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-200 shadow-inner">
                            {entry.routeData?.itinerary ? (
                                <MapComponent
                                    itinerary={entry.routeData.itinerary}
                                    tripType={entry.tripType}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <MapPin size={48} className="mx-auto mb-2 opacity-20" />
                                        <p>No route data available</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}