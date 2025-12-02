'use client'

import { useFarcasterContext } from '@/hooks/useFarcasterContext'
import { useFollowing } from '@/hooks/useFollowing'
import { useFollowers } from '@/hooks/useFollowers'
import { UserCard } from '@/components/user-list/UserCard'
import { EmptyState } from '@/components/user-list/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ChevronLeft, Star } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'

export default function OpportunitiesPage() {
    const { user } = useFarcasterContext()
    const { following, loading: followingLoading } = useFollowing(user?.fid)
    const { followers, loading: followersLoading } = useFollowers(user?.fid)

    const opportunities = useMemo(() => {
        if (!following.length || !followers.length) return []

        const followingFids = new Set(following.map((f) => f.fid))

        return followers
            .filter((follower) => !followingFids.has(follower.fid))
            .map((follower) => ({
                ...follower,
                isOpportunity: follower.neynar_user_score >= 80,
            }))
            .sort((a, b) => b.neynar_user_score - a.neynar_user_score) // Highest score first
    }, [following, followers])

    const loading = followingLoading || followersLoading

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-gray-400">Finding opportunities...</p>
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
                    <h1 className="text-xl font-bold text-white">Opportunities</h1>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                {/* Description */}
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <p className="text-sm text-gray-300 mb-2">
                        These accounts follow you, but you don't follow them back.
                    </p>
                    <p className="text-sm text-gray-300 mb-2">
                        High-scoring creators may be worth exploring.
                    </p>
                    <p className="text-xs text-gray-400">Sorted by Neynar Score (High to Low)</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <p className="text-xs text-gray-400">Total Opportunities</p>
                        <p className="text-2xl font-bold text-white mt-1">{opportunities.length}</p>
                    </div>
                    <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                        <p className="text-xs text-yellow-300">High Quality (≥80)</p>
                        <p className="text-2xl font-bold text-yellow-400 mt-1">
                            {opportunities.filter((u) => u.neynar_user_score >= 80).length}
                        </p>
                    </div>
                </div>

                {/* User List */}
                <div className="space-y-3">
                    {opportunities.length === 0 ? (
                        <EmptyState
                            icon={<Star className="h-12 w-12 text-gray-600" />}
                            title="No opportunities found"
                            description="You're already following everyone who follows you!"
                        />
                    ) : (
                        opportunities.map((user) => (
                            <UserCard key={user.fid} user={user} showOpportunityBadge />
                        ))
                    )}
                </div>
            </div>
        </main>
    )
}
