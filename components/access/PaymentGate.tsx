'use client'

import { useEffect } from 'react'
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { parseEther } from 'viem'
import { Lock, Loader2, Check, X } from 'lucide-react'
import { PRIME_CIRCLE_ACCESS, ACCESS_CONTRACT_ABI, ACCESS_PRICE_ETH } from '@/config/contracts'
import Link from 'next/link'
import { useFarcasterContext } from '@/hooks/useFarcasterContext'

interface PaymentGateProps {
    onAccessGranted: () => void
}

export function PaymentGate({ onAccessGranted }: PaymentGateProps) {
    const { isConnected, address } = useAccount()
    const { connect, connectors } = useConnect()
    const { data: hash, writeContract, isPending, error } = useWriteContract()

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    const chainId = useChainId()

    // Auto-connect Farcaster wallet on mount
    useEffect(() => {
        if (!isConnected && connectors[0]) {
            connect({ connector: connectors[0] })
        }
    }, [isConnected, connectors, connect])

    const { user } = useFarcasterContext()

    // Call onAccessGranted when transaction succeeds
    useEffect(() => {
        if (isSuccess) {
            // Record purchase in database (fire and forget)
            if (user?.fid) {
                fetch('/api/record-purchase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fid: user.fid,
                        type: 'low-score'
                    })
                }).catch(err => console.error('Failed to record purchase', err))
            }
            onAccessGranted()
        }
    }, [isSuccess, onAccessGranted, user?.fid])

    function handlePurchase() {
        writeContract({
            address: PRIME_CIRCLE_ACCESS as `0x${string}`,
            abi: ACCESS_CONTRACT_ABI,
            functionName: 'purchaseAccess',
            value: parseEther(ACCESS_PRICE_ETH),
        })
    }

    const isProcessing = isPending || isConfirming

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl relative">
                    {/* Close Button */}
                    <Link href="/">
                        <button className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </Link>

                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-purple-500/20 p-4 rounded-full">
                            <Lock className="h-12 w-12 text-purple-400" />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-white text-center mb-2">
                        Premium Feature
                    </h2>

                    {/* Description */}
                    <p className="text-gray-400 text-center mb-8">
                        Access the Low Score List and other premium features
                    </p>

                    {/* Price */}
                    <div className="bg-slate-900 rounded-lg p-6 mb-6 border border-slate-700">
                        <div className="text-center">
                            <p className="text-sm text-gray-400 mb-2">One-time payment</p>
                            <p className="text-4xl font-bold text-white">
                                {ACCESS_PRICE_ETH} <span className="text-xl text-gray-400">ETH</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-2">~$1.30 USD</p>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <p className="text-sm text-gray-300">Access Low Score List</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <p className="text-sm text-gray-300">Lifetime access</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <p className="text-sm text-gray-300">Future premium features</p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                            <p className="text-sm text-red-400 text-center">
                                {error.message?.includes('rejected') ? 'Transaction cancelled' : error.message}
                            </p>
                        </div>
                    )}

                    {/* Transaction Hash */}
                    {hash && isConfirming && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                            <p className="text-xs text-blue-400 text-center">
                                Transaction confirming...
                            </p>
                        </div>
                    )}

                    {/* Purchase Button */}
                    {!isConnected ? (
                        <button
                            onClick={() => connect({ connector: connectors[0] })}
                            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <Lock className="h-5 w-5" />
                            Connect Wallet
                        </button>
                    ) : (
                        <button
                            onClick={handlePurchase}
                            disabled={isProcessing}
                            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    {isConfirming ? 'Confirming...' : 'Processing...'}
                                </>
                            ) : (
                                <>
                                    <Lock className="h-5 w-5" />
                                    Unlock Access - {ACCESS_PRICE_ETH} ETH
                                </>
                            )}
                        </button>
                    )}

                    {/* Note */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                        Using Farcaster Wallet on Base Network
                    </p>

                    {/* DEBUG INFO - REMOVE IN PRODUCTION */}
                    <div className="mt-8 p-4 bg-black/50 rounded-lg text-xs font-mono text-gray-400 overflow-hidden">
                        <p className="font-bold text-gray-300 mb-2">🔍 Debug Info:</p>
                        <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
                        <p>Address: {address || 'None'}</p>
                        <p>Chain ID: {chainId || 'Unknown'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
