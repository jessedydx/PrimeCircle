'use client'

import { useMemo } from 'react'
import { EnrichedFollowing } from '@/types/user'
import { FollowQualityScore } from '@/types/score'
import { calculateQualityScore } from '@/lib/scoring'

export function useQualityScore(following: EnrichedFollowing[]): FollowQualityScore | null {
    return useMemo(() => {
        if (!following || following.length === 0) {
            return null
        }

        return calculateQualityScore(following)
    }, [following])
}
