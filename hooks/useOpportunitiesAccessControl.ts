'use client'

import { useReadContracts, useAccount } from 'wagmi'
import { OPPORTUNITIES_ACCESS, ACCESS_CONTRACT_ABI } from '@/config/contracts'
import { FarcasterUser } from './useFarcasterContext'
import { useMemo } from 'react'

export function useOpportunitiesAccessControl(user: FarcasterUser | null) {
    const { address: connectedAddress } = useAccount()

    const addressesToCheck = useMemo(() => {
        const set = new Set<string>()
        if (connectedAddress) set.add(connectedAddress)
        if (user?.custodyAddress) set.add(user.custodyAddress)
        if (user?.verifiedAddresses) {
            user.verifiedAddresses.forEach(addr => set.add(addr))
        }
        return Array.from(set) as `0x${string}`[]
    }, [connectedAddress, user])

    // 1. Check Contract Access
    const {
        data: contractResults,
        isLoading: isCheckingContract,
        refetch: refetchContract,
    } = useReadContracts({
        contracts: addressesToCheck.map(addr => ({
            address: OPPORTUNITIES_ACCESS as `0x${string}`,
            abi: ACCESS_CONTRACT_ABI,
            functionName: 'checkAccess',
            args: [addr],
        })),
        query: { enabled: addressesToCheck.length > 0 }
    })

    // 2. Check NFT Balance
    const {
        data: nftResults,
        isLoading: isCheckingNft,
        refetch: refetchNft,
    } = useReadContracts({
        contracts: addressesToCheck.map(addr => ({
            address: '0x3F7A0ffC8703adcB405D3Fdb179a74281C5CF80b' as `0x${string}`,
            abi: [{
                inputs: [{ name: 'owner', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            }] as const,
            functionName: 'balanceOf',
            args: [addr],
        })),
        query: { enabled: addressesToCheck.length > 0 }
    })

    const hasAccess = useMemo(() => {
        const contractAccess = contractResults?.some(r => r.status === 'success' && r.result === true)
        const nftAccess = nftResults?.some(r => r.status === 'success' && Number(r.result) > 0)
        return contractAccess || nftAccess
    }, [contractResults, nftResults])

    const TESTING_PAYMENT_GATE = false

    return {
        hasAccess: TESTING_PAYMENT_GATE ? false : (hasAccess ?? false),
        isChecking: isCheckingContract || isCheckingNft,
        error: null,
        recheckAccess: () => {
            refetchContract()
            refetchNft()
        },
    }
}
