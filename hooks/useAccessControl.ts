'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { PRIME_CIRCLE_ACCESS, ACCESS_CONTRACT_ABI } from '@/config/contracts'

export function useAccessControl(userAddress: string | undefined) {
    const [hasAccess, setHasAccess] = useState<boolean>(false)
    const [isChecking, setIsChecking] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        checkAccess()
    }, [userAddress])

    async function checkAccess() {
        if (!userAddress) {
            setIsChecking(false)
            return
        }

        setIsChecking(true)
        setError(null)

        try {
            // Connect to Base network via MetaMask
            if (typeof window.ethereum === 'undefined') {
                throw new Error('MetaMask not installed')
            }

            const provider = new ethers.BrowserProvider(window.ethereum)
            const contract = new ethers.Contract(
                PRIME_CIRCLE_ACCESS,
                ACCESS_CONTRACT_ABI,
                provider
            )

            // Check if user has access (NFT or paid)
            const access = await contract.checkAccess(userAddress)
            setHasAccess(access)
        } catch (err: any) {
            console.error('Access check error:', err)
            setError(err.message || 'Failed to check access')
            setHasAccess(false)
        } finally {
            setIsChecking(false)
        }
    }

    return {
        hasAccess,
        isChecking,
        error,
        recheckAccess: checkAccess,
    }
}
