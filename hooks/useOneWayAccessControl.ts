'use client'

import { useReadContracts, useAccount } from 'wagmi'
import { ONE_WAY_ACCESS, ACCESS_CONTRACT_ABI } from '@/config/contracts'
import { FarcasterUser } from './useFarcasterContext'
import { useMemo, useState, useEffect, useRef } from 'react'

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

    // Calculate frontend access status
    const frontendAccess = useMemo(() => {
        const contractAccess = contractResults?.some(r => r.status === 'success' && (r.result as unknown as boolean) === true)
        const nftAccess = nftResults?.some(r => r.status === 'success' && Number(r.result) > 0)
        return contractAccess || nftAccess
    }, [contractResults, nftResults])

    // 2. Fallback to API if frontend fails or returns false (mobile compatibility)
    useEffect(() => {
        const fetchApiAccess = async () => {
            if (addressesToCheck.length === 0) return
            if (frontendAccess) return // Already have access via frontend

            // If we have results but no access, or if loading finished and no access, try API
            if (!isCheckingContract && !isCheckingNft) {
                setIsCheckingApi(true)
                try {
                    const response = await fetch(`/api/check-access?addresses=${addressesToCheck.join(',')}`)
                    const data = await response.json()
                    if (data.oneWay === true) {
                        setApiAccess(true)
                    }
                } catch (error) {
                    console.error('API access check failed:', error)
                } finally {
                    setIsCheckingApi(false)
                }
            }
        }

        fetchApiAccess()
    }, [addressesToCheck, frontendAccess, isCheckingContract, isCheckingNft])

    const hasAccess = frontendAccess || (apiAccess ?? false)

    // LAZY SYNC: If user has access on-chain but DB doesn't know, tell DB
    const syncAttempted = useRef(false)

    useEffect(() => {
        if (hasAccess && user?.fid && !syncAttempted.current) {
            // Determine source
            const contractAccess = contractResults?.some(r => r.status === 'success' && (r.result as unknown as boolean) === true)
            const source = contractAccess ? 'payment' : 'nft'

            syncAttempted.current = true
            fetch('/api/record-purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fid: user.fid,
                    type: 'one-way',
                    source
                })
            }).catch(err => console.error('Lazy sync failed', err))
        }
    }, [hasAccess, user?.fid, contractResults])

    const TESTING_PAYMENT_GATE = false

    return {
        hasAccess: TESTING_PAYMENT_GATE ? false : hasAccess,
        isChecking: isCheckingContract || isCheckingNft || isCheckingApi,
        error: null,
        recheckAccess: () => {
            refetchContract()
            refetchNft()
            setApiAccess(null)
        },
    }
}
