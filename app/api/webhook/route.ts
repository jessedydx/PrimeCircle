import { NextRequest, NextResponse } from 'next/server'

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
                console.log(`   Token: ${token}`)
                console.log(`   URL: ${url}`)

                // TODO: Save to database
                // await saveNotificationToken(fid, token, url)

                // For now, just log it (you'll add database later)
                console.warn('⚠️  TOKEN NOT SAVED - Configure database first!')
                break

            case 'notifications.disable':
                // User disabled notifications
                console.log(`🔕 Notifications disabled for user ${body.data.fid}`)

                // TODO: Remove from database
                // await removeNotificationToken(body.data.fid)
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
