import { cn } from '@/lib/utils'
import { Tier } from '@/types/tier'
import { TIER_COLORS } from '@/config/constants'

interface BadgeProps {
    tier: Tier
    className?: string
}

export function Badge({ tier, className }: BadgeProps) {
    const color = TIER_COLORS[tier]

    return (
        <span
            className={cn(
                'inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold',
                className
            )}
            style={{
                backgroundColor: `${color}20`,
                color: color,
                border: `1px solid ${color}`,
            }}
        >
            {tier}
        </span>
    )
}
