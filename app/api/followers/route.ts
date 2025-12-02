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

        return NextResponse.json({ users: withTiers })
    } catch (error) {
        console.error('Error fetching followers:', error)
        return NextResponse.json({ error: 'Failed to fetch followers' }, { status: 500 })
    }
}
