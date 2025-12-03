'use client'

import { useEffect } from 'react'
import { useReadContract, useAccount } from 'wagmi'
import { PRIME_CIRCLE_ACCESS, ACCESS_CONTRACT_ABI } from '@/config/contracts'

export function useAccessControl(userAddress: string | undefined) {
    const { address: connectedAddress } = useAccount()

    // Use connected address from Wagmi if available, otherwise use provided address
    const addressToCheck = connectedAddress || userAddress

    // Check payment contract access
    const {
        data: contractAccess,
        isLoading: isCheckingContract,
        error: contractError,
        refetch: refetchContract,
    } = useReadContract({
        address: PRIME_CIRCLE_ACCESS as `0x${string}`,
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

    // Debug: Log the address and access status
    useEffect(() => {
        if (addressToCheck) {
            console.log('🔍 Low Score Access Check:')
            console.log('  Address:', addressToCheck)
            console.log('  Contract Access:', contractAccess)
            console.log('  NFT Balance:', nftBalance)
            console.log('  Has Access:', !!contractAccess || (Number(nftBalance) > 0))
        }
    }, [addressToCheck, contractAccess, nftBalance])

    // TEMPORARY: Force no access for payment gate testing
    const TESTING_PAYMENT_GATE = false

    const hasNftAccess = Number(nftBalance) > 0
    const hasContractAccess = contractAccess as boolean ?? false
    const hasAccess = hasContractAccess || hasNftAccess

    return {
        hasAccess: TESTING_PAYMENT_GATE ? false : hasAccess,
        isChecking: isCheckingContract || isCheckingNft,
        error: contractError ? contractError.message : null,
        recheckAccess: () => {
            refetchContract()
            refetchNft()
        },
    }
}
