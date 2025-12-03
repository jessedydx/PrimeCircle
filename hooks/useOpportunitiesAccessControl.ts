'use client'

import { useReadContract, useAccount } from 'wagmi'
import { OPPORTUNITIES_ACCESS, ACCESS_CONTRACT_ABI } from '@/config/contracts'

/**
 * Hook to check if user has access to Opportunities feature
 * Uses the OPPORTUNITIES_ACCESS contract
 */
export function useOpportunitiesAccessControl(userAddress: string | undefined) {
    const { address: connectedAddress } = useAccount()

    const addressToCheck = connectedAddress || userAddress

    const {
        data: hasAccess,
        isLoading: isChecking,
        error,
        refetch,
    } = useReadContract({
        address: OPPORTUNITIES_ACCESS as `0x${string}`,
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
