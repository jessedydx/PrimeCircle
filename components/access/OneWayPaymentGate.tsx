'use client'

import { useEffect } from 'react'
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { Lock, Loader2, Check } from 'lucide-react'
import { ONE_WAY_ACCESS, ACCESS_CONTRACT_ABI, ONE_WAY_PRICE_ETH } from '@/config/contracts'

interface OneWayPaymentGateProps {
    onAccessGranted: () => void
}

export function OneWayPaymentGate({ onAccessGranted }: OneWayPaymentGateProps) {
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
            address: ONE_WAY_ACCESS as `0x${string}`,
            abi: ACCESS_CONTRACT_ABI,
            functionName: 'purchaseAccess',
            value: parseEther(ONE_WAY_PRICE_ETH),
        })
    }

    const isProcessing = isPending || isConfirming

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-500/20 p-4 rounded-full">
                            <Lock className="h-12 w-12 text-blue-400" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white text-center mb-2">
                        Premium Feature
                    </h2>

                    <p className="text-gray-400 text-center mb-8">
                        Access One-Way Follows analysis
                    </p>

                    <div className="bg-slate-900 rounded-lg p-6 mb-6 border border-slate-700">
                        <div className="text-center">
                            <p className="text-sm text-gray-400 mb-2">One-time payment</p>
                            <p className="text-4xl font-bold text-white">
                                {ONE_WAY_PRICE_ETH} <span className="text-xl text-gray-400">ETH</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-2">~$3.50 USD</p>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <p className="text-sm text-gray-300">See who doesn't follow back</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <p className="text-sm text-gray-300">Sorted by quality score</p>
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
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                            <p className="text-xs text-blue-400 text-center">
                                Transaction confirming...
                            </p>
                        </div>
                    )}

                    {!isConnected ? (
                        <button
                            onClick={() => connect({ connector: connectors[0] })}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <Lock className="h-5 w-5" />
                            Connect Wallet
                        </button>
                    ) : (
                        <button
                            onClick={handlePurchase}
                            disabled={isProcessing}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    {isConfirming ? 'Confirming...' : 'Processing...'}
                                </>
                            ) : (
                                <>
                                    <Lock className="h-5 w-5" />
                                    Unlock Access - {ONE_WAY_PRICE_ETH} ETH
                                </>
                            )}
                        </button>
                    )}

                    <p className="text-xs text-gray-500 text-center mt-4">
                        Using Farcaster Wallet on Base Network
                    </p>

                    {/* DEBUG INFO - REMOVE IN PRODUCTION */}
                    <div className="mt-8 p-4 bg-black/50 rounded-lg text-xs font-mono text-gray-400 overflow-hidden">
                        <p className="font-bold text-gray-300 mb-2">🔍 Debug Info (One-Way):</p>
                        <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
                        <p>Address: {address || 'None'}</p>
                        <p>Chain ID: {chainId || 'Unknown'}</p>
                        <p>Contract: {ONE_WAY_ACCESS}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
