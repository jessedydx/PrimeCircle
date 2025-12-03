'use client'

import { useEffect } from 'react'
import { useReadContract, useAccount } from 'wagmi'
import { PRIME_CIRCLE_ACCESS, ACCESS_CONTRACT_ABI } from '@/config/contracts'

export function useAccessControl(userAddress: string | undefined) {
    const { address: connectedAddress } = useAccount()

    // Use connected address from Wagmi if available, otherwise use provided address
    const addressToCheck = connectedAddress || userAddress

    const {
        data: hasAccess,
        isLoading: isChecking,
        error,
        refetch,
    } = useReadContract({
        address: PRIME_CIRCLE_ACCESS as `0x${string}`,
        abi: ACCESS_CONTRACT_ABI,
        functionName: 'checkAccess',
        args: addressToCheck ? [addressToCheck as `0x${string}`] : undefined,
        query: {
            enabled: !!addressToCheck,
        },
    })

    // Debug: Log the address and access status
    useEffect(() => {
        if (addressToCheck) {
            console.log('🔍 Low Score Access Check:')
            console.log('  Address:', addressToCheck)
            console.log('  Has Access:', hasAccess)
            console.log('  Is Checking:', isChecking)
            if (error) console.log('  Error:', error)
        }
    }, [addressToCheck, hasAccess, isChecking, error])

    // TEMPORARY: Force no access for payment gate testing
    const TESTING_PAYMENT_GATE = false

    return {
        hasAccess: TESTING_PAYMENT_GATE ? false : (hasAccess as boolean ?? false),
        isChecking,
        error: error ? error.message : null,
        recheckAccess: refetch,
    }
}
