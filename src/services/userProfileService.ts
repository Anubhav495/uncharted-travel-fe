// User Profile Service - handles user profile CRUD and XP operations

import { supabase } from '@/lib/supabaseClient';
import {
    UserProfile,
    XPTransaction,
    XPAction
} from '@/types/community';
import { calculateLevel, getXPReward } from '@/lib/levels';

/**
 * Get user profile by user ID (from users table)
 */
export async function getUserProfileByUserId(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('user_profiles')
        .select(`
            *,
            user:users(email, full_name, avatar_url)
        `)
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }

    return data as UserProfile;
}

/**
 * Get user profile by profile ID
 */
export async function getUserProfileById(profileId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('user_profiles')
        .select(`
            *,
            user:users(email, full_name, avatar_url)
        `)
        .eq('id', profileId)
        .single();

    if (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }

    return data as UserProfile;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
    profileId: string,
    updates: Partial<Pick<UserProfile, 'display_name' | 'bio' | 'preferred_trek_types' | 'experience_level'>>
): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('user_profiles')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', profileId)
        .select()
        .single();

    if (error) {
        console.error('Error updating user profile:', error);
        return null;
    }

    return data as UserProfile;
}

/**
 * Award XP to a user and log the transaction
 */
export async function awardXP(
    profileId: string,
    action: XPAction,
    referenceId?: string,
    referenceType?: 'booking' | 'group' | 'review' | 'referral'
): Promise<{ profile: UserProfile | null; transaction: XPTransaction | null }> {
    const xpAmount = getXPReward(action);

    // First, get current XP
    const { data: currentProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('xp_points')
        .eq('id', profileId)
        .single();

    if (fetchError || !currentProfile) {
        console.error('Error fetching profile for XP award:', fetchError);
        return { profile: null, transaction: null };
    }

    const newXP = currentProfile.xp_points + xpAmount;
    const newLevel = calculateLevel(newXP);

    // Update XP and level
    const { data: updatedProfile, error: updateError } = await supabase
        .from('user_profiles')
        .update({
            xp_points: newXP,
            level: newLevel,
            updated_at: new Date().toISOString(),
        })
        .eq('id', profileId)
        .select()
        .single();

    if (updateError) {
        console.error('Error updating XP:', updateError);
        return { profile: null, transaction: null };
    }

    // Log the transaction
    const { data: transaction, error: txError } = await supabase
        .from('xp_transactions')
        .insert({
            user_profile_id: profileId,
            action,
            xp_amount: xpAmount,
            reference_id: referenceId || null,
            reference_type: referenceType || null,
        })
        .select()
        .single();

    if (txError) {
        console.error('Error logging XP transaction:', txError);
    }

    return {
        profile: updatedProfile as UserProfile,
        transaction: transaction as XPTransaction,
    };
}

/**
 * Verify a user (after booking completion, ID check, etc.)
 */
export async function verifyUser(
    profileId: string,
    method: 'booking' | 'id' | 'phone'
): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('user_profiles')
        .update({
            is_verified: true,
            verified_at: new Date().toISOString(),
            verification_method: method,
            updated_at: new Date().toISOString(),
        })
        .eq('id', profileId)
        .select()
        .single();

    if (error) {
        console.error('Error verifying user:', error);
        return null;
    }

    return data as UserProfile;
}

/**
 * Get XP transaction history for a user
 */
export async function getXPHistory(
    profileId: string,
    limit: number = 20
): Promise<XPTransaction[]> {
    const { data, error } = await supabase
        .from('xp_transactions')
        .select('*')
        .eq('user_profile_id', profileId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching XP history:', error);
        return [];
    }

    return data as XPTransaction[];
}

/**
 * Get leaderboard (top users by XP)
 */
export async function getLeaderboard(limit: number = 10): Promise<UserProfile[]> {
    const { data, error } = await supabase
        .from('user_profiles')
        .select(`
            *,
            user:users(full_name, avatar_url)
        `)
        .order('xp_points', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }

    return data as UserProfile[];
}
