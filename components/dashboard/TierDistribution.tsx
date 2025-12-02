import { TierDistribution } from '@/types/tier'
import { TIER_COLORS, TIER_LABELS } from '@/config/constants'
import { Card } from '@/components/ui/Card'

interface TierDistributionProps {
    distribution?: TierDistribution | null
}

export function TierDistributionCard({ distribution }: TierDistributionProps) {
    if (!distribution) return null

    const total = Object.values(distribution).reduce((a, b) => a + b, 0)
    if (total === 0) return null

    const tiers = ['S', 'A', 'B', 'C', 'D'] as const

    return (
        <Card>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Tier Distribution</h3>
            <div className="w-[80%] mx-auto">
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
            </div>
        </Card>
    )
}
