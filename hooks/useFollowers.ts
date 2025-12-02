'use client'

import { useQuery } from '@tanstack/react-query'
import { EnrichedFollower } from '@/types/user'
import { mockFollowers, USE_MOCK_DATA } from '@/lib/mockData'
import { getTier } from '@/lib/tiers'

export function useFollowers(fid: number | undefined) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['followers', fid],
        queryFn: async () => {
            if (!fid) throw new Error('FID required')

            // Use mock data for local development
            if (USE_MOCK_DATA) {
                console.log('Using mock followers data')
                return mockFollowers.map((user) => ({
                    ...user,
                    tier: getTier(user.neynar_user_score),
                })) as EnrichedFollower[]
            }

            const response = await fetch(`/api/followers?fid=${fid}`)

            if (!response.ok) {
                throw new Error('Failed to fetch followers')
            }

            const { users } = await response.json()
            return users as EnrichedFollower[]
        },
        enabled: !!fid,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    })

    return {
        followers: data || [],
        loading: isLoading,
        error,
    }
}
