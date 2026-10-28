import React, { useEffect, useState } from 'react';
import { NextSeo } from 'next-seo';
import { Trophy, Medal, Star, TrendingUp, Users, Compass } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';

interface LeaderboardEntry {
    user_id: string;
    display_name: string | null;
    avatar_url: string | null;
    xp_points: number;
    level: 'newcomer' | 'bronze' | 'silver' | 'gold' | 'platinum';
}

function RankIcon({ rank }: { rank: number }) {
    if (rank === 1) return <Trophy className="w-4 h-4 text-white" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-white/70" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-white/50" />;
    return <span className="text-white/40 font-mono text-xs w-5 text-center">{rank}</span>;
}

export default function Community() {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/getLeaderboard')
            .then(r => r.json())
            .then(data => {
                setLeaderboard(data.leaderboard || []);
                setCurrentUserRank(typeof data.currentUserRank === 'number' ? data.currentUserRank : null);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const userRank = user ? currentUserRank : null;

    return (
        <>
            <NextSeo 
                title="Community Leaderboard | Uncharted Travel"
                description="See who's explored the most. Global trekker rankings on Uncharted Travel."
                canonical="https://unchartedtravel.in/community"
            />

            <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6 sm:px-8 border-b border-white/[0.08]">
                <div className="max-w-3xl mx-auto">
                    {/* Hero Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/15 bg-white/[0.03] backdrop-blur-md mb-6">
                            <Compass className="w-3.5 h-3.5 text-white/70" />
                            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/75">
                                Explorer Fellowship &middot; Top 20 Global
                            </span>
                        </div>

                        <h1 className="font-display text-4xl sm:text-6xl font-normal text-white mb-4 tracking-tight">
                            Trekker <span className="italic text-white/90">Leaderboard.</span>
                        </h1>
                        <p className="text-white/60 text-sm sm:text-base max-w-md mx-auto font-sans leading-relaxed">
                            Recognizing dedicated wanderers who tread lightly and embrace high-altitude trails.
                        </p>
                    </div>

                    {/* How to Earn XP Minimal Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="border border-white/10 bg-white/[0.02] p-5 text-center hover:border-white/20 transition-colors">
                            <span className="text-xs font-mono uppercase tracking-widest text-white/40 block mb-1">Pass Crossing</span>
                            <p className="font-display text-xl text-white mb-2">Complete Treks</p>
                            <span className="text-xs font-mono text-white/80 border border-white/15 px-2.5 py-0.5 bg-black/40">
                                +250 XP
                            </span>
                        </div>
                        <div className="border border-white/10 bg-white/[0.02] p-5 text-center hover:border-white/20 transition-colors">
                            <span className="text-xs font-mono uppercase tracking-widest text-white/40 block mb-1">Field Journal</span>
                            <p className="font-display text-xl text-white mb-2">Leave Reviews</p>
                            <span className="text-xs font-mono text-white/80 border border-white/15 px-2.5 py-0.5 bg-black/40">
                                +50 XP
                            </span>
                        </div>
                    </div>

                    {/* Dynamic XP Notice */}
                    <div className="border border-white/10 bg-neutral-950 p-6 mb-8 text-center text-xs font-sans text-white/60 leading-relaxed">
                        <span className="font-mono uppercase tracking-wider text-white block mb-1">
                            Dynamic Alpine XP Engine (In Progress)
                        </span>
                        Rewarding technical passes, harsh climate conditions, altitude gain, and leave-no-trace ethics.
                    </div>

                    {/* Your rank callout */}
                    {user && userRank !== null && userRank > 0 && (
                        <div className="border border-white/25 bg-white/[0.04] p-4 flex items-center gap-3 mb-6">
                            <Star className="w-5 h-5 text-white shrink-0" />
                            <p className="text-sm font-sans text-white">
                                You are currently ranked <span className="font-mono font-bold text-white underline">#{userRank}</span> globally.
                            </p>
                        </div>
                    )}

                    {/* Leaderboard Table */}
                    <div className="border border-white/15 bg-neutral-950 overflow-hidden shadow-2xl">
                        {/* Header row */}
                        <div className="grid grid-cols-[auto_1fr_auto] items-center px-6 py-3.5 border-b border-white/10 text-[11px] font-mono text-white/40 uppercase tracking-widest bg-black/40">
                            <span className="w-10">Rank</span>
                            <span>Explorer</span>
                            <span className="flex items-center gap-1.5">
                                <TrendingUp className="w-3 h-3 text-white/50" /> Altitude XP
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-t border-b border-white" />
                            </div>
                        ) : leaderboard.length === 0 ? (
                            <div className="text-center py-16">
                                <Users className="w-10 h-10 text-white/30 mx-auto mb-3" />
                                <p className="text-white/50 text-xs font-mono uppercase tracking-wider">
                                    No records yet. Step onto the trail to register your inaugural XP.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.06]">
                                {leaderboard.map((entry, idx) => {
                                    const rank = idx + 1;
                                    const isCurrentUser = user?.id === entry.user_id;

                                    return (
                                        <div
                                            key={entry.user_id}
                                            className={`grid grid-cols-[auto_1fr_auto] items-center px-6 py-4 transition-colors ${
                                                isCurrentUser ? 'bg-white/[0.06] border-l-2 border-white' : 'hover:bg-white/[0.02]'
                                            }`}
                                        >
                                            {/* Rank */}
                                            <div className="w-10 flex items-center justify-center">
                                                <RankIcon rank={rank} />
                                            </div>

                                            {/* Avatar + Name */}
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-8 h-8 rounded-none border border-white/20 bg-neutral-900 overflow-hidden shrink-0 flex items-center justify-center text-xs">
                                                    {entry.avatar_url ? (
                                                        <img src={entry.avatar_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-white font-medium">
                                                            {(entry.display_name || 'A').charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`text-sm truncate font-sans ${isCurrentUser ? 'font-medium text-white' : 'text-white/80'}`}>
                                                        {entry.display_name || 'Anonymous Explorer'}
                                                        {isCurrentUser && (
                                                            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 ml-2">
                                                                (You)
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* XP */}
                                            <div className="text-right font-mono text-sm text-white font-medium">
                                                {entry.xp_points.toLocaleString()}
                                                <span className="text-[10px] text-white/40 ml-1">XP</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
