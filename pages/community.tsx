import React, { useEffect, useState, useMemo } from 'react';
import { NextSeo } from 'next-seo';
import { Trophy, Medal, Star, TrendingUp, Search } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';
import { SEEDED_LEADERBOARD, LeaderboardEntry } from './api/getLeaderboard';
import Link from 'next/link';

function getTierBadge(level: string) {
    switch (level) {
        case 'platinum':
            return {
                label: 'Platinum',
                className: 'border-cyan-400/30 text-cyan-300 bg-cyan-400/10',
            };
        case 'gold':
            return {
                label: 'Gold',
                className: 'border-amber-400/30 text-amber-300 bg-amber-400/10',
            };
        case 'silver':
            return {
                label: 'Silver',
                className: 'border-white/25 text-white/80 bg-white/[0.05]',
            };
        case 'bronze':
            return {
                label: 'Bronze',
                className: 'border-orange-500/30 text-orange-400 bg-orange-500/10',
            };
        default:
            return {
                label: 'Newcomer',
                className: 'border-white/10 text-white/40 bg-white/[0.02]',
            };
    }
}

export default function Community() {
    const { user } = useAuth();
    // Pre-populate with SEEDED_LEADERBOARD so all explorers are visible immediately on load
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(SEEDED_LEADERBOARD);
    const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('/api/getLeaderboard')
            .then(r => r.json())
            .then(data => {
                if (data.leaderboard && data.leaderboard.length > 0) {
                    setLeaderboard(data.leaderboard);
                }
                setCurrentUserRank(typeof data.currentUserRank === 'number' ? data.currentUserRank : null);
            })
            .catch(console.error);
    }, []);

    const userRank = user ? currentUserRank : null;

    // Filtered list based on search query
    const filteredLeaderboard = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return leaderboard;
        return leaderboard.filter(entry =>
            (entry.display_name || 'Anonymous Trekker').toLowerCase().includes(query)
        );
    }, [leaderboard, searchQuery]);

    // Top 3 for the spotlight feature
    const topThree = leaderboard.slice(0, 3);

    return (
        <>
            <NextSeo 
                title="Community Leaderboard | Uncharted Travel"
                description="Recognizing dedicated trekkers across the Himalayas. Live expedition rankings on Uncharted Travel."
                canonical="https://unchartedtravel.in/community"
            />

            <main className="min-h-screen bg-black text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] relative">
                {/* Subtle Ambient Topo Grid */}
                <div 
                    className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" 
                    aria-hidden="true"
                />

                <div className="max-w-4xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-block border border-white/15 px-3 py-1 bg-white/[0.03] text-[10px] font-sans uppercase tracking-widest text-white/60 mb-4">
                            Alpine Community &middot; Global Standings
                        </div>
                        <h1 className="font-display text-4xl sm:text-6xl font-normal text-white mb-4 tracking-tight">
                            Trekker <span className="italic text-white/90">Leaderboard</span>
                        </h1>
                        <p className="text-white/60 text-xs sm:text-sm max-w-lg mx-auto font-sans leading-relaxed">
                            Honoring explorers who navigate raw ridgelines with verified native guides across Himachal and Uttarakhand.
                        </p>
                    </div>

                    {/* How XP Works - Clean Architectural Bar (NO MONO FONT) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
                        <div className="border border-white/10 bg-neutral-950 p-4 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-sans uppercase tracking-widest text-white/40 block">Complete Trek</span>
                                <span className="font-display text-base text-white">Full Expedition</span>
                            </div>
                            <span className="font-sans text-xs font-semibold text-amber-400 border border-amber-400/30 bg-amber-400/10 px-2.5 py-1">
                                +250 XP
                            </span>
                        </div>

                        <div className="border border-white/10 bg-neutral-950 p-4 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-sans uppercase tracking-widest text-white/40 block">Submit Review</span>
                                <span className="font-display text-base text-white">Verified Feedback</span>
                            </div>
                            <span className="font-sans text-xs font-semibold text-amber-400 border border-amber-400/30 bg-amber-400/10 px-2.5 py-1">
                                +50 XP
                            </span>
                        </div>

                        <div className="border border-white/10 bg-neutral-950 p-4 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-sans uppercase tracking-widest text-white/40 block">High Altitude</span>
                                <span className="font-display text-base text-white">Pass Crossing</span>
                            </div>
                            <span className="font-sans text-xs font-semibold text-emerald-400 border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1">
                                +100 XP
                            </span>
                        </div>
                    </div>

                    {/* Current User Standing Banner */}
                    {user && userRank !== null && userRank > 0 && (
                        <div className="border border-white/20 bg-neutral-950 p-4 sm:p-5 flex items-center justify-between mb-8 shadow-xl">
                            <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 border border-white/20 bg-white/[0.04] flex items-center justify-center shrink-0">
                                    <Star className="w-5 h-5 text-amber-400" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-sans uppercase tracking-widest text-white/40 block">Your Standing</span>
                                    <p className="text-sm font-sans text-white">
                                        Ranked <span className="font-bold text-white">#{userRank}</span> globally out of {leaderboard.length} explorers
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/dashboard"
                                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider text-white/70 hover:text-white border-b border-white/20 hover:border-white pb-0.5 transition-colors"
                            >
                                <span>View Dashboard</span>
                            </Link>
                        </div>
                    )}

                    {/* Top 3 Spotlight Podium */}
                    {topThree.length === 3 && !searchQuery && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-10">
                            {/* Rank 2 - Silver */}
                            <div className="order-2 sm:order-1 border border-white/15 bg-neutral-950/80 p-5 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider text-white/70 font-medium">
                                        <Medal className="w-4 h-4 text-white/70" /> #2
                                    </span>
                                    <span className="text-[10px] uppercase font-sans px-2 py-0.5 border border-white/15 bg-white/[0.03] text-white/60">
                                        Silver
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-display text-xl text-white font-normal truncate">
                                        {topThree[1].display_name}
                                    </h3>
                                    <p className="font-sans text-sm text-white/60 mt-1 font-medium">
                                        {topThree[1].xp_points.toLocaleString()} <span className="text-xs text-white/40 font-normal">XP</span>
                                    </p>
                                </div>
                            </div>

                            {/* Rank 1 - Gold */}
                            <div className="order-1 sm:order-2 border border-amber-400/35 bg-neutral-950 p-6 flex flex-col justify-between shadow-2xl relative">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/[0.04] rounded-bl-full pointer-events-none" />
                                <div className="flex items-center justify-between mb-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-widest text-amber-300 font-semibold">
                                        <Trophy className="w-4 h-4 text-amber-400" /> #1 Leader
                                    </span>
                                    <span className="text-[10px] uppercase font-sans px-2.5 py-0.5 border border-amber-400/40 bg-amber-400/10 text-amber-300 font-medium">
                                        Gold
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-display text-2xl text-white font-normal truncate">
                                        {topThree[0].display_name}
                                    </h3>
                                    <p className="font-sans text-base text-amber-300 mt-1 font-semibold">
                                        {topThree[0].xp_points.toLocaleString()} <span className="text-xs text-amber-400/60 font-normal">XP</span>
                                    </p>
                                </div>
                            </div>

                            {/* Rank 3 - Bronze */}
                            <div className="order-3 border border-white/15 bg-neutral-950/80 p-5 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider text-orange-400 font-medium">
                                        <Medal className="w-4 h-4 text-orange-400" /> #3
                                    </span>
                                    <span className="text-[10px] uppercase font-sans px-2 py-0.5 border border-orange-500/30 bg-orange-500/10 text-orange-400">
                                        Bronze
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-display text-xl text-white font-normal truncate">
                                        {topThree[2].display_name}
                                    </h3>
                                    <p className="font-sans text-sm text-white/60 mt-1 font-medium">
                                        {topThree[2].xp_points.toLocaleString()} <span className="text-xs text-white/40 font-normal">XP</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Table Controls: Search Bar & Count */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search explorer by name..."
                                className="w-full bg-neutral-950 border border-white/15 pl-10 pr-4 py-2.5 text-xs font-sans text-white placeholder-white/35 outline-none focus:border-white/40 transition-colors"
                            />
                        </div>
                        <div className="text-xs font-sans uppercase tracking-wider text-white/50">
                            {filteredLeaderboard.length} Ranked Explorer{filteredLeaderboard.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Professional Scrollable Leaderboard Table (ALL loaded, smooth scroll) */}
                    <div className="border border-white/15 bg-neutral-950 shadow-2xl overflow-hidden">
                        {/* Sticky Table Header */}
                        <div className="grid grid-cols-[3.5rem_1fr_6rem_5.5rem] sm:grid-cols-[4.5rem_1fr_8rem_7rem] items-center px-4 sm:px-6 py-3.5 border-b border-white/10 text-[10px] sm:text-xs font-sans text-white/45 uppercase tracking-widest bg-black/70 font-medium">
                            <span className="text-center">Rank</span>
                            <span>Explorer</span>
                            <span className="text-center">Tier</span>
                            <span className="text-right flex items-center justify-end gap-1">
                                <TrendingUp className="w-3 h-3 text-white/40" /> Score
                            </span>
                        </div>

                        {/* Scrollable Rows Container (All explorers loaded right away) */}
                        <div className="max-h-[640px] overflow-y-auto divide-y divide-white/[0.06] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                            {filteredLeaderboard.length === 0 ? (
                                <div className="text-center py-16 px-6">
                                    <p className="text-white/40 text-xs font-sans">
                                        No trekker found matching &ldquo;{searchQuery}&rdquo;
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
                                                    ? 'bg-amber-400/[0.08] border-l-2 border-amber-400'
                                                    : 'hover:bg-white/[0.03]'
                                            }`}
                                        >
                                            {/* Rank Position */}
                                            <div className="flex items-center justify-center font-sans text-xs">
                                                {rank === 1 ? (
                                                    <span className="w-6 h-6 flex items-center justify-center border border-amber-400/40 bg-amber-400/10 text-amber-300 font-bold text-xs">
                                                        1
                                                    </span>
                                                ) : rank === 2 ? (
                                                    <span className="w-6 h-6 flex items-center justify-center border border-white/30 bg-white/10 text-white font-bold text-xs">
                                                        2
                                                    </span>
                                                ) : rank === 3 ? (
                                                    <span className="w-6 h-6 flex items-center justify-center border border-orange-500/30 bg-orange-500/10 text-orange-400 font-bold text-xs">
                                                        3
                                                    </span>
                                                ) : (
                                                    <span className="text-white/40 font-medium">
                                                        #{rank}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Explorer Profile */}
                                            <div className="flex items-center gap-3 min-w-0 pr-2">
                                                <div className="w-7 h-7 sm:w-8 sm:h-8 border border-white/15 bg-neutral-900 shrink-0 flex items-center justify-center text-xs font-sans text-white/80 overflow-hidden shadow font-medium">
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
                                                        <span className={`text-xs sm:text-sm truncate font-sans ${isCurrentUser ? 'font-medium text-white' : 'text-white/90'}`}>
                                                            {entry.display_name || 'Anonymous Trekker'}
                                                        </span>
                                                        {isCurrentUser && (
                                                            <span className="text-[10px] font-sans uppercase tracking-wider text-amber-300 border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 shrink-0 font-medium">
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
                                                <span className="text-[10px] text-white/40 ml-1 font-normal">XP</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Footer Explanatory Note */}
                    <div className="mt-8 text-center">
                        <p className="text-[11px] font-sans text-white/40 leading-relaxed max-w-md mx-auto">
                            Points calculate automatically upon completion of verified guide treks and published traveler reviews. Refreshed continuously.
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}
