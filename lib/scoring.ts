import { Tier, TierDistribution } from '@/types/tier'
import { EnrichedFollowing } from '@/types/user'
import { FollowQualityScore } from '@/types/score'

/**
 * Calculate quality score from following list
 */
export function calculateQualityScore(users: EnrichedFollowing[]): FollowQualityScore {
    if (users.length === 0) {
        return {
            score: 0,
            metrics: {
                mean: 0,
                median: 0,
                highRatio: 0,
                lowRatio: 0,
                totalFollowing: 0,
                tierDistribution: { S: 0, A: 0, B: 0, C: 0, D: 0 },
            },
        }
    }

    const scores = users.map((u) => u.neynar_user_score)

    // 1. Mean (average)
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length

    // 2. Median
    const sorted = [...scores].sort((a, b) => a - b)
    const median =
        sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)]

    // 3. High quality ratio (S + A tier)
    const highCount = users.filter((u) => u.tier === Tier.S || u.tier === Tier.A).length
    const highRatio = highCount / users.length

    // 4. Low quality ratio (D tier)
    const lowCount = users.filter((u) => u.tier === Tier.D).length
    const lowRatio = lowCount / users.length

    // 5. Tier distribution
    const tierDistribution = calculateTierDistribution(users)

    // 6. Final Score (0-100)
    const normalizedMean = mean / 100
    const normalizedMedian = median / 100

    const finalScore = 100 * (0.5 * normalizedMean + 0.3 * normalizedMedian + 0.2 * highRatio)

    return {
        score: Math.round(finalScore),
        metrics: {
            mean: Math.round(mean),
            median: Math.round(median),
            highRatio,
            lowRatio,
            totalFollowing: users.length,
            tierDistribution,
        },
    }
}

/**
 * Calculate tier distribution
 */
export function calculateTierDistribution(users: EnrichedFollowing[]): TierDistribution {
    const distribution: TierDistribution = {
        S: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
    }

    users.forEach((user) => {
        distribution[user.tier]++
    })

    return distribution
}
