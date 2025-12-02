import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
}

export function Card({ children, className }: CardProps) {
    return (
        <div className={cn('bg-slate-800 rounded-2xl p-6 border border-slate-700', className)}>
            {children}
        </div>
    )
}
