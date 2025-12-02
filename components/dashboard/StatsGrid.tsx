import { Card } from '@/components/ui/Card'
import { QualityMetrics } from '@/types/score'
import { formatNumber, formatPercentage } from '@/lib/utils'

interface StatsGridProps {
    metrics?: QualityMetrics | null
}

export function StatsGrid({ metrics }: StatsGridProps) {
    if (!metrics) return null

    const stats = [
        { label: 'Average Neynar', value: metrics.mean },
        { label: 'Median Neynar', value: metrics.median },
        { label: 'High Quality (S+A)', value: formatPercentage(metrics.highRatio) },
        { label: 'Low Quality (D)', value: formatPercentage(metrics.lowRatio) },
        { label: 'Total Following', value: formatNumber(metrics.totalFollowing) },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {stats.map((stat, index) => (
                <Card key={index} className="bg-slate-800/50">
                    <p className="text-xs text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </Card>
            ))}
        </div>
    )
}
