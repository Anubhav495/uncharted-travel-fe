import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

if (typeof window !== 'undefined') {
    (maplibregl as any).setWorkerUrl('/maplibre-gl-worker.js');
}

// ESRI World Imagery — free satellite tiles, exact same as landing page
const SATELLITE_STYLE: maplibregl.StyleSpecification = {
    version: 8,
    sources: {
        satellite: {
            type: 'raster',
            tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            attribution: '© Esri, Maxar, Earthstar Geographics',
        },
    },
    layers: [
        {
            id: 'satellite',
            type: 'raster',
            source: 'satellite',
            minzoom: 0,
            maxzoom: 22,
        },
    ],
};

interface TrekLocation {
    id: string;
    name: string;
    region: string;
    elevation: string;
    description: string;
    lat: number;
    lng: number;
    zoom: number;
    bearing: number;
    pitch: number;
}

const TREK_LOCATIONS: TrekLocation[] = [
    {
        id: 'kheerganga',
        name: 'Kheerganga',
        region: 'Parvati Valley, Himachal',
        elevation: '9,700 ft',
        description: 'Sacred river gorges & steaming natural hot springs.',
        lat: 32.0098,
        lng: 77.3150,
        zoom: 13.0,
        bearing: -20,
        pitch: 48,
    },
    {
        id: 'spiti',
        name: 'Spiti Valley',
        region: 'Lahaul & Spiti, Himachal',
        elevation: '14,100 ft',
        description: 'Barren moonscape of ancient monasteries & high ridges.',
        lat: 32.2276,
        lng: 78.0710,
        zoom: 11.5,
        bearing: 25,
        pitch: 40,
    },
    {
        id: 'kareri',
        name: 'Kareri Lake',
        region: 'Dhauladhar Range, Kangra',
        elevation: '9,650 ft',
        description: 'Glacial meltwater lake surrounded by alpine granite.',
        lat: 32.3168,
        lng: 76.2872,
        zoom: 13.5,
        bearing: -35,
        pitch: 52,
    },
    {
        id: 'kedarkantha',
        name: 'Kedarkantha',
        region: 'Uttarkashi, Uttarakhand',
        elevation: '12,500 ft',
        description: '360° summit views across thirteen Himalayan giants.',
        lat: 31.0772,
        lng: 78.1820,
        zoom: 12.8,
        bearing: 15,
        pitch: 44,
    },
];

const CYCLE_MS = 6000;

