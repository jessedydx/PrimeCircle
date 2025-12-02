import { EnrichedFollowing } from '@/types/user'
import { Badge } from '@/components/ui/Badge'
import { ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface UserCardProps {
    user: EnrichedFollowing
    showOpportunityBadge?: boolean
}

export function UserCard({ user, showOpportunityBadge = false }: UserCardProps) {
    const warpcastUrl = `https://warpcast.com/${user.username}`

    return (
        <Card className="hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <img
                    src={user.pfp_url}
                    alt={user.display_name}
                    className="w-12 h-12 rounded-full flex-shrink-0"
                />

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white truncate">{user.display_name}</h3>
                        {showOpportunityBadge && user.neynar_user_score >= 80 && (
                            <span className="text-yellow-400 text-xs">⭐ Opportunity</span>
                        )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">@{user.username}</p>
                    <p className="text-sm mt-1">
                        <span className="text-gray-400">Neynar Score: </span>
                        <span
                            className="font-semibold"
                            style={{
                                color:
                                    user.neynar_user_score >= 80
                                        ? '#60a5fa'
                                        : user.neynar_user_score >= 60
                                            ? '#34d399'
                                            : '#f87171',
                            }}
                        >
                            {user.neynar_user_score}
                        </span>
                    </p>
                </div>

                {/* Tier Badge */}
                <div className="flex flex-col items-end gap-2">
                    <Badge tier={user.tier} />
                    <a
                        href={warpcastUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                        <span>Open</span>
                        <ExternalLink className="h-3 w-3" />
                    </a>
                </div>
            </div>
        </Card>
    )
}
