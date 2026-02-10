'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface Activity {
    coordinates?: {
        lat: number;
        lng: number;
    };
    location?: string;
    description?: string;
}

interface Day {
    day: number;
    activities: Activity[];
}

interface MapComponentProps {
    itinerary: Day[];
    tripType: string;
}

export default function MapComponent({ itinerary, tripType }: MapComponentProps) {
    const [routePolylines, setRoutePolylines] = useState<any[]>([]);

    useEffect(() => {
        const fetchRoutes = async () => {
            if (!itinerary || itinerary.length === 0) return;

            const routes = await Promise.all(itinerary.map(async (day, index) => {
                const coordinates = day.activities
                    .filter(a => a.coordinates?.lat && a.coordinates?.lng)
                    .map(a => `${a.coordinates!.lng},${a.coordinates!.lat}`)
                    .join(';');

                if (!coordinates || day.activities.length < 2) return null;

                // OSRM Profile: bike for Cycling, foot for Trek
                const profile = tripType === 'Cycling' ? 'bike' : 'foot';

                try {
                    const response = await fetch(`https://router.project-osrm.org/route/v1/${profile}/${coordinates}?overview=full&geometries=geojson`);
                    const data = await response.json();

                    if (data.routes && data.routes.length > 0) {
                        return {
                            geometry: data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]), // Flip to [lat, lng]
                            color: getColorForDay(index)
                        };
                    }
                } catch (err) {
                    console.error('Failed to fetch route', err);
                }
                return null;
            }));

            setRoutePolylines(routes.filter(r => r !== null));
        };

        fetchRoutes();
    }, [itinerary, tripType]);

    // Flatten activities for markers/centering
    const allActivities = itinerary?.flatMap(day => day.activities) || [];
    const positions = allActivities
        .filter(a => a.coordinates?.lat && a.coordinates?.lng)
        .map(a => [a.coordinates!.lat, a.coordinates!.lng] as [number, number]);

    if (positions.length === 0) return <div className="p-4 text-gray-500 text-center bg-gray-100 rounded-xl">No coordinates available for map</div>;

    const center = positions[0];

    return (
        <div className="h-[400px] w-full rounded-3xl overflow-hidden shadow-sm border border-gray-100 z-0">
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Render OSRM Paths */}
                {routePolylines.map((route, idx) => (
                    <Polyline
                        key={idx}
                        positions={route.geometry}
                        pathOptions={{ color: route.color, weight: 4, opacity: 0.7 }}
                    />
                ))}

                {/* Render Markers */}
                {allActivities.map((activity, idx) => (
                    activity.coordinates && (
                        <Marker
                            key={idx}
                            position={[activity.coordinates!.lat, activity.coordinates!.lng] as [number, number]}
                            icon={icon}
                        >
                            <Popup>
                                <strong>{activity.location}</strong><br />
                                {activity.description}
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
}

function getColorForDay(index: number) {
    const colors = ['#4F46E5', '#EC4899', '#10B981', '#F59E0B', '#6366F1'];
    return colors[index % colors.length];
}
