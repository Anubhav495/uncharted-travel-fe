// Level Badge Component - Displays user level with appropriate styling

import React from 'react';
import { UserLevel } from '@/types/community';
import { getLevelBadge } from '@/lib/levels';
import { Star, Crown, Award, Medal, User } from 'lucide-react';

interface LevelBadgeProps {
    level: UserLevel;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

const LEVEL_ICONS: Record<UserLevel, React.ReactNode> = {
    newcomer: <User className="w-full h-full" />,
    bronze: <Medal className="w-full h-full" />,
    silver: <Award className="w-full h-full" />,
    gold: <Star className="w-full h-full" />,
    platinum: <Crown className="w-full h-full" />,
};

const SIZE_CLASSES = {
    sm: {
        container: 'px-2 py-0.5 text-xs gap-1',
        icon: 'w-3 h-3',
    },
    md: {
        container: 'px-3 py-1 text-sm gap-1.5',
        icon: 'w-4 h-4',
    },
    lg: {
        container: 'px-4 py-1.5 text-base gap-2',
        icon: 'w-5 h-5',
    },
};

export default function LevelBadge({ level, size = 'md', showLabel = true }: LevelBadgeProps) {
    const { name, colors } = getLevelBadge(level);
    const sizeClasses = SIZE_CLASSES[size];

    return (
        <span
            className={`
                inline-flex items-center rounded-full font-medium
                ${colors.bg} ${colors.text} border ${colors.border}
                ${sizeClasses.container}
            `}
        >
            <span className={sizeClasses.icon}>
                {LEVEL_ICONS[level]}
            </span>
            {showLabel && <span>{name}</span>}
        </span>
    );
}
