import { NextRequest, NextResponse } from 'next/server'
import { getFollowers } from '@/lib/neynar'
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
        // 1. Get followers list
        const followers = await getFollowers(parseInt(fid), limit)

        // 2. Add tier calculation to each user
        const withTiers = followers.map((user) => ({
            ...user,
            tier: getTier(user.neynar_user_score || 0),
        }))

        // 3. Track API usage (fire and forget)
        // We need user info for the stats. Since this is a public endpoint, 
        // we might not have the caller's full info easily available unless we fetch it.
        // For now, we'll try to use the first user in the list if it matches the FID,
        // or just log the FID activity.
        // Ideally, we should fetch the caller's profile, but to save API calls,
        // we will just log the FID and update counts.
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
                        followers.length
                    )
                }
            } catch (err) {
                console.error('Stats update failed', err)
            }
        })

        return NextResponse.json({ users: withTiers })
    } catch (error) {
        console.error('Error fetching followers:', error)
        return NextResponse.json({ error: 'Failed to fetch followers' }, { status: 500 })
    }
}
