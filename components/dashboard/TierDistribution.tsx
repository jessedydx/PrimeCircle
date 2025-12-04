import { TierDistribution } from '@/types/tier'
import { TIER_COLORS, TIER_LABELS } from '@/config/constants'
import { Card } from '@/components/ui/Card'

interface TierDistributionProps {
    distribution?: TierDistribution | null
    score?: number
}

export function TierDistributionCard({ distribution, score }: TierDistributionProps) {
    if (!distribution) return null

    const total = Object.values(distribution).reduce((a, b) => a + b, 0)
    if (total === 0) return null

    const tiers = ['S', 'A', 'B', 'C', 'D'] as const

    return (
        <Card>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Tier Distribution</h3>
            <div className="flex w-full h-12 rounded-lg overflow-hidden">
                {tiers.map((tier) => {
                    const count = distribution[tier]
                    const percentage = (count / total) * 100

                    if (count === 0) return null

                    return (
                        <div
                            key={tier}
                            className="flex items-center justify-center text-xs font-bold text-white transition-all hover:opacity-80"
                            style={{
                                backgroundColor: TIER_COLORS[tier],
                                width: `${percentage}%`,
                            }}
                            title={`${tier}: ${count} (${percentage.toFixed(1)}%)`}
                        >
                            {percentage > 5 && tier}
                        </div>
                    )
                })}
            </div>
            <div className="grid grid-cols-5 gap-2 mt-3 text-xs">
                {tiers.map((tier) => (
                    <div key={tier} className="text-center">
                        <div className="font-bold" style={{ color: TIER_COLORS[tier] }}>
                            {tier}
                        </div>
                        <div className="text-gray-400">{distribution[tier]}</div>
                    </div>
                ))}
            </div>

            {/* Share to Farcaster Button */}
            <button
                onClick={() => {
                    const shareText = `My Follow Quality Score: ${score || 0}/100 🎯\n\nAnalyze your Farcaster network with @primecircle!\n\n✨ Check your score:`
                    const shareUrl = 'https://farcaster.xyz/miniapps/BrA6feZliVvX/primecircle'
                    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(shareUrl)}`

                    // Use SDK to open URL - handles mobile deep linking better
                    sdk.actions.openUrl(warpcastUrl)
                }}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                </svg>
                Share to Farcaster
            </button>
        </Card>
    )
}
