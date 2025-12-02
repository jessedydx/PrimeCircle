'use client'

import { useQuery } from '@tanstack/react-query'
import { EnrichedFollowing } from '@/types/user'
import { mockFollowingUsers, USE_MOCK_DATA } from '@/lib/mockData'
import { getTier } from '@/lib/tiers'

export function useFollowing(fid: number | undefined) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['following', fid],
        queryFn: async () => {
            if (!fid) throw new Error('FID required')

            // Use mock data for local development
            if (USE_MOCK_DATA) {
                console.log('Using mock following data')
                return mockFollowingUsers.map((user) => ({
                    ...user,
                    tier: getTier(user.neynar_user_score),
                })) as EnrichedFollowing[]
            }

            const response = await fetch(`/api/following?fid=${fid}`)

            if (!response.ok) {
                throw new Error('Failed to fetch following')
            }

            const { users } = await response.json()
            return users as EnrichedFollowing[]
        },
        enabled: !!fid,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    })

    return {
        following: data || [],
        loading: isLoading,
        error,
    }
}
