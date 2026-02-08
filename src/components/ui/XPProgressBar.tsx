// XP Progress Bar - Shows progress towards next level

import React from 'react';
import { UserLevel } from '@/types/community';
import {
    getLevelProgress,
    getNextLevel,
    getNextLevelXP,
    LEVEL_THRESHOLDS,
    formatXP,
    LEVEL_NAMES,
} from '@/lib/levels';

interface XPProgressBarProps {
    xp: number;
    level: UserLevel;
    showDetails?: boolean;
}

export default function XPProgressBar({ xp, level, showDetails = true }: XPProgressBarProps) {
    const progress = getLevelProgress(xp, level);
    const nextLevel = getNextLevel(level);
    const nextLevelXP = getNextLevelXP(level);
    const currentThreshold = LEVEL_THRESHOLDS[level];

    // Gradient colors based on next level
    const gradientColors: Record<UserLevel | 'null', string> = {
        newcomer: 'from-slate-500 to-slate-400',
        bronze: 'from-amber-600 to-amber-500',
        silver: 'from-slate-400 to-slate-300',
        gold: 'from-yellow-500 to-yellow-400',
        platinum: 'from-purple-500 to-pink-500',
        null: 'from-purple-500 to-pink-500', // Max level
    };

    const gradientClass = nextLevel ? gradientColors[nextLevel] : gradientColors['null'];

    return (
        <div className="w-full">
            {/* Progress bar */}
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${gradientClass} transition-all duration-500 ease-out`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Details */}
            {showDetails && (
                <div className="flex justify-between items-center mt-1.5 text-xs text-slate-400">
                    <span>
                        {formatXP(xp - currentThreshold)} / {nextLevelXP ? formatXP(nextLevelXP - currentThreshold) : '∞'} XP
                    </span>
                    {nextLevel ? (
                        <span>
                            {formatXP(nextLevelXP! - xp)} XP to {LEVEL_NAMES[nextLevel]}
                        </span>
                    ) : (
                        <span className="text-purple-400">Max Level! 🎉</span>
                    )}
                </div>
            )}
        </div>
    );
}
