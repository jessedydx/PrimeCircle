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

    return {
        hasAccess: hasAccess as boolean ?? false,
        isChecking,
        error: error ? error.message : null,
        recheckAccess: refetch,
    }
}
