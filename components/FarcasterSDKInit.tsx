'use client'

import { useEffect } from 'react'
import sdk from '@farcaster/frame-sdk'

/**
 * Client component for Farcaster SDK initialization
 */
export function FarcasterSDKInit() {
    useEffect(() => {
        const initSDK = async () => {
            try {
                await sdk.actions.ready()
                console.log('Farcaster SDK initialized')
            } catch (error) {
                console.error('Failed to initialize Farcaster SDK:', error)
            }
        }

        initSDK()
    }, [])

    return null
}
