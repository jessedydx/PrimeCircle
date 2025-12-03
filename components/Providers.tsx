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
                        staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days - data stays fresh
                        gcTime: 7 * 24 * 60 * 60 * 1000, // Keep in cache for 7 days
                        refetchOnMount: false, // Don't refetch when component mounts
                        refetchOnWindowFocus: false, // Don't refetch on window focus
                        refetchOnReconnect: false, // Don't refetch on reconnect
                        retry: 1, // Only retry once on failure
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
                persistOptions={{
                    persister,
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                }}
            >
                {children}
            </PersistQueryClientProvider>
        </WagmiProvider>
    )
}
