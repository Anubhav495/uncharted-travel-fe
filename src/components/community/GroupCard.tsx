// Group Card Component - Displays a trip group preview

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TripGroup } from '@/types/community';
import LevelBadge from '@/components/ui/LevelBadge';
import { Calendar, Users, MapPin, Lock, CheckCircle } from 'lucide-react';
import { treks } from '@/data/treks';

interface GroupCardProps {
    group: TripGroup;
    showJoinButton?: boolean;
    onJoinClick?: () => void;
}

export default function GroupCard({ group, showJoinButton = true, onJoinClick }: GroupCardProps) {
    const trek = treks.find(t => t.slug === group.trek_slug);
    const isFull = group.current_members >= group.max_members;
    const spotsLeft = group.max_members - group.current_members;

    const formattedDate = new Date(group.planned_date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-all group">
            {/* Trek Image */}
            <div className="relative h-32 overflow-hidden">
                {trek?.image ? (
                    <Image
                        src={trek.image}
                        alt={group.trek_title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

                {/* Status badges */}
                <div className="absolute top-2 right-2 flex gap-2">
                    {!group.is_public && (
                        <span className="bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-slate-300 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Private
                        </span>
                    )}
                    {isFull && (
                        <span className="bg-red-500/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white">
                            Full
                        </span>
                    )}
                </div>

                {/* Trek title */}
                <div className="absolute bottom-2 left-3 right-3">
                    <div className="flex items-center gap-1 text-yellow-400 text-xs mb-0.5">
                        <MapPin className="w-3 h-3" />
                        {group.trek_title}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-white mb-2 line-clamp-1">
                    {group.title}
                </h3>

                {group.description && (
                    <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                        {group.description}
                    </p>
                )}

                {/* Meta info */}
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formattedDate}</span>
                        {group.flexible_dates && (
                            <span className="text-xs text-slate-500">(±)</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>
                            {group.current_members}/{group.max_members}
                        </span>
                    </div>
                </div>

                {/* Creator info */}
                {group.creator && (
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
                            {group.creator.user?.avatar_url ? (
                                <Image
                                    src={group.creator.user.avatar_url}
                                    alt={group.creator.display_name || ''}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                                    {(group.creator.display_name || group.creator.user?.full_name)?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-white truncate">
                                    {group.creator.display_name || group.creator.user?.full_name}
                                </span>
                                {group.creator.is_verified && (
                                    <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                                )}
                            </div>
                            <LevelBadge level={group.creator.level} size="sm" />
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                    <Link
                        href={`/community/${group.id}`}
                        className="flex-1 text-center py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium text-white transition-colors"
                    >
                        View Details
                    </Link>
                    {showJoinButton && !isFull && (
                        <button
                            onClick={onJoinClick}
                            className="py-2 px-4 bg-yellow-500 hover:bg-yellow-400 rounded-lg text-sm font-medium text-slate-900 transition-colors"
                        >
                            Join
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
