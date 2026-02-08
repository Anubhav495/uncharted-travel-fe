// Community Hub Page - Browse and create trip groups

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import GroupCard from '@/components/community/GroupCard';
import CreateGroupModal from '@/components/community/CreateGroupModal';
import LevelBadge from '@/components/ui/LevelBadge';
import XPProgressBar from '@/components/ui/XPProgressBar';
import { useCommunity } from '@/context/CommunityContext';
import { useAuth } from '@/context/AuthContext';
import { TripGroup, CreateGroupInput } from '@/types/community';
import { getPublicGroups, createGroup, requestToJoinGroup } from '@/services/tripGroupService';
import { treks } from '@/data/treks';
import {
    Users,
    Plus,
    Search,
    Filter,
    Lock,
    Loader2,
    Mountain,
    Calendar,
} from 'lucide-react';
import { LEVEL_NAMES } from '@/lib/levels';

type TabType = 'all' | 'my-groups' | 'pending';

export default function CommunityPage() {
    const { user, loginWithGoogle } = useAuth();
    const {
        profile,
        profileLoading,
        canAccess,
        canJoin,
        canCreate,
        myGroups,
        createdGroups,
        pendingRequests,
        groupsLoading,
        refreshGroups,
    } = useCommunity();

    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [groups, setGroups] = useState<TripGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Filters
    const [searchTrek, setSearchTrek] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    // Fetch public groups
    useEffect(() => {
        const fetchGroups = async () => {
            setLoading(true);
            const fetchedGroups = await getPublicGroups({
                trek_slug: searchTrek || undefined,
                date_from: dateFilter || undefined,
            });
            setGroups(fetchedGroups);
            setLoading(false);
        };

        if (activeTab === 'all') {
            fetchGroups();
        }
    }, [activeTab, searchTrek, dateFilter]);

    const handleCreateGroup = async (input: CreateGroupInput) => {
        if (!profile?.id) return;
        const newGroup = await createGroup(profile.id, input);
        if (newGroup) {
            refreshGroups();
            setShowCreateModal(false);
        }
    };

    const handleJoinGroup = async (groupId: string) => {
        if (!profile?.id) return;
        await requestToJoinGroup(groupId, profile.id);
        refreshGroups();
    };

    const displayedGroups = activeTab === 'all'
        ? groups
        : activeTab === 'my-groups'
            ? [...createdGroups, ...myGroups]
            : [];

    return (
        <>
            <Head>
                <title>Community | UnchartedTravel</title>
                <meta name="description" content="Find travel companions and join group treks with verified travelers." />
            </Head>

            <main className="min-h-screen bg-slate-900">
                {/* Hero Section with Background Image */}
                <section className="relative h-[40vh] min-h-[320px] flex items-center justify-center overflow-hidden">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=1920&q=80')`,
                        }}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900" />

                    <div className="relative z-10 container mx-auto px-4 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 backdrop-blur-sm rounded-full text-yellow-400 text-sm font-medium mb-6">
                            <Users className="w-4 h-4" />
                            Community
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Find Your Travel <span className="text-yellow-400">Companions</span>
                        </h1>
                        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                            Join verified travelers for group adventures. Create or join trip groups for upcoming treks.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar / Profile Card */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-24 space-y-4">
                                {/* User Profile Card */}
                                {user && profile ? (
                                    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden">
                                                {user.user_metadata?.avatar_url ? (
                                                    <img
                                                        src={user.user_metadata.avatar_url}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-lg">
                                                        {user.user_metadata?.full_name?.[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-white truncate">
                                                    {profile.display_name || user.user_metadata?.full_name}
                                                </p>
                                                <LevelBadge level={profile.level} size="sm" />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-400">XP</span>
                                                <span className="text-white font-medium">{profile.xp_points}</span>
                                            </div>
                                            <XPProgressBar xp={profile.xp_points} level={profile.level} showDetails={false} />
                                        </div>

                                        {/* Permissions info */}
                                        {!canAccess && (
                                            <div className="p-3 bg-slate-700/50 rounded-lg text-sm">
                                                <p className="text-slate-300 mb-1">
                                                    <Lock className="w-4 h-4 inline mr-1" />
                                                    Community locked
                                                </p>
                                                <p className="text-slate-400 text-xs">
                                                    Reach Silver level (250 XP) to join groups
                                                </p>
                                            </div>
                                        )}

                                        {canAccess && !canCreate && (
                                            <div className="p-3 bg-slate-700/50 rounded-lg text-sm">
                                                <p className="text-slate-300 mb-1">
                                                    ✓ Can join groups
                                                </p>
                                                <p className="text-slate-400 text-xs">
                                                    Reach Gold level (750 XP) to create groups
                                                </p>
                                            </div>
                                        )}

                                        {canCreate && (
                                            <button
                                                onClick={() => setShowCreateModal(true)}
                                                className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 rounded-lg font-medium text-slate-900 flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <Plus className="w-5 h-5" />
                                                Create Group
                                            </button>
                                        )}
                                    </div>
                                ) : !user ? (
                                    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 text-center">
                                        <Mountain className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                        <p className="text-slate-300 mb-3">
                                            Sign in to join the community
                                        </p>
                                        <button
                                            onClick={() => loginWithGoogle('/community')}
                                            className="w-full py-2.5 bg-white hover:bg-gray-100 rounded-lg font-medium text-slate-900 transition-colors"
                                        >
                                            Sign in with Google
                                        </button>
                                    </div>
                                ) : profileLoading ? (
                                    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                                        <Loader2 className="w-8 h-8 text-slate-500 animate-spin mx-auto" />
                                    </div>
                                ) : (
                                    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 text-center">
                                        <Mountain className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                        <p className="text-slate-300 mb-2">
                                            Welcome to Community!
                                        </p>
                                        <p className="text-slate-500 text-xs">
                                            Start earning XP by completing treks
                                        </p>
                                    </div>
                                )}

                                {/* Level Guide */}
                                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                                    <h3 className="font-medium text-white mb-3">Level Perks</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2 text-slate-400">
                                            <LevelBadge level="silver" size="sm" showLabel={false} />
                                            <span>Silver: Join groups</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-slate-400">
                                            <LevelBadge level="gold" size="sm" showLabel={false} />
                                            <span>Gold: Create groups</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-slate-400">
                                            <LevelBadge level="platinum" size="sm" showLabel={false} />
                                            <span>Platinum: Private groups</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {/* Tabs & Filters */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                {/* Tabs */}
                                <div className="flex bg-slate-800 rounded-lg p-1">
                                    <button
                                        onClick={() => setActiveTab('all')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'all'
                                            ? 'bg-slate-700 text-white'
                                            : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        All Groups
                                    </button>
                                    {user && (
                                        <>
                                            <button
                                                onClick={() => setActiveTab('my-groups')}
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'my-groups'
                                                    ? 'bg-slate-700 text-white'
                                                    : 'text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                My Groups
                                            </button>
                                            {pendingRequests.length > 0 && (
                                                <button
                                                    onClick={() => setActiveTab('pending')}
                                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${activeTab === 'pending'
                                                        ? 'bg-slate-700 text-white'
                                                        : 'text-slate-400 hover:text-white'
                                                        }`}
                                                >
                                                    Requests
                                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-slate-900 text-xs rounded-full flex items-center justify-center">
                                                        {pendingRequests.length}
                                                    </span>
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Filters */}
                                {activeTab === 'all' && (
                                    <div className="flex gap-2">
                                        <select
                                            value={searchTrek}
                                            onChange={e => setSearchTrek(e.target.value)}
                                            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-yellow-500 outline-none"
                                        >
                                            <option value="">All Treks</option>
                                            {treks.map(trek => (
                                                <option key={trek.slug} value={trek.slug}>
                                                    {trek.title}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="date"
                                            value={dateFilter}
                                            onChange={e => setDateFilter(e.target.value)}
                                            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-yellow-500 outline-none"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Groups Grid */}
                            {loading || groupsLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                                </div>
                            ) : displayedGroups.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {displayedGroups.map(group => (
                                        <GroupCard
                                            key={group.id}
                                            group={group}
                                            showJoinButton={canJoin && activeTab === 'all'}
                                            onJoinClick={() => handleJoinGroup(group.id)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <Users className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                                    <h3 className="text-xl font-medium text-white mb-2">
                                        {activeTab === 'all' ? 'No groups found' : 'No groups yet'}
                                    </h3>
                                    <p className="text-slate-400 mb-6">
                                        {activeTab === 'all'
                                            ? 'Try adjusting your filters or create a new group'
                                            : 'Join or create a group to get started'}
                                    </p>
                                    {canCreate && (
                                        <button
                                            onClick={() => setShowCreateModal(true)}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 rounded-lg font-medium text-slate-900 transition-colors"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Create a Group
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Pending Requests Tab */}
                            {activeTab === 'pending' && pendingRequests.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-white">
                                        Pending Join Requests ({pendingRequests.length})
                                    </h3>
                                    {/* TODO: Add JoinRequestCard component */}
                                    <p className="text-slate-400">
                                        Join request management coming soon...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Create Group Modal */}
            <CreateGroupModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateGroup}
            />
        </>
    );
}
