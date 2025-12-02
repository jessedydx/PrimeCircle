'use client'

import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import sdk from '@farcaster/frame-sdk'
import './globals.css'

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const initSDK = async () => {
            try {
                // Initialize Farcaster SDK
                await sdk.actions.ready()
                console.log('Farcaster SDK initialized')
            } catch (error) {
                console.error('Failed to initialize Farcaster SDK:', error)
            }
        }

        initSDK()
    }, [])

    return (
        <html lang="en">
            <head>
                <title>PrimeCircle - Farcaster Follow Quality Analytics</title>
                <meta name="description" content="Analyze your Farcaster follow network quality" />
            </head>
            <body className="bg-slate-900 text-white antialiased">
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </body>
        </html>
    )
}
