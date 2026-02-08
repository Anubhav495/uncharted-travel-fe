// Group Detail Page - View group info, members, and manage join requests

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LevelBadge from '@/components/ui/LevelBadge';
import { useCommunity } from '@/context/CommunityContext';
import { TripGroup, GroupMembership } from '@/types/community';
import {
    getGroupById,
    requestToJoinGroup,
    approveJoinRequest,
    rejectJoinRequest,
    leaveGroup,
    updateGroupStatus,
} from '@/services/tripGroupService';
import { treks } from '@/data/treks';
import {
    ArrowLeft,
    Calendar,
    Users,
    MapPin,
    Lock,
    Globe,
    CheckCircle,
    XCircle,
    Loader2,
    Copy,
    Check,
    MessageCircle,
    Settings,
    UserPlus,
    LogOut,
} from 'lucide-react';

export default function GroupDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const { profile, canJoin, refreshGroups, awardXP } = useCommunity();

    const [group, setGroup] = useState<TripGroup | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const isCreator = profile && group?.creator_id === profile.id;
    const isMember = group?.members?.some(
        m => m.user_profile_id === profile?.id && m.status === 'approved'
    );
    const hasPendingRequest = group?.members?.some(
        m => m.user_profile_id === profile?.id && m.status === 'pending'
    );

    const trek = group ? treks.find(t => t.slug === group.trek_slug) : null;

    useEffect(() => {
        const fetchGroup = async () => {
            if (!id) return;
            setLoading(true);
            const fetchedGroup = await getGroupById(id as string);
            setGroup(fetchedGroup);
            setLoading(false);
        };

        fetchGroup();
    }, [id]);

    const handleJoinRequest = async () => {
        if (!profile?.id || !group?.id) return;
        setActionLoading('join');
        await requestToJoinGroup(group.id, profile.id);
        const updated = await getGroupById(group.id);
        setGroup(updated);
        setActionLoading(null);
    };

    const handleApprove = async (membershipId: string) => {
        if (!profile?.id) return;
        setActionLoading(membershipId);
        await approveJoinRequest(membershipId, profile.id);
        const updated = await getGroupById(group!.id);
        setGroup(updated);
        refreshGroups();
        setActionLoading(null);
    };

    const handleReject = async (membershipId: string) => {
        if (!profile?.id) return;
        setActionLoading(membershipId);
        await rejectJoinRequest(membershipId, profile.id);
        const updated = await getGroupById(group!.id);
        setGroup(updated);
        setActionLoading(null);
    };

    const handleLeave = async () => {
        if (!profile?.id || !group?.id) return;
        if (!confirm('Are you sure you want to leave this group?')) return;
        setActionLoading('leave');
        await leaveGroup(group.id, profile.id);
        refreshGroups();
        router.push('/community');
    };

    const copyInviteCode = () => {
        if (group?.invite_code) {
            navigator.clipboard.writeText(group.invite_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formattedDate = group?.planned_date
        ? new Date(group.planned_date).toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : '';

    const approvedMembers = group?.members?.filter(m => m.status === 'approved') || [];
    const pendingMembers = group?.members?.filter(m => m.status === 'pending') || [];

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-slate-900 pt-20 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
                </main>
            </>
        );
    }

    if (!group) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-slate-900 pt-20">
                    <div className="container mx-auto px-4 py-20 text-center">
                        <h1 className="text-2xl font-bold text-white mb-4">Group Not Found</h1>
                        <p className="text-slate-400 mb-6">This group may have been deleted or doesn't exist.</p>
                        <Link href="/community" className="text-yellow-400 hover:text-yellow-300">
                            ← Back to Community
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{group.title} | Community | UnchartedTravel</title>
            </Head>

            <Header />

            <main className="min-h-screen bg-slate-900 pt-20">
                {/* Hero */}
                <section className="relative h-64 md:h-80">
                    {trek?.image ? (
                        <Image
                            src={trek.image}
                            alt={group.trek_title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-800" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="container mx-auto">
                            <Link href="/community" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Community
                            </Link>
                            <div className="flex items-center gap-2 mb-2">
                                {group.is_public ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                                        <Globe className="w-3 h-3" />
                                        Public
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                                        <Lock className="w-3 h-3" />
                                        Private
                                    </span>
                                )}
                                <span className={`px-2 py-1 rounded-full text-xs ${group.status === 'open' ? 'bg-blue-500/20 text-blue-400' :
                                        group.status === 'full' ? 'bg-red-500/20 text-red-400' :
                                            'bg-slate-500/20 text-slate-400'
                                    }`}>
                                    {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">{group.title}</h1>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Trek & Date */}
                            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-yellow-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Destination</p>
                                            <p className="font-medium text-white">{group.trek_title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Planned Date</p>
                                            <p className="font-medium text-white">
                                                {formattedDate}
                                                {group.flexible_dates && <span className="text-slate-400 text-sm"> (flexible)</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                            <Users className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Members</p>
                                            <p className="font-medium text-white">{group.current_members} / {group.max_members}</p>
                                        </div>
                                    </div>
                                </div>

                                {group.description && (
                                    <div className="mt-6 pt-6 border-t border-slate-700">
                                        <h3 className="font-medium text-white mb-2">About this group</h3>
                                        <p className="text-slate-400">{group.description}</p>
                                    </div>
                                )}
                            </div>

                            {/* Members */}
                            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                                <h3 className="font-semibold text-white mb-4">
                                    Members ({approvedMembers.length})
                                </h3>
                                <div className="space-y-3">
                                    {approvedMembers.map(member => (
                                        <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                                            <div className="w-10 h-10 rounded-full bg-slate-600 overflow-hidden">
                                                {member.user_profile?.user?.avatar_url ? (
                                                    <Image
                                                        src={member.user_profile.user.avatar_url}
                                                        alt=""
                                                        width={40}
                                                        height={40}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                        {(member.user_profile?.display_name || member.user_profile?.user?.full_name)?.[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-white truncate">
                                                        {member.user_profile?.display_name || member.user_profile?.user?.full_name}
                                                    </span>
                                                    {member.role === 'creator' && (
                                                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                                                            Creator
                                                        </span>
                                                    )}
                                                    {member.user_profile?.is_verified && (
                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                    )}
                                                </div>
                                                {member.user_profile && (
                                                    <LevelBadge level={member.user_profile.level} size="sm" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pending Requests (Creator only) */}
                            {isCreator && pendingMembers.length > 0 && (
                                <div className="bg-slate-800/50 rounded-xl border border-yellow-500/30 p-6">
                                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                        <UserPlus className="w-5 h-5 text-yellow-400" />
                                        Pending Requests ({pendingMembers.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {pendingMembers.map(member => (
                                            <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                                                <div className="w-10 h-10 rounded-full bg-slate-600 overflow-hidden">
                                                    {member.user_profile?.user?.avatar_url ? (
                                                        <Image
                                                            src={member.user_profile.user.avatar_url}
                                                            alt=""
                                                            width={40}
                                                            height={40}
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                            {(member.user_profile?.display_name || member.user_profile?.user?.full_name)?.[0]?.toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="font-medium text-white truncate block">
                                                        {member.user_profile?.display_name || member.user_profile?.user?.full_name}
                                                    </span>
                                                    {member.user_profile && (
                                                        <LevelBadge level={member.user_profile.level} size="sm" />
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApprove(member.id)}
                                                        disabled={actionLoading === member.id}
                                                        className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        {actionLoading === member.id ? (
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(member.id)}
                                                        disabled={actionLoading === member.id}
                                                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-24 space-y-4">
                                {/* Creator Info */}
                                {group.creator && (
                                    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                                        <p className="text-xs text-slate-400 mb-3">Created by</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden">
                                                {group.creator.user?.avatar_url ? (
                                                    <Image
                                                        src={group.creator.user.avatar_url}
                                                        alt=""
                                                        width={48}
                                                        height={48}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-lg">
                                                        {(group.creator.display_name || group.creator.user?.full_name)?.[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-white">
                                                        {group.creator.display_name || group.creator.user?.full_name}
                                                    </span>
                                                    {group.creator.is_verified && (
                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                    )}
                                                </div>
                                                <LevelBadge level={group.creator.level} size="sm" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 space-y-3">
                                    {/* Join Button */}
                                    {!isCreator && !isMember && !hasPendingRequest && canJoin && group.status === 'open' && (
                                        <button
                                            onClick={handleJoinRequest}
                                            disabled={actionLoading === 'join'}
                                            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-600 rounded-lg font-semibold text-slate-900 flex items-center justify-center gap-2 transition-colors"
                                        >
                                            {actionLoading === 'join' ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <UserPlus className="w-5 h-5" />
                                                    Request to Join
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {/* Pending Status */}
                                    {hasPendingRequest && (
                                        <div className="py-3 bg-slate-700/50 rounded-lg text-center text-slate-300">
                                            <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                                            Request Pending
                                        </div>
                                    )}

                                    {/* Member Actions */}
                                    {isMember && !isCreator && (
                                        <>
                                            <button className="w-full py-3 bg-blue-500 hover:bg-blue-400 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-colors">
                                                <MessageCircle className="w-5 h-5" />
                                                Group Chat
                                            </button>
                                            <button
                                                onClick={handleLeave}
                                                disabled={actionLoading === 'leave'}
                                                className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-red-400 flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Leave Group
                                            </button>
                                        </>
                                    )}

                                    {/* Creator Actions */}
                                    {isCreator && (
                                        <>
                                            <button className="w-full py-3 bg-blue-500 hover:bg-blue-400 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-colors">
                                                <MessageCircle className="w-5 h-5" />
                                                Group Chat
                                            </button>
                                            {!group.is_public && group.invite_code && (
                                                <button
                                                    onClick={copyInviteCode}
                                                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    {copied ? (
                                                        <>
                                                            <Check className="w-4 h-4 text-green-400" />
                                                            Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-4 h-4" />
                                                            Copy Invite Code
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                            <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 flex items-center justify-center gap-2 transition-colors">
                                                <Settings className="w-4 h-4" />
                                                Manage Group
                                            </button>
                                        </>
                                    )}

                                    {/* Not logged in or can't join */}
                                    {!profile && (
                                        <p className="text-center text-slate-400 text-sm py-2">
                                            Sign in to join groups
                                        </p>
                                    )}
                                    {profile && !canJoin && !isMember && !isCreator && (
                                        <p className="text-center text-slate-400 text-sm py-2">
                                            Reach Silver level to join groups
                                        </p>
                                    )}
                                </div>

                                {/* Trek Link */}
                                {trek && (
                                    <Link
                                        href={`/destinations/${trek.slug}`}
                                        className="block bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 hover:border-slate-600/50 transition-colors"
                                    >
                                        <p className="text-xs text-slate-400 mb-2">View Destination</p>
                                        <p className="font-medium text-white">{trek.title} →</p>
                                    </Link>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
