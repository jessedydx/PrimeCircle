'use client'

import { QueryClient } from '@tanstack/react-query'
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

    const [persister, setPersister] = useState<any>(null)

    useEffect(() => {
        // Ensure this runs only on client side
        if (typeof window !== 'undefined') {
            const localStoragePersister = createSyncStoragePersister({
                storage: window.localStorage,
            })
            setPersister(localStoragePersister)
        }
    }, [])

    if (!persister) {
        // Render without persistence during SSR or initial mount
        return <>{children}</>
    }

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
        >
            {children}
        </PersistQueryClientProvider>
    )
}
