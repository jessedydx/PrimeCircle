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

    // Check payment contract access
    const {
        data: contractAccess,
        isLoading: isCheckingContract,
        error,
        refetch: refetchContract,
    } = useReadContract({
        address: OPPORTUNITIES_ACCESS as `0x${string}`,
        abi: ACCESS_CONTRACT_ABI,
        functionName: 'checkAccess',
        args: addressToCheck ? [addressToCheck as `0x${string}`] : undefined,
        query: {
            enabled: !!addressToCheck,
        },
    })

    // Check NFT ownership (Lifetime Access)
    const {
        data: nftBalance,
        isLoading: isCheckingNft,
        refetch: refetchNft,
    } = useReadContract({
        address: '0x3F7A0ffC8703adcB405D3Fdb179a74281C5CF80b', // TIME_CAPSULES_NFT
        abi: [
            {
                inputs: [{ name: 'owner', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
        ],
        functionName: 'balanceOf',
        args: addressToCheck ? [addressToCheck as `0x${string}`] : undefined,
        query: {
            enabled: !!addressToCheck,
        },
    })

    // TEMPORARY: Force no access for payment gate testing
    const TESTING_PAYMENT_GATE = false

    const hasNftAccess = Number(nftBalance) > 0
    const hasContractAccess = contractAccess as boolean ?? false
    const hasAccess = hasContractAccess || hasNftAccess

    return {
        hasAccess: TESTING_PAYMENT_GATE ? false : hasAccess,
        isChecking: isCheckingContract || isCheckingNft,
        error: error ? error.message : null,
        recheckAccess: () => {
            refetchContract()
            refetchNft()
        },
    }
}
