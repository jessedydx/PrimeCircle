import { NextRequest, NextResponse } from 'next/server'
import {
    saveNotificationToken,
    removeNotificationToken,
} from '@/lib/supabase'

/**
 * Webhook endpoint for Farcaster notifications
 * This receives events when users add/remove the miniapp or enable/disable notifications
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        console.log('📥 Webhook received:', body)

        // Handle different event types
        switch (body.event) {
            case 'miniapp.add':
                // User added the miniapp to Farcaster
                console.log(`✅ User ${body.data.fid} added PrimeCircle`)
                break

            case 'miniapp.remove':
                // User removed the miniapp
                console.log(`❌ User ${body.data.fid} removed PrimeCircle`)
                break

            case 'notifications.enable':
                // User enabled notifications - SAVE THE TOKEN!
                const { fid, token, url } = body.data

                console.log(`🔔 Notifications enabled for user ${fid}`)

                try {
                    await saveNotificationToken(fid, token, url)
                    console.log(`✅ Token saved to database for user ${fid}`)
                } catch (error) {
                    console.error('❌ Failed to save token:', error)
                }
                break

            case 'notifications.disable':
                // User disabled notifications
                console.log(`🔕 Notifications disabled for user ${body.data.fid}`)

                try {
                    await removeNotificationToken(body.data.fid)
                    console.log(`✅ Token removed from database`)
                } catch (error) {
                    console.error('❌ Failed to remove token:', error)
                }
                break

            default:
                console.log(`❓ Unknown event: ${body.event}`)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('❌ Webhook error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
