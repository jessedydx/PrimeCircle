import { Tier } from '@/types/tier'
import { TIER_THRESHOLDS } from '@/config/constants'

/**
 * Calculate tier based on Neynar score
 */
export function getTier(neynarScore: number): Tier {
    if (neynarScore >= TIER_THRESHOLDS.S) return Tier.S
    if (neynarScore >= TIER_THRESHOLDS.A) return Tier.A
    if (neynarScore >= TIER_THRESHOLDS.B) return Tier.B
    if (neynarScore >= TIER_THRESHOLDS.C) return Tier.C
    return Tier.D
}
