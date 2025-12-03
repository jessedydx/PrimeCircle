import { useReadContracts, useAccount } from 'wagmi'
import { PRIME_CIRCLE_ACCESS, ACCESS_CONTRACT_ABI } from '@/config/contracts'
import { FarcasterUser } from './useFarcasterContext'
import { useEffect, useMemo } from 'react'

export function useAccessControl(user: FarcasterUser | null) {
    const { address: connectedAddress } = useAccount()

    // Combine all unique addresses to check
    const addressesToCheck = useMemo(() => {
        const set = new Set<string>()
        if (connectedAddress) set.add(connectedAddress)
        if (user?.custodyAddress) set.add(user.custodyAddress)
        if (user?.verifiedAddresses) {
            user.verifiedAddresses.forEach(addr => set.add(addr))
        }
        return Array.from(set) as `0x${string}`[]
    }, [connectedAddress, user])

    // 1. Check Contract Access for ALL addresses
    const {
        data: contractResults,
        isLoading: isCheckingContract,
        refetch: refetchContract,
    } = useReadContracts({
        contracts: addressesToCheck.map(addr => ({
            address: PRIME_CIRCLE_ACCESS as `0x${string}`,
            abi: ACCESS_CONTRACT_ABI,
            functionName: 'checkAccess',
            args: [addr],
        })),
        query: {
            enabled: addressesToCheck.length > 0,
        }
    })

    // 2. Check NFT Balance for ALL addresses
    const {
        data: nftResults,
        isLoading: isCheckingNft,
        refetch: refetchNft,
    } = useReadContracts({
        contracts: addressesToCheck.map(addr => ({
            address: '0x3F7A0ffC8703adcB405D3Fdb179a74281C5CF80b',
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
        query: {
            enabled: addressesToCheck.length > 0,
        }
    })

    // Calculate final access status
    const hasAccess = useMemo(() => {
        // Check contract access results
        const contractAccess = contractResults?.some(result => result.status === 'success' && result.result === true)

        // Check NFT balance results
        const nftAccess = nftResults?.some(result => result.status === 'success' && Number(result.result) > 0)

        return contractAccess || nftAccess
    }, [contractResults, nftResults])

    // Debug logging
    useEffect(() => {
        if (addressesToCheck.length > 0) {
            console.log('🔍 Access Check (Multi-Address):', addressesToCheck)
            console.log('  Contract Results:', contractResults)
            console.log('  NFT Results:', nftResults)
            console.log('  Final Access:', hasAccess)
        }
    }, [addressesToCheck, contractResults, nftResults, hasAccess])

    // TEMPORARY: Force no access for payment gate testing
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
