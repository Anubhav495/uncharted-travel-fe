import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const CARTO_DARK = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
const FALLBACK_STYLE = 'https://demotiles.maplibre.org/style.json';

interface HimalayanLocation {
    id: string;
    name: string;
    region: string;
    state: string;
    elevation: string;
    category: string;
    lat: number;
    lng: number;
    zoom: number;
    description: string;
    trekSlug: string;
}

const FEATURED_LOCATIONS: HimalayanLocation[] = [
    {
        id: 'parvati',
        name: 'Parvati Valley & Kheerganga',
        region: 'Kullu District',
        state: 'Himachal Pradesh',
        elevation: '9,700 FT',
        category: 'Thermal Springs & Pines',
        lat: 32.0098,
        lng: 77.3150,
        zoom: 12.5,
        description: 'Sacred river gorges, ancient cedar groves, and natural steaming mineral pools revered by generations of mountain folk.',
        trekSlug: 'kheerganga',
    },
    {
        id: 'spiti',
        name: 'Spiti Valley & Chandratal',
        region: 'Lahaul & Spiti',
        state: 'Himachal Pradesh',
        elevation: '14,100 FT',
        category: 'High Altitude Desert',
        lat: 32.2276,
        lng: 78.0710,
        zoom: 11.5,
        description: 'A barren moonscape of millennium-old Tibetan monasteries, fossil villages, and crystal blue crescent waters.',
        trekSlug: 'spiti-valley',
    },
    {
        id: 'kareri',
        name: 'Kareri Glacial Lake',
        region: 'Kangra District',
        state: 'Himachal Pradesh',
        elevation: '9,650 FT',
        category: 'Alpine Glacial Tarn',
        lat: 32.3168,
        lng: 76.2872,
        zoom: 13.0,
        description: 'Fed directly by melting snows of the Minkiani Pass. Quiet alpine meadows surrounded by pristine Dhauladhar granite.',
        trekSlug: 'kareri-lake',
    },
    {
        id: 'sankri',
        name: 'Kedarkantha & Sankri',
        region: 'Uttarkashi',
        state: 'Uttarakhand',
        elevation: '12,500 FT',
        category: 'High Ridge Alpinism',
        lat: 31.0772,
        lng: 78.1820,
        zoom: 12.8,
        description: 'Panoramic 360-degree views of thirteen Himalayan giants, pine forest ridges, and deep winter snowpack.',
        trekSlug: 'kedarkantha',
    },
];

