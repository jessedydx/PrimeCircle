import { Card } from '@/components/ui/Card'

interface EmptyStateProps {
    title: string
    description: string
    icon?: React.ReactNode
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
    return (
        <Card className="text-center py-12">
            {icon && <div className="flex justify-center mb-4">{icon}</div>}
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
        </Card>
    )
}
