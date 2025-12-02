import { Card } from '@/components/ui/Card'

interface QualityScoreCardProps {
    score: number
}

export function QualityScoreCard({ score }: QualityScoreCardProps) {
    return (
        <Card className="bg-gradient-to-br from-purple-600 to-blue-500 border-0">
            <div className="text-center">
                <div className="flex items-baseline justify-center gap-2">
                    <span className="text-6xl font-bold text-white">{score}</span>
                    <span className="text-2xl text-white/80">/ 100</span>
                </div>
                <p className="text-sm text-white/60 mt-2">Follow Quality Score</p>
            </div>
        </Card>
    )
}
