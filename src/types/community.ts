// User profile and community types

export type UserLevel = 'newcomer' | 'bronze' | 'silver' | 'gold' | 'platinum';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type VerificationMethod = 'booking' | 'id' | 'phone';
export type GroupStatus = 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled';
export type MembershipRole = 'creator' | 'co_leader' | 'member';
export type MembershipStatus = 'pending' | 'approved' | 'rejected' | 'left';
export type XPAction =
    | 'first_booking'
    | 'booking_complete'
    | 'group_join'
    | 'group_create'
    | 'review_given'
    | 'review_received'
    | 'referral'
    | 'report_validated';

export interface UserProfile {
    id: string;
    user_id: string;
    display_name: string | null;
    bio: string | null;

    // Verification
    is_verified: boolean;
    verified_at: string | null;
    verification_method: VerificationMethod | null;

    // Level System
    xp_points: number;
    level: UserLevel;

    // Preferences
    preferred_trek_types: string[] | null;
    experience_level: ExperienceLevel | null;

    // Timestamps
    created_at: string;
    updated_at: string;

    // Joined from users table (optional)
    user?: {
        email: string;
        full_name: string | null;
        avatar_url: string | null;
    };
}

export interface TripGroup {
    id: string;
    creator_id: string;

    // Trek Info
    trek_slug: string;
    trek_title: string;

    // Group Details
    title: string;
    description: string | null;
    planned_date: string;
    flexible_dates: boolean;

    // Capacity
    max_members: number;
    current_members: number;

    // Visibility
    is_public: boolean;
    invite_code: string | null;

    // Status
    status: GroupStatus;

    // Timestamps
    created_at: string;
    updated_at: string;

    // Joined data (optional)
    creator?: UserProfile;
    members?: GroupMembership[];
}

export interface GroupMembership {
    id: string;
    group_id: string;
    user_profile_id: string;

    role: MembershipRole;
    status: MembershipStatus;

    joined_at: string | null;
    created_at: string;

    // Joined data (optional)
    user_profile?: UserProfile;
    group?: TripGroup;
}

export interface XPTransaction {
    id: string;
    user_profile_id: string;

    action: XPAction;
    xp_amount: number;
    reference_id: string | null;
    reference_type: 'booking' | 'group' | 'review' | 'referral' | null;

    created_at: string;
}

export interface GroupMessage {
    id: string;
    group_id: string;
    sender_id: string;

    message: string;
    message_type: 'text' | 'image' | 'system';

    created_at: string;

    // Joined data (optional)
    sender?: UserProfile;
}

// API Response types
export interface CreateGroupInput {
    trek_slug: string;
    trek_title: string;
    title: string;
    description?: string;
    planned_date: string;
    flexible_dates?: boolean;
    max_members?: number;
    is_public?: boolean;
}

export interface JoinGroupInput {
    group_id: string;
}

export interface GroupFilters {
    trek_slug?: string;
    status?: GroupStatus;
    date_from?: string;
    date_to?: string;
    has_space?: boolean;
}
