import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const CARTO_DARK = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
const FALLBACK_STYLE = 'https://demotiles.maplibre.org/style.json';

interface FeaturedPlace {
    name: string;
    city: string;
    region: string;
    lat: number;
    lng: number;
    zoom?: number;
}

const FEATURED_PLACES: FeaturedPlace[] = [
    { name: 'Parvati Valley & Kasol', city: 'Kullu', region: 'Himachal Pradesh', lat: 32.0098, lng: 77.3150, zoom: 12.5 },
    { name: 'Spiti Valley & Kaza', city: 'Spiti', region: 'Himachal Pradesh', lat: 32.2276, lng: 78.0710, zoom: 11.5 },
    { name: 'Kareri Glacial Tarn', city: 'Dharamshala', region: 'Dhauladhar Range', lat: 32.3168, lng: 76.2872, zoom: 13.0 },
    { name: 'Sankri Ridge & Kedarkantha', city: 'Uttarkashi', region: 'Uttarakhand', lat: 31.0772, lng: 78.1820, zoom: 12.8 },
];

export default function LoginBackgroundMap() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const [currentPlace, setCurrentPlace] = useState(FEATURED_PLACES[0]);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        let map: maplibregl.Map;
        try {
            map = new maplibregl.Map({
                container: mapContainerRef.current,
                style: CARTO_DARK,
                center: [FEATURED_PLACES[0].lng, FEATURED_PLACES[0].lat],
                zoom: 8,
                attributionControl: false,
                interactive: false,
                fadeDuration: 0,
            });
        } catch {
            return;
        }

        map.on('error', () => {
            try {
                map.setStyle(FALLBACK_STYLE);
            } catch {
                // fallback
            }
        });

        map.on('load', () => {
            map.resize();
            map.flyTo({
                center: [FEATURED_PLACES[0].lng, FEATURED_PLACES[0].lat],
                zoom: FEATURED_PLACES[0].zoom ?? 12.5,
                speed: 1.2,
                curve: 1.4,
                essential: true,
            });
        });

        mapRef.current = map;

        const t0 = setTimeout(() => map.resize(), 50);
        const t1 = setTimeout(() => map.resize(), 250);

        let placeIndex = 0;
        const interval = setInterval(() => {
            if (!mapRef.current) return;
            placeIndex = (placeIndex + 1) % FEATURED_PLACES.length;
            const nextPlace = FEATURED_PLACES[placeIndex];
            setCurrentPlace(nextPlace);
            mapRef.current.flyTo({
                center: [nextPlace.lng, nextPlace.lat],
                zoom: nextPlace.zoom ?? 12.5,
                speed: 0.8,
                curve: 1.4,
                essential: true,
            });
        }, 6500);

        return () => {
            clearTimeout(t0);
            clearTimeout(t1);
            clearInterval(interval);
            map.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0" aria-hidden="true">
            <div ref={mapContainerRef} className="w-full h-full opacity-60 scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/90 pointer-events-none" />

            {/* Location indicator in bottom-left */}
            <div className="absolute bottom-6 left-6 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-black/75 backdrop-blur-md text-[11px] text-white/60 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                    Gliding over <span className="text-white font-medium">{currentPlace.name}</span> &middot; {currentPlace.region}
                </span>
            </div>
        </div>
    );
}
