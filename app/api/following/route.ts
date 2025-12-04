import { NextRequest, NextResponse } from 'next/server'
import { getFollowing } from '@/lib/neynar'
import { getTier } from '@/lib/tiers'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const fid = searchParams.get('fid')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam) : 500

    if (!fid) {
        return NextResponse.json({ error: 'FID is required' }, { status: 400 })
    }

    try {
        // 1. Get following list
        const following = await getFollowing(parseInt(fid), limit)

        // 2. Add tier calculation to each user
        const withTiers = following.map((user) => ({
            ...user,
            tier: getTier(user.neynar_user_score || 0),
        }))

        // 3. Track API usage (fire and forget)
        import('@/lib/supabase').then(async ({ updateUserStats }) => {
            try {
                // Fetch user details to populate dashboard correctly
                const { getUsersBulk } = await import('@/lib/neynar')
                const users = await getUsersBulk([parseInt(fid)])
                const user = users[0]

                if (user) {
                    updateUserStats(
                        user.fid,
                        user.username,
                        user.display_name,
                        user.follower_count,
                        user.following_count,
                        following.length
                    )
                }
            } catch (err) {
                console.error('Stats update failed', err)
            }
        })

        return NextResponse.json({ users: withTiers })
    } catch (error) {
        console.error('Error fetching following:', error)
        return NextResponse.json({ error: 'Failed to fetch following' }, { status: 500 })
    }
}
