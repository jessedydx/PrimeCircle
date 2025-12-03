import { NextRequest, NextResponse } from 'next/server'
import { getNotificationToken } from '@/lib/supabase'

/**
 * Check if user has added the miniapp (has notification token)
 * Used to determine if we should show "Add to Farcaster" popup
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const fidParam = searchParams.get('fid')

        if (!fidParam) {
            return NextResponse.json({ error: 'FID required' }, { status: 400 })
        }

        const fid = parseInt(fidParam)

        // Check if user has a notification token (meaning they added the app)
        const tokenData = await getNotificationToken(fid)

        return NextResponse.json({
            hasAddedApp: !!tokenData,
            shouldShowPopup: !tokenData,
        })
    } catch (error) {
        console.error('Error checking notification status:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
