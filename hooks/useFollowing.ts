'use client'

import { useQuery } from '@tanstack/react-query'
import { EnrichedFollowing } from '@/types/user'
import { mockFollowingUsers, USE_MOCK_DATA } from '@/lib/mockData'
import { getTier } from '@/lib/tiers'

export function useFollowing(fid: number | undefined, limit?: number) {
    const { data, isLoading, error } = useQuery({
        // Don't include limit in queryKey - it fragments the cache
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

            // Always fetch max data (1000) for consistent caching
            // Limit parameter is ignored to ensure cache reuse across pages
            const response = await fetch(`/api/following?fid=${fid}&limit=1000`)

            if (!response.ok) {
                throw new Error('Failed to fetch following')
            }

            const { users } = await response.json()
            return users as EnrichedFollowing[]
        },
        enabled: !!fid,
        // Data is very stable, cache for a week
        staleTime: 7 * 24 * 60 * 60 * 1000,
    })

    return {
        following: data || [],
        loading: isLoading,
        error,
    }
}
