'use client'

import { useFarcasterContext } from '@/hooks/useFarcasterContext'
import { useFollowing } from '@/hooks/useFollowing'
import { useQualityScore } from '@/hooks/useQualityScore'
import { QualityScoreCard } from '@/components/dashboard/QualityScoreCard'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { TierDistributionCard } from '@/components/dashboard/TierDistribution'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { TrendingDown, ArrowRightLeft, Star } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
    const { user, loading: userLoading, error: userError } = useFarcasterContext()
    const { following, loading: followingLoading } = useFollowing(user?.fid)
    const qualityScore = useQualityScore(following)

    if (userLoading || followingLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-gray-400">Loading your follow quality...</p>
            </div>
        )
    }

    if (userError) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <ErrorMessage
                    message="Failed to load user data"
                    details="Make sure you're opening this from a Farcaster client like Warpcast"
                />
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-slate-900 pb-20">
            {/* Navbar */}
            <nav className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-4 py-3">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    <h1 className="text-xl font-bold text-purple-400">PrimeCircle</h1>
                    {user && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">@{user.username}</span>
                            <img src={user.pfpUrl} alt={user.username} className="w-10 h-10 rounded-full" />
                        </div>
                    )}
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                {/* Quality Score Card */}
                <QualityScoreCard score={qualityScore?.score || 0} />

                {/* Stats Grid */}
                <StatsGrid metrics={qualityScore?.metrics} />

                {/* Tier Distribution */}
                <TierDistributionCard distribution={qualityScore?.metrics?.tierDistribution} />

                {/* Navigation Cards */}
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-white">Explore Your Network</h2>

                    <Link href="/low-score">
                        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-purple-500 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-500/20 p-3 rounded-lg">
                                    <TrendingDown className="h-6 w-6 text-red-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-white">Low Score List</h3>
                                    <p className="text-sm text-gray-400">View your lowest quality follows</p>
                                </div>
                            </div>
                        </div>
                    </Link>



                    <Link href="/opportunities">
                        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-purple-500 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="bg-yellow-500/20 p-3 rounded-lg">
                                    <Star className="h-6 w-6 text-yellow-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-white">Opportunities</h3>
                                    <p className="text-sm text-gray-400">High-scoring accounts following you</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </main>
    )
}
