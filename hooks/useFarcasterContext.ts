'use client'

import { useEffect, useState } from 'react'
import sdk from '@farcaster/frame-sdk'
import { mockFarcasterUser, USE_MOCK_DATA } from '@/lib/mockData'

export interface FarcasterUser {
    fid: number
    username: string
    displayName: string
    pfpUrl: string
    custodyAddress?: string
    verifiedAddresses?: string[]
}

export function useFarcasterContext() {
    const [user, setUser] = useState<FarcasterUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        async function loadContext() {
            try {
                // Use mock data for local development
                if (USE_MOCK_DATA) {
                    console.log('Using mock Farcaster context')
                    setUser(mockFarcasterUser)
                    setLoading(false)
                    return
                }

                const context = await sdk.context

                if (!context?.user) {
                    throw new Error('No user context available')
                }

                setUser({
                    fid: context.user.fid,
                    username: context.user.username || '',
                    displayName: context.user.displayName || '',
                    pfpUrl: context.user.pfpUrl || '',
                    custodyAddress: (context.user as any)?.connectedAddress || (context.user as any)?.custodyAddress,
                    verifiedAddresses: (context.user as any)?.verifiedAddresses || [],
                })
            } catch (err) {
                console.error('Failed to load Farcaster context:', err)
                setError(err as Error)
            } finally {
                setLoading(false)
            }
        }

        loadContext()
    }, [])

    return { user, loading, error }
}
