'use client'

import { useReadContract, useAccount } from 'wagmi'
import { ONE_WAY_ACCESS, ACCESS_CONTRACT_ABI } from '@/config/contracts'

/**
 * Hook to check if user has access to One-Way Follows feature
 * Uses the ONE_WAY_ACCESS contract
 */
export function useOneWayAccessControl(userAddress: string | undefined) {
    const { address: connectedAddress } = useAccount()

    const addressToCheck = connectedAddress || userAddress

    const {
        data: hasAccess,
        isLoading: isChecking,
        error,
        refetch,
    } = useReadContract({
        address: ONE_WAY_ACCESS as `0x${string}`,
        abi: ACCESS_CONTRACT_ABI,
        functionName: 'checkAccess',
        args: addressToCheck ? [addressToCheck as `0x${string}`] : undefined,
        query: {
            enabled: !!addressToCheck,
        },
    })

    // TEMPORARY: Force no access for payment gate testing
    const TESTING_PAYMENT_GATE = true

    return {
        hasAccess: TESTING_PAYMENT_GATE ? false : (hasAccess as boolean ?? false),
        isChecking,
        error: error ? error.message : null,
        recheckAccess: refetch,
    }
}
