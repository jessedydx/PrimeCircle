import { Tier, TierDistribution } from './tier'

export interface NeynarUser {
    fid: number
    username: string
    display_name: string
    pfp_url: string
    profile: {
        bio: {
            text: string
        }
    }
    follower_count: number
    following_count: number
    neynar_user_score: number // 0-100
    power_badge: boolean
}

export interface EnrichedFollowing extends NeynarUser {
    tier: Tier
    isOneWay?: boolean
}

export interface EnrichedFollower extends NeynarUser {
    tier: Tier
    isOpportunity?: boolean
}
