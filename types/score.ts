import { TierDistribution } from './tier'

export interface QualityMetrics {
    mean: number // Average Neynar score
    median: number // Median Neynar score
    highRatio: number // S+A tier ratio (0-1)
    lowRatio: number // D tier ratio (0-1)
    totalFollowing: number
    tierDistribution: TierDistribution
}

export interface FollowQualityScore {
    score: number // 0-100
    metrics: QualityMetrics
}
