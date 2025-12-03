'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from '@/config/wagmi'
import { useState, useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 72 * 60 * 60 * 1000, // 72 hours cache
                        gcTime: 72 * 60 * 60 * 1000, // Keep unused data for 72 hours
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
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </WagmiProvider>
        )
    }

    // On client-side after mount, use persistent provider
    const persister = createSyncStoragePersister({
        storage: window.localStorage,
    })

    return (
        <WagmiProvider config={wagmiConfig}>
            <PersistQueryClientProvider
                client={queryClient}
                persistOptions={{ persister }}
            >
                {children}
            </PersistQueryClientProvider>
        </WagmiProvider>
    )
}
