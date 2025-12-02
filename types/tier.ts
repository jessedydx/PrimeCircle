export enum Tier {
    S = 'S',
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
}

export interface TierThresholds {
    S: number // >= 90
    A: number // >= 80
    B: number // >= 70
    C: number // >= 60
    D: number // < 60
}

export interface TierDistribution {
    S: number
    A: number
    B: number
    C: number
    D: number
}
