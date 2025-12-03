```typescript
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

    // Farcaster sends base64-encoded payload
    let event: string
    let fid: number
    let token: string | undefined
    let url: string | undefined

    // Decode the payload if it's in Farcaster's format
    if (body.payload && body.header) {
      try {
        // Decode base64 payload
        const payloadJson = JSON.parse(Buffer.from(body.payload, 'base64').toString('utf-8'))
        console.log('📦 Decoded payload:', payloadJson)
        
        // Decode header to get FID
        const headerJson = JSON.parse(Buffer.from(body.header, 'base64').toString('utf-8'))
        console.log('📋 Decoded header:', headerJson)
        
        event = payloadJson.event
        fid = headerJson.fid
        
        // Extract notification details if present
        if (payloadJson.notificationDetails) {
          token = payloadJson.notificationDetails.token
          url = payloadJson.notificationDetails.url
        }
      } catch (decodeError) {
        console.error('Failed to decode Farcaster payload:', decodeError)
        return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 })
      }
    } else {
      // Fallback for direct format (for testing)
      event = body.event
      fid = body.data?.fid
      token = body.data?.token
      url = body.data?.url
    }

    // Handle different event types
    switch (event) {
      case 'frame_added':
      case 'miniapp.add':
        console.log(`✅ User ${ fid } added PrimeCircle`)
        
        // If notification details are present, save them
        if (token && url) {
          console.log(`🔔 Saving notification token for user ${ fid }`)
          try {
            await saveNotificationToken(fid, token, url)
            console.log(`✅ Token saved to database for user ${ fid }`)
          } catch (error) {
            console.error('❌ Failed to save token:', error)
          }
        }
        break

      case 'frame_removed':
      case 'miniapp.remove':
        console.log(`❌ User ${ fid } removed PrimeCircle`)
        try {
          await removeNotificationToken(fid)
          console.log(`✅ Token removed from database`)
        } catch (error) {
          console.error('❌ Failed to remove token:', error)
        }
        break

      case 'notifications.enable':
        // Legacy format support
        if (token && url) {
          console.log(`🔔 Notifications enabled for user ${ fid }`)
          try {
            await saveNotificationToken(fid, token, url)
            console.log(`✅ Token saved to database for user ${ fid }`)
          } catch (error) {
            console.error('❌ Failed to save token:', error)
          }
        }
        break

      case 'notifications.disable':
        console.log(`🔕 Notifications disabled for user ${ fid }`)
        try {
          await removeNotificationToken(fid)
          console.log(`✅ Token removed from database`)
        } catch (error) {
          console.error('❌ Failed to remove token:', error)
        }
        break

      default:
        console.log(`❓ Unknown event: ${ event } `)
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
```
