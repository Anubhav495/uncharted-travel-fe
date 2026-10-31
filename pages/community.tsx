import React, { useEffect, useState, useMemo } from 'react';
import { NextSeo } from 'next-seo';
import { Star, TrendingUp, Search, Gift, Compass } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';
import { LeaderboardEntry } from './api/getLeaderboard';
import Link from 'next/link';

function getTierBadge(level: string) {
    switch (level) {
        case 'platinum':
            return {
                label: 'Platinum',
                className: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
            };
        case 'gold':
            return {
                label: 'Gold',
                className: 'border-yellow-400/30 text-yellow-400 bg-yellow-400/10',
            };
        case 'silver':
            return {
                label: 'Silver',
                className: 'border-slate-500/30 text-slate-300 bg-slate-700/50',
            };
        case 'bronze':
            return {
                label: 'Bronze',
                className: 'border-amber-600/30 text-amber-500 bg-amber-600/10',
            };
        default:
            return {
                label: 'Newcomer',
                className: 'border-slate-700 text-slate-400 bg-slate-800/50',
            };
    }
}

export default function Community() {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('/api/getLeaderboard')
            .then(r => r.json())
            .then(data => {
                setLeaderboard(Array.isArray(data.leaderboard) ? data.leaderboard : []);
                setCurrentUserRank(typeof data.currentUserRank === 'number' ? data.currentUserRank : null);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const userRank = user ? currentUserRank : null;

    // Filtered list based on search query (showing top 20 or matching search)
    const filteredLeaderboard = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return leaderboard.slice(0, 20);
        return leaderboard.filter(entry =>
            (entry.display_name || 'Anonymous Trekker').toLowerCase().includes(query)
        );
    }, [leaderboard, searchQuery]);

    return (
        <>
            <NextSeo 
                title="Community Leaderboard | Uncharted Travel"
                description="Recognizing dedicated trekkers across the Himalayas. Live expedition rankings on Uncharted Travel."
                canonical="https://unchartedtravel.in/community"
            />

            <main className="min-h-screen bg-slate-900 text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative">
                {/* Subtle Ambient Topo Grid */}
                <div 
                    className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" 
                    aria-hidden="true"
                />

                <div className="max-w-4xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-block border border-yellow-400/30 px-3 py-1 bg-yellow-400/10 text-[10px] font-sans uppercase tracking-widest text-yellow-400 mb-4 font-semibold">
                            Showing Top 20 Trekkers Globally
                        </div>
                        <h1 className="font-display text-4xl sm:text-6xl font-normal text-white mb-4 tracking-tight">
                            Trekker <span className="italic text-yellow-400">Leaderboard</span>
                        </h1>
                        <p className="text-slate-200 text-sm sm:text-base max-w-lg mx-auto font-sans leading-relaxed mb-2 font-medium">
                            Earn XP by completing treks and sharing your adventures.
                        </p>
                        <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto font-sans leading-relaxed">
                            <span className="text-slate-300 font-semibold">Why a leaderboard?</span> The core idea is to reward dedicated trekkers and adventurists.
                        </p>
                    </div>

                    {/* How XP Works - Clean Architectural Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
                        <div className="border border-slate-700/60 bg-slate-800/60 p-4 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-sans uppercase tracking-widest text-slate-400 block">Complete Trek</span>
                                <span className="font-display text-base text-white">Full Expedition</span>
                            </div>
                            <span className="font-sans text-xs font-semibold text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 px-2.5 py-1">
                                +250 XP
                            </span>
                        </div>

                        <div className="border border-slate-700/60 bg-slate-800/60 p-4 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-sans uppercase tracking-widest text-slate-400 block">Submit Review</span>
                                <span className="font-display text-base text-white">Verified Feedback</span>
                            </div>
                            <span className="font-sans text-xs font-semibold text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 px-2.5 py-1">
                                +50 XP
                            </span>
                        </div>

                        <div className="border border-slate-700/60 bg-slate-800/60 p-4 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-sans uppercase tracking-widest text-slate-400 block">High Altitude</span>
                                <span className="font-display text-base text-white">Pass Crossing</span>
                            </div>
                            <span className="font-sans text-xs font-semibold text-emerald-400 border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1">
                                +100 XP
                            </span>
                        </div>
                    </div>

                    {/* Current User Standing Banner */}
                    {user && userRank !== null && userRank > 0 && (
                        <div className="border border-yellow-400/30 bg-yellow-400/10 p-4 sm:p-5 flex items-center justify-between mb-8 shadow-xl">
                            <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 border border-yellow-400/30 bg-yellow-400/10 flex items-center justify-center shrink-0">
                                    <Star className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-sans uppercase tracking-widest text-yellow-400/80 block font-semibold">Your Standing</span>
                                    <p className="text-sm font-sans text-slate-200">
                                        Ranked <span className="font-bold text-yellow-400">#{userRank}</span> globally out of {leaderboard.length} explorers
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/dashboard"
                                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider text-yellow-400 hover:text-yellow-300 border-b border-yellow-400/30 hover:border-yellow-400 pb-0.5 transition-colors font-semibold"
                            >
                                <span>View Dashboard</span>
                            </Link>
                        </div>
                    )}

                    {/* Table Controls: Search Bar & Count */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search explorer by name..."
                                className="w-full bg-slate-800/60 border border-slate-700 pl-10 pr-4 py-2.5 text-xs font-sans text-white placeholder-slate-400 outline-none focus:border-yellow-400/50 transition-colors"
                            />
                        </div>
                        <div className="text-xs font-sans uppercase tracking-wider text-slate-400">
                            {filteredLeaderboard.length} Ranked Explorer{filteredLeaderboard.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Professional Scrollable Leaderboard Table (ALL loaded, smooth scroll) */}
                    <div className="border border-slate-700 bg-slate-800/70 shadow-2xl overflow-hidden">
                        {/* Sticky Table Header */}
                        <div className="grid grid-cols-[3.5rem_1fr_6rem_5.5rem] sm:grid-cols-[4.5rem_1fr_8rem_7rem] items-center px-4 sm:px-6 py-3.5 border-b border-slate-700 text-[10px] sm:text-xs font-sans text-slate-400 uppercase tracking-widest bg-slate-900/90 font-semibold">
                            <span className="text-center">Rank</span>
                            <span>Explorer</span>
                            <span className="text-center">Tier</span>
                            <span className="text-right flex items-center justify-end gap-1">
                                <TrendingUp className="w-3 h-3 text-slate-400" /> Score
                            </span>
                        </div>

                        {/* Scrollable Rows Container */}
                        <div className="max-h-[640px] overflow-y-auto divide-y divide-slate-700/50 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            {loading ? (
                                <div className="py-12 px-6 space-y-3">
                                    {[1, 2, 3, 4, 5].map((skeleton) => (
                                        <div key={skeleton} className="h-10 bg-slate-800/60 animate-pulse rounded-lg" />
                                    ))}
                                </div>
                            ) : filteredLeaderboard.length === 0 ? (
                                <div className="text-center py-16 px-6">
                                    <p className="text-slate-300 text-sm font-medium">
                                        {searchQuery ? `No explorer found matching "${searchQuery}"` : 'No ranked explorers yet.'}
                                    </p>
                                    <p className="text-slate-400 text-xs mt-1.5 max-w-sm mx-auto">
                                        {searchQuery ? 'Try searching by a different name.' : 'Trekkers will appear here automatically as real treks and XP are recorded.'}
                                    </p>
                                </div>
                            ) : (
                                filteredLeaderboard.map((entry, idx) => {
                                    const rank = idx + 1;
                                    const isCurrentUser = user?.id === entry.user_id;
                                    const tier = getTierBadge(entry.level);

                                    return (
                                        <div
                                            key={entry.user_id}
                                            className={`grid grid-cols-[3.5rem_1fr_6rem_5.5rem] sm:grid-cols-[4.5rem_1fr_8rem_7rem] items-center px-4 sm:px-6 py-3.5 transition-colors ${
                                                isCurrentUser
                                                    ? 'bg-yellow-400/10 border-l-2 border-yellow-400'
                                                    : 'hover:bg-slate-800/70'
                                            }`}
                                        >
                                            {/* Rank Position */}
                                            <div className="flex items-center justify-center font-sans text-xs">
                                                {rank === 1 ? (
                                                    <span className="w-6 h-6 flex items-center justify-center border border-yellow-400/40 bg-yellow-400/10 text-yellow-400 font-bold text-xs">
                                                        1
                                                    </span>
                                                ) : rank === 2 ? (
                                                    <span className="w-6 h-6 flex items-center justify-center border border-slate-500/40 bg-slate-700 text-slate-200 font-bold text-xs">
                                                        2
                                                    </span>
                                                ) : rank === 3 ? (
                                                    <span className="w-6 h-6 flex items-center justify-center border border-amber-600/40 bg-amber-600/10 text-amber-500 font-bold text-xs">
                                                        3
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 font-medium">
                                                        #{rank}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Explorer Profile */}
                                            <div className="flex items-center gap-3 min-w-0 pr-2">
                                                <div className="w-7 h-7 sm:w-8 sm:h-8 border border-slate-700 bg-slate-800 shrink-0 flex items-center justify-center text-xs font-sans text-slate-200 overflow-hidden shadow font-medium">
                                                    {entry.avatar_url ? (
                                                        <img src={entry.avatar_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span>
                                                             {(entry.display_name || 'A').charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs sm:text-sm truncate font-sans ${isCurrentUser ? 'font-bold text-yellow-400' : 'text-slate-200'}`}>
                                                            {entry.display_name || 'Anonymous Trekker'}
                                                        </span>
                                                        {isCurrentUser && (
                                                            <span className="text-[10px] font-sans uppercase tracking-wider text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 px-1.5 py-0.5 shrink-0 font-medium">
                                                                You
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tier Badge */}
                                            <div className="text-center">
                                                <span className={`inline-block px-2 py-0.5 text-[9px] sm:text-[10px] font-sans uppercase tracking-wider border font-medium ${tier.className}`}>
                                                    {tier.label}
                                                </span>
                                            </div>

                                            {/* Score */}
                                            <div className="text-right font-sans text-xs sm:text-sm text-white font-medium">
                                                {entry.xp_points.toLocaleString()}
                                                <span className="text-[10px] text-slate-400 ml-1 font-normal">XP</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Upcoming Features / System Roadmap */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="border border-slate-700/70 bg-slate-800/70 p-5 relative overflow-hidden transition-colors hover:border-slate-600">
                            <div className="flex items-center gap-2 mb-2.5">
                                <span className="inline-block px-2 py-0.5 text-[9px] font-sans uppercase tracking-widest text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 font-semibold">
                                    Roadmap &middot; In Development
                                </span>
                            </div>
                            <h3 className="font-display text-lg text-white mb-2 flex items-center gap-2">
                                <Compass className="w-4 h-4 text-yellow-400 shrink-0" />
                                Dynamic XP Model
                            </h3>
                            <p className="text-slate-300 text-xs font-sans leading-relaxed">
                                We are actively developing a dynamic XP reward model. Soon, your XP will be awarded based on specific trek parameters including technicality, harsh weather conditions, and overall difficulty!
                            </p>
                        </div>

                        <div className="border border-slate-700/70 bg-slate-800/70 p-5 relative overflow-hidden transition-colors hover:border-slate-600">
                            <div className="flex items-center gap-2 mb-2.5">
                                <span className="inline-block px-2 py-0.5 text-[9px] font-sans uppercase tracking-widest text-sky-400 border border-sky-400/30 bg-sky-400/10 font-semibold">
                                    Upcoming Perks
                                </span>
                            </div>
                            <h3 className="font-display text-lg text-white mb-2 flex items-center gap-2">
                                <Gift className="w-4 h-4 text-sky-400 shrink-0" />
                                Rank-Based Rewards
                            </h3>
                            <p className="text-slate-300 text-xs font-sans leading-relaxed">
                                We will also be introducing exclusive rewards and perks for our top-ranked trekkers. Keep climbing the leaderboard to unlock them!
                            </p>
                        </div>
                    </div>

                    {/* Footer Explanatory Note */}
                    <div className="mt-8 text-center">
                        <p className="text-[11px] font-sans text-slate-500 leading-relaxed max-w-md mx-auto">
                            Points calculate automatically upon completion of verified guide treks and published traveler reviews. Refreshed continuously.
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}