const HimalayanMapSection: React.FC = () => {
    const bgMapContainerRef = useRef<HTMLDivElement>(null);
    const bgMapRef = useRef<maplibregl.Map | null>(null);

    const exhibitMapContainerRef = useRef<HTMLDivElement>(null);
    const exhibitMapRef = useRef<maplibregl.Map | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);

    const [selectedLoc, setSelectedLoc] = useState<HimalayanLocation>(FEATURED_LOCATIONS[0]);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

    const syncLocation = (loc: HimalayanLocation) => {
        setSelectedLoc(loc);

        // Fly exhibit map to high-detail terrain
        if (exhibitMapRef.current) {
            exhibitMapRef.current.flyTo({
                center: [loc.lng, loc.lat],
                zoom: loc.zoom,
                duration: 2500,
                curve: 1.4,
                essential: true,
            });

            if (markerRef.current) {
                markerRef.current.setLngLat([loc.lng, loc.lat]);
            }
        }

        // Fly background map to regional vantage
        if (bgMapRef.current) {
            bgMapRef.current.flyTo({
                center: [loc.lng, loc.lat],
                zoom: 7.5,
                duration: 2500,
                curve: 1.4,
                essential: true,
            });
        }
    };

    // Initialize Background Map
    useEffect(() => {
        if (!bgMapContainerRef.current) return;

        let bgMap: maplibregl.Map;
        try {
            bgMap = new maplibregl.Map({
                container: bgMapContainerRef.current,
                style: CARTO_DARK,
                center: [FEATURED_LOCATIONS[0].lng, FEATURED_LOCATIONS[0].lat],
                zoom: 7.2,
                attributionControl: false,
                interactive: false,
                fadeDuration: 0,
            });
        } catch {
            return;
        }

        bgMap.on('error', () => {
            try {
                bgMap.setStyle(FALLBACK_STYLE);
            } catch {
                // ignore
            }
        });

        bgMapRef.current = bgMap;

        const resize = () => bgMap.resize();
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            bgMap.remove();
            bgMapRef.current = null;
        };
    }, []);

    // Initialize Exhibit Map
    useEffect(() => {
        if (!exhibitMapContainerRef.current) return;

        let exhibitMap: maplibregl.Map;
        try {
            exhibitMap = new maplibregl.Map({
                container: exhibitMapContainerRef.current,
                style: CARTO_DARK,
                center: [FEATURED_LOCATIONS[0].lng, FEATURED_LOCATIONS[0].lat],
                zoom: FEATURED_LOCATIONS[0].zoom,
                attributionControl: false,
                fadeDuration: 0,
            });
        } catch {
            return;
        }

        exhibitMap.on('error', () => {
            try {
                exhibitMap.setStyle(FALLBACK_STYLE);
            } catch {
                // ignore
            }
        });

        // Custom teardrop pin marker
        const el = document.createElement('div');
        el.className = 'custom-map-pin';
        el.innerHTML = `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
                <div style="width: 22px; height: 22px; background: #ffffff; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.8);">
                    <div style="width: 7px; height: 7px; background: #000000; border-radius: 50%;"></div>
                </div>
            </div>
        `;

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([FEATURED_LOCATIONS[0].lng, FEATURED_LOCATIONS[0].lat])
            .addTo(exhibitMap);

        markerRef.current = marker;

        exhibitMap.on('load', () => {
            setMapLoaded(true);
            exhibitMap.resize();
        });

        exhibitMapRef.current = exhibitMap;

        const t0 = setTimeout(() => exhibitMap.resize(), 100);
        const t1 = setTimeout(() => exhibitMap.resize(), 400);

        const resize = () => exhibitMap.resize();
        window.addEventListener('resize', resize);

        return () => {
            clearTimeout(t0);
            clearTimeout(t1);
            window.removeEventListener('resize', resize);
            marker.remove();
            exhibitMap.remove();
            exhibitMapRef.current = null;
        };
    }, []);

    // Auto-cycle through locations with camera transitions
    useEffect(() => {
        if (!isAutoPlaying || !mapLoaded) return;

        const interval = setInterval(() => {
            setSelectedLoc((current) => {
                const currentIndex = FEATURED_LOCATIONS.findIndex((l) => l.id === current.id);
                const nextIndex = (currentIndex + 1) % FEATURED_LOCATIONS.length;
                const nextLoc = FEATURED_LOCATIONS[nextIndex];
                syncLocation(nextLoc);
                return nextLoc;
            });
        }, 6000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, mapLoaded]);

    const handleSelectLocation = (loc: HimalayanLocation) => {
        setIsAutoPlaying(false);
        syncLocation(loc);

        if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = setTimeout(() => {
            setIsAutoPlaying(true);
        }, 12000);
    };

    return (
        <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20 text-center overflow-hidden bg-black text-white border-t border-white/[0.08]">
            {/* Real Background Map with Vignette (Atlas Revolution Style) */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div
                    ref={bgMapContainerRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ width: '100%', height: '100%', opacity: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.9)_85%)] pointer-events-none" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header */}
                <div className="max-w-2xl mx-auto mb-14 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/15 bg-white/[0.03] backdrop-blur-md mb-4">
                        <Compass className="w-3.5 h-3.5 text-white/70" />
                        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/75">
                            Alpine Spatial Cartography
                        </span>
                    </div>

                    <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight">
                        Traverse the <span className="italic text-white/90">living terrain.</span>
                    </h2>
                    <p className="font-sans text-sm sm:text-base text-white/60 mt-4 leading-relaxed">
                        Continuous vector mapping and high-altitude contours of our expedition valleys.
                    </p>
                </div>

                {/* Interactive Map Exhibit with Smooth Transitions */}
                <div className="relative mx-auto max-w-4xl border border-white/15 bg-neutral-950 shadow-2xl text-left overflow-hidden">
                    {/* Location Selector Tabs Header */}
                    <div className="px-6 py-4 border-b border-white/[0.08] bg-black/85 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-white/60 font-mono uppercase tracking-wider">
                                Expeditions on map:
                            </span>
                            {isAutoPlaying && (
                                <span className="text-[10px] text-white/60 border border-white/15 px-2 py-0.5 rounded-full flex items-center gap-1.5 bg-white/[0.04] font-mono">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Synchronized flight
                                </span>
                            )}
                        </div>

                        {/* Location Buttons */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            {FEATURED_LOCATIONS.map((loc) => {
                                const isSelected = selectedLoc.id === loc.id;
                                return (
                                    <button
                                        key={loc.id}
                                        onClick={() => handleSelectLocation(loc)}
                                        className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition duration-200 whitespace-nowrap cursor-pointer border ${
                                            isSelected
                                                ? 'bg-white text-black font-medium border-white'
                                                : 'text-white/65 hover:text-white border-white/10 hover:border-white/35 bg-white/[0.02]'
                                        }`}
                                    >
                                        {loc.name.split('&')[0].trim()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dual Panel: Exhibit Details + Real Map */}
                    <div className="grid md:grid-cols-12 min-h-[380px]">
                        {/* Map View */}
                        <div className="md:col-span-7 relative w-full h-[320px] md:h-auto min-h-[320px] bg-neutral-900 overflow-hidden border-b md:border-b-0 md:border-r border-white/[0.08]">
                            <div
                                ref={exhibitMapContainerRef}
                                className="w-full h-full min-h-[320px]"
                                style={{ width: '100%', height: '100%' }}
                            />
                            {!mapLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center text-xs text-white/40 bg-neutral-950">
                                    Initializing cartography…
                                </div>
                            )}
                            <div className="absolute bottom-3 right-3 pointer-events-none bg-black/80 px-2.5 py-1 text-[10px] text-white/60 border border-white/10 font-mono">
                                Live Vector Engine
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-neutral-950">
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <span className="text-[10px] px-2 py-0.5 border border-white/15 text-white/80 bg-white/[0.03] font-mono uppercase tracking-wider">
                                        {selectedLoc.category}
                                    </span>
                                    <span className="text-xs font-mono text-white/50">
                                        {selectedLoc.elevation}
                                    </span>
                                </div>

                                <h3 className="font-display text-2xl sm:text-3xl text-white font-normal leading-tight mb-1">
                                    {selectedLoc.name}
                                </h3>

                                <p className="text-xs text-white/45 mb-5 font-mono">
                                    {selectedLoc.region}, {selectedLoc.state}
                                </p>

                                <p className="font-sans text-sm text-white/65 leading-relaxed font-normal mb-6">
                                    {selectedLoc.description}
                                </p>
                            </div>

                            <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between">
                                <span className="text-[11px] text-white/40 font-mono">
                                    Verified Trajectory
                                </span>

                                <Link
                                    href={`/destinations`}
                                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white hover:text-white/80 transition duration-150 group"
                                >
                                    <span>Explore Routes</span>
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HimalayanMapSection;