export default function LoginBackgroundMap() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const idxRef = useRef(0);

    const [currentIdx, setCurrentIdx] = useState(0);
    const [mapReady, setMapReady] = useState(false);
    const [fading, setFading] = useState(false);

    const goToSpot = (idx: number, map: maplibregl.Map) => {
        const spot = TREK_LOCATIONS[idx];
        map.flyTo({
            center: [spot.lng, spot.lat],
            zoom: spot.zoom,
            bearing: spot.bearing,
            pitch: spot.pitch,
            duration: 3500,
            curve: 1.4,
            essential: true,
        });

        if (markerRef.current) {
            markerRef.current.setLngLat([spot.lng, spot.lat]);
        }

        setFading(true);
        setTimeout(() => {
            setCurrentIdx(idx);
            setFading(false);
        }, 300);
    };

    const startCycle = (map: maplibregl.Map) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            idxRef.current = (idxRef.current + 1) % TREK_LOCATIONS.length;
            goToSpot(idxRef.current, map);
        }, CYCLE_MS);
    };

    const handleSelectSpot = (idx: number) => {
        if (!mapRef.current) return;
        idxRef.current = idx;
        goToSpot(idx, mapRef.current);
        // Restart cycle after user manually picks
        startCycle(mapRef.current);
    };

    useEffect(() => {
        if (!mapContainerRef.current) return;

        let map: maplibregl.Map;
        try {
            map = new maplibregl.Map({
                container: mapContainerRef.current,
                style: SATELLITE_STYLE,
                center: [TREK_LOCATIONS[0].lng, TREK_LOCATIONS[0].lat],
                zoom: TREK_LOCATIONS[0].zoom,
                bearing: TREK_LOCATIONS[0].bearing,
                pitch: TREK_LOCATIONS[0].pitch,
                attributionControl: false,
                interactive: false,
                fadeDuration: 0,
            });
        } catch {
            return;
        }

        // Red iOS-style pin matching landing page
        const el = document.createElement('div');
        el.style.cssText = 'width:32px;height:40px;cursor:pointer;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.55));';
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="32" height="40">
          <defs>
            <radialGradient id="loginPinGrad" cx="38%" cy="35%" r="60%">
              <stop offset="0%" stop-color="#ff6b6b"/>
              <stop offset="100%" stop-color="#c0392b"/>
            </radialGradient>
          </defs>
          <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24s16-14 16-24C32 7.163 24.837 0 16 0z" fill="url(#loginPinGrad)"/>
          <circle cx="16" cy="15" r="6" fill="white" opacity="0.95"/>
          <circle cx="16" cy="15" r="3" fill="#c0392b"/>
        </svg>`;

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([TREK_LOCATIONS[0].lng, TREK_LOCATIONS[0].lat])
            .addTo(map);
        markerRef.current = marker;

        map.on('load', () => {
            map.resize();
            setMapReady(true);

            // Fly to index 1 quickly to show dynamic movement immediately
            setTimeout(() => {
                if (mapRef.current) {
                    idxRef.current = 1;
                    goToSpot(1, mapRef.current);
                    startCycle(mapRef.current);
                }
            }, 800);
        });

        mapRef.current = map;
        const t0 = setTimeout(() => map.resize(), 100);
        const t1 = setTimeout(() => map.resize(), 500);

        const resize = () => map.resize();
        window.addEventListener('resize', resize);

        return () => {
            clearTimeout(t0);
            clearTimeout(t1);
            if (intervalRef.current) clearInterval(intervalRef.current);
            window.removeEventListener('resize', resize);
            marker.remove();
            map.remove();
            mapRef.current = null;
        };
    }, []);

    const current = TREK_LOCATIONS[currentIdx];

    return (
        <div className="absolute inset-0 overflow-hidden select-none z-0" aria-hidden="true">
            {/* Satellite map view */}
            <div
                ref={mapContainerRef}
                className="w-full h-full scale-105 pointer-events-none"
                style={{ opacity: mapReady ? 1 : 0, transition: 'opacity 1.2s ease' }}
            />

            {/* Clean, balanced vignettes so satellite mountains are clearly visible */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/75 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none" />

            {!mapReady && <div className="absolute inset-0 bg-neutral-950" />}

            {/* Location Card — Bottom Left (Interactive, clickable) */}
            <div
                className="absolute bottom-6 left-6 z-20 hidden md:block max-w-xs bg-black/75 backdrop-blur-md border border-white/15 p-4 pointer-events-auto rounded-none"
                style={{
                    opacity: mapReady ? 1 : 0,
                    transition: 'opacity 0.6s ease',
                }}
            >
                <div
                    style={{
                        opacity: fading ? 0 : 1,
                        transform: fading ? 'translateY(4px)' : 'translateY(0)',
                        transition: 'opacity 0.3s ease, transform 0.3s ease',
                    }}
                >
                    <div className="flex items-baseline justify-between gap-3 mb-1">
                        <p className="text-white text-base font-display font-normal leading-tight">{current.name}</p>
                        <span className="text-white/50 text-[10px] font-sans uppercase tracking-widest shrink-0">{current.elevation}</span>
                    </div>
                    <p className="text-white/60 text-xs font-sans mb-1.5">{current.region}</p>
                    <p className="text-white/40 text-[11px] font-sans leading-relaxed">{current.description}</p>
                </div>

                {/* Spot selector tabs */}
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/10">
                    {TREK_LOCATIONS.map((loc, i) => (
                        <button
                            key={loc.id}
                            type="button"
                            onClick={() => handleSelectSpot(i)}
                            className={`px-2 py-1 text-[10px] uppercase font-sans tracking-wider transition-all duration-200 rounded-none cursor-pointer ${
                                i === currentIdx
                                    ? 'bg-white text-black font-medium'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                            title={`Fly to ${loc.name}`}
                        >
                            {loc.name.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile bottom pill */}
            <div
                className="absolute bottom-4 left-4 right-4 z-20 md:hidden flex items-center justify-between px-3.5 py-2.5 bg-black/80 backdrop-blur-md border border-white/15 pointer-events-auto rounded-none"
                style={{ opacity: mapReady ? 1 : 0, transition: 'opacity 0.6s ease' }}
            >
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-none bg-red-500 animate-pulse shrink-0" />
                    <div>
                        <p className="text-white text-xs font-display">{current.name}</p>
                        <p className="text-white/50 text-[10px] font-sans">{current.elevation}</p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {TREK_LOCATIONS.map((loc, i) => (
                        <button
                            key={loc.id}
                            type="button"
                            onClick={() => handleSelectSpot(i)}
                            className={`h-6 px-2 text-[9px] uppercase font-sans tracking-wider transition-colors rounded-none ${
                                i === currentIdx
                                    ? 'bg-white text-black font-medium'
                                    : 'text-white/60 hover:text-white'
                            }`}
                        >
                            {loc.name.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top-right satellite indicator badge */}
            <div
                className="absolute top-6 right-6 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-black/60 backdrop-blur-md pointer-events-none rounded-none"
                style={{ opacity: mapReady ? 1 : 0, transition: 'opacity 0.8s ease' }}
            >
                <span className="w-1.5 h-1.5 rounded-none bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-sans uppercase tracking-widest text-white/70">Live Satellite Cartography</span>
            </div>
        </div>
    );
}

