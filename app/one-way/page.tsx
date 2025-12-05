'use client'

import { useMemo } from 'react'
import { useFarcasterContext } from '@/hooks/useFarcasterContext'
import { useFollowing } from '@/hooks/useFollowing'
import { useFollowers } from '@/hooks/useFollowers'
import { useOneWayAccessControl } from '@/hooks/useOneWayAccessControl'
import { OneWayPaymentGate } from '@/components/access/OneWayPaymentGate'
import { UserCard } from '@/components/user-list/UserCard'
import { EmptyState } from '@/components/user-list/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { ChevronLeft, ArrowRightLeft } from 'lucide-react'
import Link from 'next/link'

export default function OneWayPage() {
    const { user } = useFarcasterContext()
    const { hasAccess, isChecking, recheckAccess } = useOneWayAccessControl(user)
    const { following, loading: followingLoading } = useFollowing(user?.fid, { enabled: hasAccess })
    const { followers, loading: followersLoading } = useFollowers(user?.fid, { enabled: hasAccess })

    const oneWayFollows = useMemo(() => {
        if (!following.length || !followers.length) return []

        const followerFids = new Set(followers.map((f) => f.fid))

        return following
            .filter((followingUser) => !followerFids.has(followingUser.fid))
            .sort((a, b) => b.neynar_user_score - a.neynar_user_score)
    }, [following, followers])

    const loading = followingLoading || followersLoading

    // Show loading while checking access or loading data
    if (isChecking || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-gray-400">
                    {isChecking ? 'Checking access...' : 'Analyzing one-way follows...'}
                </p>
            </div>
        )
    }

    // Show payment gate if no access
    if (!hasAccess) {
        return <OneWayPaymentGate onAccessGranted={recheckAccess} />
    }

    return (
        <main className="min-h-screen bg-slate-900 pb-20">
            <nav className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-4 py-3">
                <div className="flex items-center gap-3 max-w-2xl mx-auto">
                    <Link href="/">
                        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                            <ChevronLeft className="h-5 w-5 text-gray-400" />
                        </button>
                    </Link>
                    <h1 className="text-xl font-bold text-white">One-way Follows</h1>
                    <div className="ml-auto">
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                            Premium
                        </span>
                    </div>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <p className="text-sm text-gray-300 mb-2">
                        You follow them, but they don't follow you back.
                    </p>
                    <p className="text-xs text-gray-400">Sorted by Neynar Score (High to Low)</p>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                        Total One-way Follows:{' '}
                        <span className="font-semibold text-white">{oneWayFollows.length}</span>
                    </p>
                </div>

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
