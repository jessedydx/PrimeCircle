'use client'

import { useReadContracts, useAccount } from 'wagmi'
import { ONE_WAY_ACCESS, ACCESS_CONTRACT_ABI } from '@/config/contracts'
import { FarcasterUser } from './useFarcasterContext'
import { useMemo, useState, useEffect } from 'react'

export function useOneWayAccessControl(user: FarcasterUser | null) {
    const { address: connectedAddress } = useAccount()
    const [apiAccess, setApiAccess] = useState<boolean | null>(null)
    const [isCheckingApi, setIsCheckingApi] = useState(false)

    const addressesToCheck = useMemo(() => {
        const set = new Set<string>()
        if (connectedAddress) set.add(connectedAddress)
        if (user?.custodyAddress) set.add(user.custodyAddress)
        if (user?.verifiedAddresses) {
            user.verifiedAddresses.forEach(addr => set.add(addr))
        }
        return Array.from(set) as `0x${string}`[]
    }, [connectedAddress, user])

    // 1. Try frontend contract reads first
    const {
        data: contractResults,
        isLoading: isCheckingContract,
        refetch: refetchContract,
    } = useReadContracts({
        contracts: addressesToCheck.map(addr => ({
            address: ONE_WAY_ACCESS as `0x${string}`,
            abi: ACCESS_CONTRACT_ABI,
            functionName: 'checkAccess',
            args: [addr],
        })),
        query: { enabled: addressesToCheck.length > 0 }
    })

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

    // 2. Fallback to API if frontend fails (mobile compatibility)
    useEffect(() => {
        const fetchApiAccess = async () => {
            if (addressesToCheck.length === 0) return
            if (contractResults && nftResults) return // Frontend worked

            setIsCheckingApi(true)
            try {
                const response = await fetch(`/api/check-access?addresses=${addressesToCheck.join(',')}`)
                const data = await response.json()
                setApiAccess(data.oneWay)
            } catch (error) {
                console.error('API access check failed:', error)
            } finally {
                setIsCheckingApi(false)
            }
        }

        fetchApiAccess()
    }, [addressesToCheck, contractResults, nftResults])

    const hasAccess = useMemo(() => {
        // Use frontend result if available
        const contractAccess = contractResults?.some(r => r.status === 'success' && (r.result as unknown as boolean) === true)
        const nftAccess = nftResults?.some(r => r.status === 'success' && Number(r.result) > 0)
        const frontendAccess = contractAccess || nftAccess

        // Fallback to API result if frontend failed
        return frontendAccess ?? apiAccess ?? false
    }, [contractResults, nftResults, apiAccess])

    const TESTING_PAYMENT_GATE = false

    return {
        hasAccess: TESTING_PAYMENT_GATE ? false : hasAccess,
        isChecking: isCheckingContract || isCheckingNft || isCheckingApi,
        error: null,
        recheckAccess: () => {
            refetchContract()
            refetchNft()
            setApiAccess(null) // Force API refetch on next render
        },
    }
}
