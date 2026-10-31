import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

if (typeof window !== 'undefined') {
    (maplibregl as any).setWorkerUrl('/maplibre-gl-worker.js');
}

// ESRI World Imagery — free satellite tiles, no API key needed
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

interface TrekSpot {
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

const TREK_SPOTS: TrekSpot[] = [
    {
        id: 'kheerganga',
        name: 'Kheerganga',
        region: 'Parvati Valley, Himachal Pradesh',
        elevation: '9,700 ft',
        description: 'Sacred river gorges, ancient cedar groves, and natural steaming mineral pools revered by generations of mountain folk.',
        lat: 32.0098,
        lng: 77.3150,
        zoom: 13.0,
        bearing: -20,
        pitch: 48,
    },
    {
        id: 'spiti',
        name: 'Spiti Valley',
        region: 'Lahaul & Spiti, Himachal Pradesh',
        elevation: '14,100 ft',
        description: 'A barren moonscape of millennium-old Tibetan monasteries, fossil villages, and crystal blue crescent waters.',
        lat: 32.2276,
        lng: 78.0710,
        zoom: 11.5,
        bearing: 25,
        pitch: 40,
    },
    {
        id: 'kareri',
        name: 'Kareri Lake',
        region: 'Kangra District, Dhauladhar Range',
        elevation: '9,650 ft',
        description: 'Fed directly by melting snows of the Minkiani Pass. Quiet alpine meadows surrounded by pristine Dhauladhar granite.',
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
        description: 'Panoramic 360-degree views of thirteen Himalayan giants, pine forest ridges, and deep winter snowpack.',
        lat: 31.0772,
        lng: 78.1820,
        zoom: 12.8,
        bearing: 15,
        pitch: 44,
    },
];

const HimalayanMapSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);
    const idxRef = useRef(0);
    const hasStartedRef = useRef(false);

    const [currentIdx, setCurrentIdx] = useState(0);
    const [mapReady, setMapReady] = useState(false);
    const [fading, setFading] = useState(false);

    const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const triggerNext = (map: maplibregl.Map) => {
        if (!map) return;
        idxRef.current = (idxRef.current + 1) % TREK_SPOTS.length;
        goToSpot(idxRef.current, map);
    };

    const goToSpot = (idx: number, map: maplibregl.Map) => {
        if (!map) return;
        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
            transitionTimeoutRef.current = null;
        }

        const spot = TREK_SPOTS[idx];
        const flyDuration = 3200; // Smooth 3.2s cinematic flight across terrain

        map.flyTo({
            center: [spot.lng, spot.lat],
            zoom: spot.zoom,
            bearing: spot.bearing,
            pitch: spot.pitch,
            duration: flyDuration,
            curve: 1.35,
            essential: true,
        });

        if (markerRef.current) markerRef.current.setLngLat([spot.lng, spot.lat]);
        setFading(true);
        setTimeout(() => { 
            setCurrentIdx(idx); 
            setFading(false); 
        }, 350);

        // MapLibre fires 'moveend' when the flyTo camera finishes landing
        let reached = false;
        const onDestinationReached = () => {
            if (reached) return;
            reached = true;
            map.off('moveend', onDestinationReached);

            // "as soon as it reaches the destination wait of .5 s and go for second transition"
            transitionTimeoutRef.current = setTimeout(() => {
                triggerNext(map);
            }, 500); // exactly 0.5s pause
        };

        map.once('moveend', onDestinationReached);

        // Fallback safety timeout in case moveend is swallowed by browser/worker
        transitionTimeoutRef.current = setTimeout(() => {
            if (!reached) {
                onDestinationReached();
            }
        }, flyDuration + 550);
    };

    useEffect(() => {
        if (!mapContainerRef.current) return;
        let map: maplibregl.Map;
        try {
            map = new maplibregl.Map({
                container: mapContainerRef.current,
                style: SATELLITE_STYLE,
                center: [TREK_SPOTS[0].lng, TREK_SPOTS[0].lat],
                zoom: TREK_SPOTS[0].zoom,
                bearing: TREK_SPOTS[0].bearing,
                pitch: TREK_SPOTS[0].pitch,
                attributionControl: false,
                interactive: false,
                fadeDuration: 0,
            });
        } catch { return; }

        // Red iOS-style pin
        const el = document.createElement('div');
        el.style.cssText = 'width:32px;height:40px;cursor:default;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.55));';
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="32" height="40">
          <defs>
            <radialGradient id="pinGrad" cx="38%" cy="35%" r="60%">
              <stop offset="0%" stop-color="#ff6b6b"/>
              <stop offset="100%" stop-color="#c0392b"/>
            </radialGradient>
          </defs>
          <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24s16-14 16-24C32 7.163 24.837 0 16 0z" fill="url(#pinGrad)"/>
          <circle cx="16" cy="15" r="6" fill="white" opacity="0.95"/>
          <circle cx="16" cy="15" r="3" fill="#c0392b"/>
        </svg>`;

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([TREK_SPOTS[0].lng, TREK_SPOTS[0].lat])
            .addTo(map);
        markerRef.current = marker;

        map.on('load', () => { map.resize(); setMapReady(true); });
        mapRef.current = map;

        const t0 = setTimeout(() => map.resize(), 100);
        const t1 = setTimeout(() => map.resize(), 500);
        const resize = () => map.resize();
        window.addEventListener('resize', resize);

        return () => {
            clearTimeout(t0); clearTimeout(t1);
            if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
            window.removeEventListener('resize', resize);
            marker.remove(); map.remove();
            mapRef.current = null;
        };
    }, []);

    // Trigger immediately on scroll into view: smoothly fly to next spot, wait 0.5s, and keep cycling
    useEffect(() => {
        if (!mapReady || !sectionRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasStartedRef.current) {
                    hasStartedRef.current = true;
                    idxRef.current = 1;
                    if (mapRef.current) {
                        goToSpot(1, mapRef.current);
                    }
                }
            },
            { threshold: 0.25 }
        );
        observer.observe(sectionRef.current);
        return () => {
            observer.disconnect();
            if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
        };
    }, [mapReady]);

    const spot = TREK_SPOTS[currentIdx];

    return (
        <section id="expedition-map" ref={sectionRef} className="relative z-10 isolate bg-black text-white">
            {/* Satellite map */}
            <div
                ref={mapContainerRef}
                className="w-full h-[50vh] sm:h-[60vh] md:h-[68vh] min-h-[340px] max-h-[700px] overflow-hidden"
                style={{ opacity: mapReady ? 1 : 0, transition: 'opacity 1.5s ease' }}
            />

            {/* Keep the terrain visible while giving the text contrast. */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/10 to-transparent pointer-events-none" />

            {!mapReady && <div className="absolute inset-0 bg-black" />}

            {/* Fade across the section edges to blend the forest and satellite imagery. */}
            <div aria-hidden="true" className="absolute inset-x-0 -top-24 sm:-top-32 pointer-events-none">
                <div className="expedition-map-edge-fade h-24 sm:h-32 rotate-180" />
                <div className="expedition-map-edge-fade h-32 sm:h-48" />
            </div>
            <div aria-hidden="true" className="absolute inset-x-0 -bottom-24 sm:-bottom-32 pointer-events-none">
                <div className="expedition-map-edge-fade h-32 sm:h-48 rotate-180" />
                <div className="expedition-map-edge-fade h-24 sm:h-32" />
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none">

                {/* Top-left heading */}
                <div className="px-5 pt-6 sm:px-8 sm:pt-8 md:px-12 md:pt-10">
                    <p className="text-[10px] font-sans uppercase tracking-widest text-white/50 mb-1.5">
                        Expedition Map
                    </p>
                    <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-normal text-white leading-tight drop-shadow-lg">
                        Where we<br />
                        <span className="italic text-white/80">guide you</span>
                    </h2>
                </div>

                {/* Bottom-left info */}
                <div className="px-5 pb-6 sm:px-8 sm:pb-8 md:px-12 md:pb-10">
                    {/* Progress indicators */}
                    <div className="flex items-center gap-1.5 mb-3">
                        {TREK_SPOTS.map((_, i) => (
                            <span
                                key={i}
                                className="block rounded-none transition-all duration-500"
                                style={{
                                    width: i === currentIdx ? '18px' : '4px',
                                    height: '3px',
                                    background: i === currentIdx ? 'white' : 'rgba(255,255,255,0.25)',
                                }}
                            />
                        ))}
                    </div>

                    {/* Trek card */}
                    <div
                        className="max-w-[280px] sm:max-w-sm bg-black/75 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-none"
                        style={{
                            opacity: fading ? 0 : 1,
                            transform: fading ? 'translateY(6px)' : 'translateY(0)',
                            transition: 'opacity 0.35s ease, transform 0.35s ease',
                        }}
                    >
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                            <h3 className="font-display text-lg sm:text-xl text-white font-normal leading-tight">
                                {spot.name}
                            </h3>
                            <span className="text-[10px] font-sans text-white/45 uppercase tracking-widest shrink-0">
                                {spot.elevation}
                            </span>
                        </div>
                        <p className="text-[11px] font-sans text-white/45 mb-2">{spot.region}</p>
                        <p className="hidden sm:block text-xs sm:text-sm font-sans text-white/65 leading-relaxed mb-3">
                            {spot.description}
                        </p>
                        <Link
                            href="/destinations"
                            className="inline-flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-wider text-white/75 hover:text-white transition-colors group pointer-events-auto"
                        >
                            <span>Explore treks</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HimalayanMapSection;
