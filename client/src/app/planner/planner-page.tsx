'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Compass, Clock, Save, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/ui/MapComponent'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-3xl flex items-center justify-center text-gray-400">Loading Map...</div>
});

export default function PlannerPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [tripData, setTripData] = useState<any>(null);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        destination: '',
        durationDays: 1,
        tripType: 'Trek',
    });

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setTripData(null);

        try {
            const response = await api.post('/ai/generate', formData);
            setTripData(response.data);
            toast.success('Trip generated successfully!');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to generate trip');
            toast.error('Failed to generate trip');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!tripData) return;
        try {
            const response = await api.post('/trips', {
                title: tripData.tripTitle || `Trip to ${formData.destination}`,
                location: formData.destination,
                tripType: formData.tripType,
                durationDays: formData.durationDays,
                routeData: tripData,
                weatherForecast: tripData.weatherForecast || {},
                imageUrl: tripData.generatedImageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop'
            });
            toast.success('Trip saved to history!');
            router.push('/history');
        } catch (err) {
            console.error(err);
            toast.error('Failed to save trip');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">

                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                <Sparkles size={20} />
                            </div>
                            <h2 className="text-2xl font-bold">New Trip</h2>
                        </div>

                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                                        placeholder="e.g. Paris, Tokyo"
                                        value={formData.destination}
                                        onChange={e => setFormData({ ...formData, destination: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Days)</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="number"
                                        min={formData.tripType === 'Cycling' ? "2" : "1"}
                                        max="3"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                                        value={formData.durationDays}
                                        onChange={e => {
                                            const val = parseInt(e.target.value);
                                            setFormData({ ...formData, durationDays: val });
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    {formData.tripType === 'Cycling' ? '2-3 days' : '1-3 days'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Trip Style</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Trek', 'Cycling'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => {
                                                const isCycling = type === 'Cycling';
                                                setFormData({
                                                    ...formData,
                                                    tripType: type,
                                                    durationDays: isCycling ? 2 : 1 // Set default valid duration
                                                });
                                            }}
                                            className={`py-2 rounded-lg text-sm font-medium transition-all ${formData.tripType === type
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                                {loading ? 'Planning...' : 'Generate Trip'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    {/* Empty State */}
                    {!tripData && !loading && !error && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 p-12 border-2 border-dashed border-gray-200 rounded-3xl">
                            <Compass size={64} className="mb-4 opacity-20" />
                            <p className="text-xl font-medium">Ready to explore?</p>
                            <p className="text-sm">Enter your preferences to start planning</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-64 bg-gray-200 rounded-3xl w-full"></div>
                            <div className="h-40 bg-gray-200 rounded-3xl w-full"></div>
                            <div className="h-40 bg-gray-200 rounded-3xl w-full"></div>
                        </div>
                    )}

                    {/* Trip Content */}
                    <AnimatePresence>
                        {tripData && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Header */}
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-start">
                                    <div>
                                        <h1 className="text-3xl font-bold mb-2">{tripData.tripTitle}</h1>
                                        <p className="text-gray-500">{tripData.description}</p>
                                    </div>
                                    <button
                                        onClick={handleSave}
                                        className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg shadow-green-100"
                                    >
                                        <Save size={18} />
                                        Save Trip
                                    </button>
                                </div>

                                {/* Weather Forecast */}
                                {tripData.weatherForecast?.daily && (
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                                                <Compass size={18} />
                                            </div>
                                            3-Day Forecast
                                        </h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            {tripData.weatherForecast.daily.time.slice(0, 3).map((date: string, idx: number) => (
                                                <div key={idx} className="bg-blue-50 p-4 rounded-xl text-center">
                                                    <div className="text-gray-500 text-xs mb-1">{date}</div>
                                                    <div className="font-black text-xl text-blue-600">
                                                        {Math.round((tripData.weatherForecast.daily.temperature_2m_max[idx] + tripData.weatherForecast.daily.temperature_2m_min[idx]) / 2)}°C
                                                    </div>
                                                    <div className="text-xs text-blue-400">
                                                        {tripData.weatherForecast.daily.temperature_2m_min[idx]}° - {tripData.weatherForecast.daily.temperature_2m_max[idx]}°
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Map Visualization */}
                                <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100">
                                    <MapComponent
                                        itinerary={tripData.itinerary || []}
                                        tripType={formData.tripType}
                                    />
                                </div>

                                {/* Daily Itinerary */}
                                <div className="space-y-4">
                                    {tripData.itinerary?.map((day: any, index: number) => (
                                        <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-lg">
                                                        Day {day.day}
                                                    </div>
                                                </div>
                                                {day.dailyDistance && (
                                                    <div className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                        Distance: {day.dailyDistance}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-6 border-l-2 border-gray-100 pl-6 ml-3">
                                                {day.activities?.map((activity: any, idx: number) => (
                                                    <div key={idx} className="relative">
                                                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-indigo-200 border-2 border-white ring-1 ring-indigo-50"></div>
                                                        <div className="text-sm font-bold text-gray-400 mb-1">{activity.time}</div>
                                                        <h4 className="font-bold text-lg">{activity.location}</h4>
                                                        <p className="text-gray-600">{activity.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
