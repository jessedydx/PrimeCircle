'use client'

import { useFarcasterContext } from '@/hooks/useFarcasterContext'
import { useFollowing } from '@/hooks/useFollowing'
import { useFollowers } from '@/hooks/useFollowers'
import { UserCard } from '@/components/user-list/UserCard'
import { EmptyState } from '@/components/user-list/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { ChevronLeft, ArrowRightLeft } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'

export default function OneWayPage() {
    const { user } = useFarcasterContext()
    const { following, loading: followingLoading } = useFollowing(user?.fid)
    const { followers, loading: followersLoading } = useFollowers(user?.fid)

    const oneWayFollows = useMemo(() => {
        if (!following.length || !followers.length) return []

        const followerFids = new Set(followers.map((f) => f.fid))

        return following
            .filter((followingUser) => !followerFids.has(followingUser.fid))
            .sort((a, b) => b.neynar_user_score - a.neynar_user_score) // Highest score first
    }, [following, followers])

    const loading = followingLoading || followersLoading

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-gray-400">Analyzing one-way follows...</p>
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
                    <h1 className="text-xl font-bold text-white">One-way Follows</h1>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                {/* Description */}
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <p className="text-sm text-gray-300 mb-2">
                        You follow them, but they don't follow you back.
                    </p>
                    <p className="text-xs text-gray-400">Sorted by Neynar Score (High to Low)</p>
                </div>

                {/* Count */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                        Total One-way Follows:{' '}
                        <span className="font-semibold text-white">{oneWayFollows.length}</span>
                    </p>
                </div>

                {/* User List */}
                <div className="space-y-3">
                    {oneWayFollows.length === 0 ? (
                        <EmptyState
                            icon={<ArrowRightLeft className="h-12 w-12 text-gray-600" />}
                            title="No one-way follows"
                            description="Everyone you follow follows you back!"
                        />
                    ) : (
                        oneWayFollows.map((user) => <UserCard key={user.fid} user={user} />)
                    )}
                </div>

                {/* Footer Stat */}
                {oneWayFollows.length > 0 && (
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                        <p className="text-xs text-gray-400 text-center">
                            {oneWayFollows.filter((u) => u.neynar_user_score >= 80).length} of these accounts have
                            high quality scores (≥80)
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}
