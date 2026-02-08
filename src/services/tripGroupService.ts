// Trip Group Service - handles group CRUD, membership, and matching

import { supabase } from '@/lib/supabaseClient';
import {
    TripGroup,
    GroupMembership,
    GroupFilters,
    CreateGroupInput,
    GroupStatus,
} from '@/types/community';
import { canCreateGroups, canJoinGroups, getMaxGroupSize } from '@/lib/levels';
import { getUserProfileById } from './userProfileService';

/**
 * Create a new trip group
 */
export async function createGroup(
    creatorProfileId: string,
    input: CreateGroupInput
): Promise<TripGroup | null> {
    // Verify creator has permission
    const creator = await getUserProfileById(creatorProfileId);
    if (!creator || !canCreateGroups(creator.level)) {
        console.error('User does not have permission to create groups');
        return null;
    }

    const maxMembers = input.max_members || getMaxGroupSize(creator.level);

    // Generate invite code for private groups
    const inviteCode = !input.is_public
        ? Math.random().toString(36).substring(2, 10).toUpperCase()
        : null;

    const { data, error } = await supabase
        .from('trip_groups')
        .insert({
            creator_id: creatorProfileId,
            trek_slug: input.trek_slug,
            trek_title: input.trek_title,
            title: input.title,
            description: input.description || null,
            planned_date: input.planned_date,
            flexible_dates: input.flexible_dates || false,
            max_members: maxMembers,
            current_members: 1, // Creator is automatically a member
            is_public: input.is_public !== false,
            invite_code: inviteCode,
            status: 'open',
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating group:', error);
        return null;
    }

    // Add creator as a member with 'creator' role
    await supabase.from('group_memberships').insert({
        group_id: data.id,
        user_profile_id: creatorProfileId,
        role: 'creator',
        status: 'approved',
        joined_at: new Date().toISOString(),
    });

    return data as TripGroup;
}

/**
 * Get public groups with optional filters
 */
export async function getPublicGroups(
    filters?: GroupFilters,
    limit: number = 20,
    offset: number = 0
): Promise<TripGroup[]> {
    let query = supabase
        .from('trip_groups')
        .select(`
            *,
            creator:user_profiles!creator_id(
                id,
                display_name,
                level,
                is_verified,
                user:users(full_name, avatar_url)
            )
        `)
        .eq('is_public', true)
        .order('planned_date', { ascending: true });

    // Apply filters
    if (filters?.trek_slug) {
        query = query.eq('trek_slug', filters.trek_slug);
    }
    if (filters?.status) {
        query = query.eq('status', filters.status);
    } else {
        query = query.eq('status', 'open'); // Default to open groups
    }
    if (filters?.date_from) {
        query = query.gte('planned_date', filters.date_from);
    }
    if (filters?.date_to) {
        query = query.lte('planned_date', filters.date_to);
    }
    if (filters?.has_space) {
        query = query.lt('current_members', supabase.rpc('get_max_members'));
        // Note: This requires a custom RPC or raw SQL. Simplified approach:
        query = query.neq('status', 'full');
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching groups:', error);
        return [];
    }

    return data as TripGroup[];
}

/**
 * Get a single group by ID with members
 */
export async function getGroupById(groupId: string): Promise<TripGroup | null> {
    const { data, error } = await supabase
        .from('trip_groups')
        .select(`
            *,
            creator:user_profiles!creator_id(
                id,
                display_name,
                level,
                is_verified,
                user:users(full_name, avatar_url)
            ),
            members:group_memberships(
                id,
                role,
                status,
                joined_at,
                user_profile:user_profiles(
                    id,
                    display_name,
                    level,
                    is_verified,
                    user:users(full_name, avatar_url)
                )
            )
        `)
        .eq('id', groupId)
        .single();

    if (error) {
        console.error('Error fetching group:', error);
        return null;
    }

    return data as TripGroup;
}

/**
 * Get group by invite code (for private groups)
 */
export async function getGroupByInviteCode(inviteCode: string): Promise<TripGroup | null> {
    const { data, error } = await supabase
        .from('trip_groups')
        .select('*')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

    if (error) {
        console.error('Error fetching group by invite code:', error);
        return null;
    }

    return data as TripGroup;
}

/**
 * Request to join a group
 */
export async function requestToJoinGroup(
    groupId: string,
    userProfileId: string
): Promise<GroupMembership | null> {
    // Verify user has permission to join groups
    const user = await getUserProfileById(userProfileId);
    if (!user || !canJoinGroups(user.level)) {
        console.error('User does not have permission to join groups');
        return null;
    }

    // Check if group exists and has space
    const group = await getGroupById(groupId);
    if (!group || group.status !== 'open') {
        console.error('Group is not open for new members');
        return null;
    }
    if (group.current_members >= group.max_members) {
        console.error('Group is full');
        return null;
    }

    // Check if user is already a member
    const { data: existingMembership } = await supabase
        .from('group_memberships')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_profile_id', userProfileId)
        .single();

    if (existingMembership) {
        console.error('User is already a member or has a pending request');
        return null;
    }

    const { data, error } = await supabase
        .from('group_memberships')
        .insert({
            group_id: groupId,
            user_profile_id: userProfileId,
            role: 'member',
            status: 'pending',
        })
        .select()
        .single();

    if (error) {
        console.error('Error requesting to join group:', error);
        return null;
    }

    return data as GroupMembership;
}

/**
 * Approve a join request (only group creator can do this)
 */
export async function approveJoinRequest(
    membershipId: string,
    approverProfileId: string
): Promise<GroupMembership | null> {
    // First get the membership to find the group
    const { data: membership } = await supabase
        .from('group_memberships')
        .select('*, group:trip_groups(*)')
        .eq('id', membershipId)
        .single();

    if (!membership) {
        console.error('Membership not found');
        return null;
    }

    // Verify approver is the group creator
    if ((membership as any).group.creator_id !== approverProfileId) {
        console.error('Only group creator can approve requests');
        return null;
    }

    // Update membership status
    const { data, error } = await supabase
        .from('group_memberships')
        .update({
            status: 'approved',
            joined_at: new Date().toISOString(),
        })
        .eq('id', membershipId)
        .select()
        .single();

    if (error) {
        console.error('Error approving join request:', error);
        return null;
    }

    // Increment group member count
    await supabase.rpc('increment_group_members', { group_id: (membership as any).group_id });

    return data as GroupMembership;
}

/**
 * Reject a join request
 */
export async function rejectJoinRequest(
    membershipId: string,
    rejecterProfileId: string
): Promise<boolean> {
    const { data: membership } = await supabase
        .from('group_memberships')
        .select('*, group:trip_groups(*)')
        .eq('id', membershipId)
        .single();

    if (!membership || (membership as any).group.creator_id !== rejecterProfileId) {
        return false;
    }

    const { error } = await supabase
        .from('group_memberships')
        .update({ status: 'rejected' })
        .eq('id', membershipId);

    return !error;
}

/**
 * Leave a group
 */
export async function leaveGroup(
    groupId: string,
    userProfileId: string
): Promise<boolean> {
    const { data: membership } = await supabase
        .from('group_memberships')
        .select('role')
        .eq('group_id', groupId)
        .eq('user_profile_id', userProfileId)
        .single();

    if (!membership) {
        return false;
    }

    // Creator cannot leave (must cancel group instead)
    if (membership.role === 'creator') {
        console.error('Creator cannot leave the group. Cancel it instead.');
        return false;
    }

    const { error } = await supabase
        .from('group_memberships')
        .update({ status: 'left' })
        .eq('group_id', groupId)
        .eq('user_profile_id', userProfileId);

    if (!error) {
        // Decrement member count
        await supabase.rpc('decrement_group_members', { group_id: groupId });
    }

    return !error;
}

/**
 * Get groups created by a user
 */
export async function getGroupsByCreator(creatorProfileId: string): Promise<TripGroup[]> {
    const { data, error } = await supabase
        .from('trip_groups')
        .select('*')
        .eq('creator_id', creatorProfileId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user groups:', error);
        return [];
    }

    return data as TripGroup[];
}

/**
 * Get groups a user is a member of
 */
export async function getGroupsForMember(userProfileId: string): Promise<TripGroup[]> {
    const { data, error } = await supabase
        .from('group_memberships')
        .select(`
            group:trip_groups(*)
        `)
        .eq('user_profile_id', userProfileId)
        .eq('status', 'approved');

    if (error) {
        console.error('Error fetching member groups:', error);
        return [];
    }

    return data.map((m: any) => m.group) as TripGroup[];
}

/**
 * Get pending join requests for a group (for creators)
 */
export async function getPendingRequests(groupId: string): Promise<GroupMembership[]> {
    const { data, error } = await supabase
        .from('group_memberships')
        .select(`
            *,
            user_profile:user_profiles(
                id,
                display_name,
                level,
                is_verified,
                user:users(full_name, avatar_url)
            )
        `)
        .eq('group_id', groupId)
        .eq('status', 'pending');

    if (error) {
        console.error('Error fetching pending requests:', error);
        return [];
    }

    return data as GroupMembership[];
}

/**
 * Update group status
 */
export async function updateGroupStatus(
    groupId: string,
    creatorProfileId: string,
    status: GroupStatus
): Promise<TripGroup | null> {
    // Verify user is the creator
    const { data: group } = await supabase
        .from('trip_groups')
        .select('creator_id')
        .eq('id', groupId)
        .single();

    if (!group || group.creator_id !== creatorProfileId) {
        console.error('Only creator can update group status');
        return null;
    }

    const { data, error } = await supabase
        .from('trip_groups')
        .update({
            status,
            updated_at: new Date().toISOString(),
        })
        .eq('id', groupId)
        .select()
        .single();

    if (error) {
        console.error('Error updating group status:', error);
        return null;
    }

    return data as TripGroup;
}
