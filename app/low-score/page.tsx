'use client'

import { useState } from 'react'
import { useFarcasterContext } from '@/hooks/useFarcasterContext'
import { useFollowing } from '@/hooks/useFollowing'
import { useAccessControl } from '@/hooks/useAccessControl'
import { PaymentGate } from '@/components/access/PaymentGate'
import { UserCard } from '@/components/user-list/UserCard'
import { UserListFilter } from '@/components/user-list/UserListFilter'
import { EmptyState } from '@/components/user-list/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { ChevronLeft, AlertTriangle, TrendingDown } from 'lucide-react'
import { Tier } from '@/types/tier'
import Link from 'next/link'

export default function LowScorePage() {
    const { user } = useFarcasterContext()
    const { hasAccess, isChecking, recheckAccess } = useAccessControl(user)
    const { following, loading, error } = useFollowing(user?.fid, { enabled: hasAccess })
    const [selectedTiers, setSelectedTiers] = useState<Tier[]>([Tier.D])
    const [searchQuery, setSearchQuery] = useState('')

    const filteredUsers = following
        .filter((u) => {
            // Filter by tier
            if (!selectedTiers.includes(u.tier)) return false

            // Filter by search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                return (
                    u.username.toLowerCase().includes(query) ||
                    u.display_name?.toLowerCase().includes(query)
                )
            }

            return true
        })
        .sort((a, b) => a.neynar_user_score - b.neynar_user_score) // Lowest first

    // Show loading while checking access
    if (isChecking || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-gray-400">
                    {isChecking ? 'Checking access...' : 'Loading low score follows...'}
                </p>
            </div>
        )
    }

    // Show payment gate if no access
    if (!hasAccess) {
        return <PaymentGate onAccessGranted={recheckAccess} />
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <ErrorMessage message="Failed to load following data" />
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-slate-900 pb-20">
            {/* Navbar */}
            <nav className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-4 py-3">
                <div className="flex items-center gap-3 max-w-2xl mx-auto">
                    <Link href="/">
                        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                            <ChevronLeft className="h-5 w-5 text-gray-400" />
                        </button>
                    </Link>
                    <h1 className="text-xl font-bold text-white">Low Score List</h1>
                    <div className="ml-auto">
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                            Premium
                        </span>
                    </div>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                {/* Description */}
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <p className="text-sm text-gray-300">
                        These are the creators you follow with the lowest Neynar scores. Reviewing this list
                        may help you clean up your feed.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by username..."
                            className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg leading-5 bg-slate-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter */}
                    <UserListFilter selectedTiers={selectedTiers} onTiersChange={setSelectedTiers} />
                </div>

                {/* Count */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                        Showing <span className="font-semibold text-white">{filteredUsers.length}</span> users
                    </p>
                </div>

                {/* User List */}
                <div className="space-y-3">
                    {filteredUsers.length === 0 ? (
                        <EmptyState
                            icon={<TrendingDown className="h-12 w-12 text-gray-600" />}
                            title="No low score follows found"
                            description="All your follows have good quality scores!"
                        />
                    ) : (
                        filteredUsers.map((user) => <UserCard key={user.fid} user={user} />)
                    )}
                </div>

                {/* Warning Footer */}
                {filteredUsers.length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-yellow-300 font-medium">Ethical Reminder</p>
                                <p className="text-xs text-yellow-200/70 mt-1">
                                    This list is for guidance only. Unfollow decisions are entirely up to you.
                                    Everyone deserves respect regardless of their score.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
