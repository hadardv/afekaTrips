'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Trash2, Clock, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import HistoryCard, { Trip } from '../history_card/history-card';

export default function HistoryPage() {
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrip, setSelectedTrip] = useState<Trip>();

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await api.get('/trips');
                setTrips(response.data);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load trips');
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this trip?')) return;
        try {
            await api.delete(`/trips/${id}`);
            setTrips(trips.filter(t => t._id !== id));
            toast.success('Trip deleted');
        } catch (err) {
            console.error(err);
            toast.error('Delete not implemented yet (or failed)');
        }
    };

    const handleViewDetails = (id: string) => {
        setSelectedTrip(trips.find(t => t._id === id));
        console.log(selectedTrip);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 text-black">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">Your Adventures</h1>
                    <Link href="/planner" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                        + New Trip
                    </Link>
                </div>

                {trips.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-block p-6 rounded-full bg-indigo-50 text-indigo-200 mb-6">
                            <MapPin size={48} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No trips yet</h3>
                        <p className="text-gray-500 mb-8">Start planning your next adventure today!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trips.map((trip, index) => (
                            console.log(`https://image.pollinations.ai/prompt/${encodeURIComponent(trip.tripType + ' trip in ' + trip.location + ' landscape')}?width=800&height=600&nologo=true`),
                            <motion.div
                                key={trip._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={`https://loremflickr.com/800/600/${trip.location},landscape/all`}
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop';
                                        }}
                                        alt={trip.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />

                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                        {trip.tripType}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 line-clamp-1">{trip.title}</h3>

                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} />
                                            {trip.location}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock size={16} />
                                            {trip.durationDays} Days
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-6">
                                        <button onClick={() => handleViewDetails(trip._id)} className="text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                            View Details <ArrowRight size={16} />
                                        </button>



                                        <button
                                            onClick={() => handleDelete(trip._id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {selectedTrip && (
                <HistoryCard
                    entry={selectedTrip}
                    onClose={() => setSelectedTrip(undefined)}
                />
            )}
        </div>
    );
}
