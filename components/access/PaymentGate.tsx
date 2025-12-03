'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { Lock, Loader2, Check } from 'lucide-react'
import { PRIME_CIRCLE_ACCESS, ACCESS_CONTRACT_ABI, ACCESS_PRICE_ETH } from '@/config/contracts'

interface PaymentGateProps {
    onAccessGranted: () => void
}

export function PaymentGate({ onAccessGranted }: PaymentGateProps) {
    const [isPurchasing, setIsPurchasing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [txHash, setTxHash] = useState<string | null>(null)

    async function handlePurchase() {
        setIsPurchasing(true)
        setError(null)
        setTxHash(null)

        try {
            // Check if MetaMask is available
            if (typeof window.ethereum === 'undefined') {
                throw new Error('Please install MetaMask to continue')
            }

            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' })

            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()

            // Create contract instance
            const contract = new ethers.Contract(
                PRIME_CIRCLE_ACCESS,
                ACCESS_CONTRACT_ABI,
                signer
            )

            // Purchase access
            const tx = await contract.purchaseAccess({
                value: ethers.parseEther(ACCESS_PRICE_ETH),
            })

            setTxHash(tx.hash)

            // Wait for transaction confirmation
            await tx.wait()

            // Success - notify parent component
            onAccessGranted()
        } catch (err: any) {
            console.error('Purchase error:', err)

            // User rejected transaction
            if (err.code === 'ACTION_REJECTED') {
                setError('Transaction cancelled')
            } else if (err.message?.includes('insufficient funds')) {
                setError('Insufficient ETH balance')
            } else {
                setError(err.message || 'Failed to purchase access')
            }
        } finally {
            setIsPurchasing(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
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
                            <p className="text-sm text-red-400 text-center">{error}</p>
                        </div>
                    )}

                    {/* Transaction Hash */}
                    {txHash && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                            <p className="text-xs text-blue-400 text-center">
                                Transaction pending...
                            </p>
                        </div>
                    )}

                    {/* Purchase Button */}
                    <button
                        onClick={handlePurchase}
                        disabled={isPurchasing}
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                        {isPurchasing ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Lock className="h-5 w-5" />
                                Unlock Access - {ACCESS_PRICE_ETH} ETH
                            </>
                        )}
                    </button>

                    {/* Note */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                        Make sure you're on the Base network in MetaMask
                    </p>
                </div>
            </div>
        </div>
    )
}
