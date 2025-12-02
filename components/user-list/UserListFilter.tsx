'use client'

import { Tier } from '@/types/tier'

interface UserListFilterProps {
    selectedTiers: Tier[]
    onTiersChange: (tiers: Tier[]) => void
}

export function UserListFilter({ selectedTiers, onTiersChange }: UserListFilterProps) {
    const toggleTier = (tier: Tier) => {
        if (selectedTiers.includes(tier)) {
            onTiersChange(selectedTiers.filter((t) => t !== tier))
        } else {
            onTiersChange([...selectedTiers, tier])
        }
    }

    const presets = [
        { label: 'D Only', tiers: [Tier.D] },
        { label: 'C + D', tiers: [Tier.C, Tier.D] },
        { label: 'All', tiers: [Tier.S, Tier.A, Tier.B, Tier.C, Tier.D] },
    ]

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400">Tier Filter</h3>
            <div className="flex flex-wrap gap-2">
                {presets.map((preset) => {
                    const isActive =
                        preset.tiers.length === selectedTiers.length &&
                        preset.tiers.every((tier) => selectedTiers.includes(tier))

                    return (
                        <button
                            key={preset.label}
                            onClick={() => onTiersChange(preset.tiers)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                                }`}
                        >
                            {preset.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
