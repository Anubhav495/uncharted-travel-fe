// Community Context - Provides community data and methods throughout the app

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
    UserProfile,
    TripGroup,
    GroupMembership,
} from '@/types/community';
import {
    getUserProfileByUserId,
    awardXP as awardXPService,
} from '@/services/userProfileService';
import {
    getGroupsForMember,
    getGroupsByCreator,
    getPendingRequests,
} from '@/services/tripGroupService';
import { canAccessCommunity, canCreateGroups, canJoinGroups } from '@/lib/levels';

interface CommunityContextType {
    // User profile
    profile: UserProfile | null;
    profileLoading: boolean;
    refreshProfile: () => Promise<void>;

    // Permissions
    canAccess: boolean;
    canJoin: boolean;
    canCreate: boolean;

    // User's groups
    myGroups: TripGroup[];
    createdGroups: TripGroup[];
    pendingRequests: GroupMembership[];
    groupsLoading: boolean;
    refreshGroups: () => Promise<void>;

    // Actions
    awardXP: (action: Parameters<typeof awardXPService>[1], referenceId?: string, referenceType?: Parameters<typeof awardXPService>[3]) => Promise<void>;
}

const CommunityContext = createContext<CommunityContextType>({
    profile: null,
    profileLoading: true,
    refreshProfile: async () => { },

    canAccess: false,
    canJoin: false,
    canCreate: false,

    myGroups: [],
    createdGroups: [],
    pendingRequests: [],
    groupsLoading: false,
    refreshGroups: async () => { },

    awardXP: async () => { },
});

export const CommunityProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, loading: authLoading } = useAuth();

    // Profile state
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);

    // Groups state
    const [myGroups, setMyGroups] = useState<TripGroup[]>([]);
    const [createdGroups, setCreatedGroups] = useState<TripGroup[]>([]);
    const [pendingRequests, setPendingRequests] = useState<GroupMembership[]>([]);
    const [groupsLoading, setGroupsLoading] = useState(false);

    // Fetch user profile
    const refreshProfile = useCallback(async () => {
        if (!user?.id) {
            setProfile(null);
            setProfileLoading(false);
            return;
        }

        setProfileLoading(true);
        try {
            const fetchedProfile = await getUserProfileByUserId(user.id);
            setProfile(fetchedProfile);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setProfileLoading(false);
        }
    }, [user?.id]);

    // Fetch user's groups
    const refreshGroups = useCallback(async () => {
        if (!profile?.id) {
            setMyGroups([]);
            setCreatedGroups([]);
            setPendingRequests([]);
            return;
        }

        setGroupsLoading(true);
        try {
            const [memberGroups, created] = await Promise.all([
                getGroupsForMember(profile.id),
                getGroupsByCreator(profile.id),
            ]);

            setMyGroups(memberGroups);
            setCreatedGroups(created);

            // Get pending requests for created groups
            if (created.length > 0) {
                const allPending = await Promise.all(
                    created.map(g => getPendingRequests(g.id))
                );
                setPendingRequests(allPending.flat());
            }
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setGroupsLoading(false);
        }
    }, [profile?.id]);

    // Award XP helper
    const awardXP = useCallback(async (
        action: Parameters<typeof awardXPService>[1],
        referenceId?: string,
        referenceType?: Parameters<typeof awardXPService>[3]
    ) => {
        if (!profile?.id) return;

        const result = await awardXPService(profile.id, action, referenceId, referenceType);
        if (result.profile) {
            setProfile(result.profile);
        }
    }, [profile?.id]);

    // Load profile when user changes
    useEffect(() => {
        if (!authLoading) {
            refreshProfile();
        }
    }, [authLoading, refreshProfile]);

    // Load groups when profile changes
    useEffect(() => {
        if (profile?.id && canAccessCommunity(profile.level)) {
            refreshGroups();
        }
    }, [profile?.id, profile?.level, refreshGroups]);

    // Compute permissions
    const canAccess = profile ? canAccessCommunity(profile.level) : false;
    const canJoin = profile ? canJoinGroups(profile.level) : false;
    const canCreate = profile ? canCreateGroups(profile.level) : false;

    return (
        <CommunityContext.Provider
            value={{
                profile,
                profileLoading,
                refreshProfile,

                canAccess,
                canJoin,
                canCreate,

                myGroups,
                createdGroups,
                pendingRequests,
                groupsLoading,
                refreshGroups,

                awardXP,
            }}
        >
            {children}
        </CommunityContext.Provider>
    );
};

export const useCommunity = () => useContext(CommunityContext);
