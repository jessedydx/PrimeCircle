import { TierThresholds } from '@/types/tier'

export const TIER_THRESHOLDS: TierThresholds = {
    S: 90,
    A: 80,
    B: 70,
    C: 60,
    D: 0,
}

export const TIER_COLORS = {
    S: '#a78bfa', // Purple-400
    A: '#60a5fa', // Blue-400
    B: '#34d399', // Green-400
    C: '#fbbf24', // Yellow-400
    D: '#f87171', // Red-400
}

export const TIER_LABELS = {
    S: 'Legend',
    A: 'High Quality',
    B: 'Good',
    C: 'Average',
    D: 'Low Quality',
}
