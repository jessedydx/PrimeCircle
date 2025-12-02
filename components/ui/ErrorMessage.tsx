import { AlertTriangle } from 'lucide-react'

interface ErrorMessageProps {
    message: string
    details?: string
}

export function ErrorMessage({ message, details }: ErrorMessageProps) {
    return (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
            <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-red-400 font-medium">{message}</p>
                    {details && <p className="text-red-300/70 text-sm mt-1">{details}</p>}
                </div>
            </div>
        </div>
    )
}
