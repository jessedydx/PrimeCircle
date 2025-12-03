'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { useState, useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 24 * 60 * 60 * 1000, // 24 hours default
                        gcTime: 24 * 60 * 60 * 1000, // Keep unused data for 24 hours
                    },
                },
            })
    )

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // During SSR or before client hydration, use standard QueryClientProvider
    if (!isMounted || typeof window === 'undefined') {
        return (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )
    }

    // On client-side after mount, use persistent provider
    const persister = createSyncStoragePersister({
        storage: window.localStorage,
    })

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
        >
            {children}
        </PersistQueryClientProvider>
    )
}
