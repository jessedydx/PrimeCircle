'use client'

import { useState } from 'react'
import { useFarcasterContext } from '@/hooks/useFarcasterContext'
import { useFollowing } from '@/hooks/useFollowing'
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
    const { following, loading, error } = useFollowing(user?.fid)
    const [selectedTiers, setSelectedTiers] = useState<Tier[]>([Tier.D])

    const filteredUsers = following
        .filter((u) => selectedTiers.includes(u.tier))
        .sort((a, b) => a.neynar_user_score - b.neynar_user_score) // Lowest first

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-gray-400">Loading low score follows...</p>
            </div>
        )
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

                {/* Filter */}
                <UserListFilter selectedTiers={selectedTiers} onTiersChange={setSelectedTiers} />

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
