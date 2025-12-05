'use client'

import { useQuery } from '@tanstack/react-query'
import { EnrichedFollower } from '@/types/user'
import { mockFollowers, USE_MOCK_DATA } from '@/lib/mockData'
import { getTier } from '@/lib/tiers'

interface UseFollowersOptions {
    enabled?: boolean
}

export function useFollowers(fid: number | undefined, options: UseFollowersOptions = {}) {
    const { enabled = true } = options

    const { data, isLoading, error } = useQuery({
        // Don't include limit in queryKey - it fragments the cache
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

            // Always fetch max data (500) for consistent caching
            // Limit parameter is ignored to ensure cache reuse across pages
            const response = await fetch(`/api/followers?fid=${fid}&limit=500`)

            if (!response.ok) {
                throw new Error('Failed to fetch followers')
            }

            const { users } = await response.json()
            return users as EnrichedFollower[]
        },
        enabled: !!fid && enabled,
        // Data is very stable, cache for a week
        staleTime: 7 * 24 * 60 * 60 * 1000,
        gcTime: 7 * 24 * 60 * 60 * 1000,
        // CRITICAL: Prevent any refetching
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
    })

    return {
        followers: data || [],
        loading: isLoading,
        error,
    }
}
