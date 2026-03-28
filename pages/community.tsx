import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Trophy, Medal, Star, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';

interface LeaderboardEntry {
    user_id: string;
    display_name: string | null;
    avatar_url: string | null;
    xp_points: number;
    level: 'newcomer' | 'bronze' | 'silver' | 'gold' | 'platinum';
}

const LEVEL_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
    platinum: { label: 'Platinum', color: 'text-cyan-300', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' },
    gold:     { label: 'Gold',     color: 'text-yellow-300', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
    silver:   { label: 'Silver',   color: 'text-slate-300', bg: 'bg-slate-400/10', border: 'border-slate-400/30' },
    bronze:   { label: 'Bronze',   color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
    newcomer: { label: 'Newcomer', color: 'text-slate-500', bg: 'bg-slate-700/30', border: 'border-slate-600/30' },
};

const RANK_STYLES: Record<number, string> = {
    1: 'text-yellow-400',
    2: 'text-slate-300',
    3: 'text-orange-400',
};

function RankIcon({ rank }: { rank: number }) {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />;
    return <span className="text-slate-500 font-bold text-sm w-5 text-center">{rank}</span>;
}

export default function Community() {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/getLeaderboard')
            .then(r => r.json())
            .then(data => setLeaderboard(data.leaderboard || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const userRank = user
        ? leaderboard.findIndex(e => e.user_id === user.id) + 1
        : null;

    return (
        <>
            <Head>
                <title>Community Leaderboard | Uncharted Travel</title>
                <meta name="description" content="See who's explored the most. Global trekker rankings on Uncharted Travel." />
            </Head>

            <main className="min-h-screen bg-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">

                    {/* Hero */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
                            Trekker <span className="text-yellow-400">Leaderboard</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-md mx-auto">
                            Earn XP by completing treks. Climb the ranks from Newcomer to Platinum.
                            <span className="block mt-2 text-sm text-yellow-400/80 font-medium tracking-wide">Showing Top 20 Trekkers Globally</span>
                        </p>
                    </div>

                    {/* How to Earn XP Guide */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 text-center flex flex-col items-center justify-center transition-all hover:bg-slate-800/50 hover:border-slate-600">
                            <span className="text-3xl mb-3 block">🏔️</span>
                            <p className="text-sm font-semibold text-slate-200">Complete Treks</p>
                            <p className="text-xs text-yellow-400 font-bold mt-1.5 px-3 py-1 bg-yellow-400/10 rounded-full border border-yellow-400/20">+250 XP</p>
                        </div>
                        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 text-center flex flex-col items-center justify-center transition-all hover:bg-slate-800/50 hover:border-slate-600">
                            <span className="text-3xl mb-3 block">⭐</span>
                            <p className="text-sm font-semibold text-slate-200">Leave Reviews</p>
                            <p className="text-xs text-yellow-400 font-bold mt-1.5 px-3 py-1 bg-yellow-400/10 rounded-full border border-yellow-400/20">+50 XP</p>
                        </div>
                    </div>

                    <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-5 mb-10 text-center flex flex-col gap-4">
                        <p className="text-sm text-sky-200 leading-relaxed max-w-2xl mx-auto">
                            <span className="font-bold text-sky-400 block mb-1">🏔️ Dynamic XP Model</span>
                            We are actively developing a dynamic XP reward model. Soon, your XP will be awarded based on specific trek parameters including technicality, harsh weather conditions, and overall difficulty!
                        </p>
                        <div className="w-16 h-px bg-sky-500/30 mx-auto"></div>
                        <p className="text-sm text-sky-200 leading-relaxed max-w-2xl mx-auto">
                            <span className="font-bold text-sky-400 block mb-1">🎁 Rank-Based Rewards</span>
                            We will also be introducing exclusive rewards and perks for our top-ranked trekkers. Keep climbing the leaderboard to unlock them!
                        </p>
                    </div>

                    {/* Your rank callout */}
                    {user && userRank && userRank > 0 && (
                        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-4 flex items-center gap-4 mb-6">
                            <Star className="w-6 h-6 text-yellow-400 shrink-0" />
                            <p className="text-yellow-300 font-semibold">
                                You are currently ranked <span className="text-yellow-400 font-black">#{userRank}</span> globally!
                            </p>
                        </div>
                    )}

                    {/* Leaderboard Table */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">

                        {/* Header row */}
                        <div className="grid grid-cols-[auto_1fr_auto] items-center px-6 py-3 border-b border-slate-700 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <span className="w-10">Rank</span>
                            <span>Trekker</span>
                            <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> XP
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-400" />
                            </div>
                        ) : leaderboard.length === 0 ? (
                            <div className="text-center py-16">
                                <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400 font-medium">No trekkers yet. Be the first to earn XP!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-700/50">
                                {leaderboard.map((entry, idx) => {
                                    const rank = idx + 1;
                                    const isCurrentUser = user?.id === entry.user_id;

                                    return (
                                        <div
                                            key={entry.user_id}
                                            className={`grid grid-cols-[auto_1fr_auto] items-center px-6 py-4 transition-colors ${isCurrentUser ? 'bg-yellow-400/5 border-l-2 border-yellow-400' : 'hover:bg-slate-800/60'}`}
                                        >
                                            {/* Rank */}
                                            <div className="w-10 flex items-center justify-center">
                                                <RankIcon rank={rank} />
                                            </div>

                                            {/* Avatar + Name + Level */}
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center border border-slate-600">
                                                    {entry.avatar_url ? (
                                                        <img src={entry.avatar_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-white font-bold text-sm">
                                                            {(entry.display_name || 'A').charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`font-bold truncate ${isCurrentUser ? 'text-yellow-400' : 'text-white'}`}>
                                                        {entry.display_name || 'Anonymous Trekker'}
                                                        {isCurrentUser && <span className="text-xs font-normal text-yellow-500 ml-2">You</span>}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* XP */}
                                            <div className={`text-right font-black text-lg ${RANK_STYLES[rank] || 'text-slate-300'}`}>
                                                {entry.xp_points.toLocaleString()}
                                                <span className="text-xs font-normal text-slate-500 ml-1">XP</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* How to earn XP */}
                    <div className="mt-10 bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            How to earn XP
                        </h3>
                        <div className="space-y-3">
                            {[
                            { action: 'Completing a trek', xp: '+250 XP' },
                                { action: 'Leaving a review', xp: '+50 XP' },
                            ].map(item => (
                                <div key={item.action} className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">{item.action}</span>
                                    <span className="text-yellow-400 font-bold">{item.xp}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

        </>
    );
}
