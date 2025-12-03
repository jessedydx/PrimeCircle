'use client'

import { useEffect } from 'react'
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { Lock, Loader2, Check } from 'lucide-react'
import { OPPORTUNITIES_ACCESS, ACCESS_CONTRACT_ABI, OPPORTUNITIES_PRICE_ETH } from '@/config/contracts'

interface OpportunitiesPaymentGateProps {
    onAccessGranted: () => void
}

export function OpportunitiesPaymentGate({ onAccessGranted }: OpportunitiesPaymentGateProps) {
    const { isConnected, address } = useAccount()
    const { connect, connectors } = useConnect()
    const { data: hash, writeContract, isPending, error } = useWriteContract()

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    useEffect(() => {
        if (!isConnected && connectors[0]) {
            connect({ connector: connectors[0] })
        }
    }, [isConnected, connectors, connect])

    useEffect(() => {
        if (isSuccess) {
            onAccessGranted()
        }
    }, [isSuccess, onAccessGranted])

    function handlePurchase() {
        writeContract({
            address: OPPORTUNITIES_ACCESS as `0x${string}`,
            abi: ACCESS_CONTRACT_ABI,
            functionName: 'purchaseAccess',
            value: parseEther(OPPORTUNITIES_PRICE_ETH),
        })
    }

    const isProcessing = isPending || isConfirming

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-500/20 p-4 rounded-full">
                            <Lock className="h-12 w-12 text-green-400" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white text-center mb-2">
                        Premium Feature
                    </h2>

                    <p className="text-gray-400 text-center mb-8">
                        Discover growth opportunities
                    </p>

                    <div className="bg-slate-900 rounded-lg p-6 mb-6 border border-slate-700">
                        <div className="text-center">
                            <p className="text-sm text-gray-400 mb-2">One-time payment</p>
                            <p className="text-4xl font-bold text-white">
                                {OPPORTUNITIES_PRICE_ETH} <span className="text-xl text-gray-400">ETH</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-2">~$2.50 USD</p>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <p className="text-sm text-gray-300">Find high-quality followers</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <p className="text-sm text-gray-300">Sorted by engagement score</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <p className="text-sm text-gray-300">Lifetime access</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                            <p className="text-sm text-red-400 text-center">
                                {error.message?.includes('rejected') ? 'Transaction cancelled' : error.message}
                            </p>
                        </div>
                    )}

                    {hash && isConfirming && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
                            <p className="text-xs text-green-400 text-center">
                                Transaction confirming...
                            </p>
                        </div>
                    )}

                    {!isConnected ? (
                        <button
                            onClick={() => connect({ connector: connectors[0] })}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <Lock className="h-5 w-5" />
                            Connect Wallet
                        </button>
                    ) : (
                        <button
                            onClick={handlePurchase}
                            disabled={isProcessing}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    {isConfirming ? 'Confirming...' : 'Processing...'}
                                </>
                            ) : (
                                <>
                                    <Lock className="h-5 w-5" />
                                    Unlock Access - {OPPORTUNITIES_PRICE_ETH} ETH
                                </>
                            )}
                        </button>
                    )}

                    <p className="text-xs text-gray-500 text-center mt-4">
                        Using Farcaster Wallet on Base Network
                    </p>
                </div>
            </div>
        </div>
    )
}
