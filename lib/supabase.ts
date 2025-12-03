import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Save notification token to database
 */
export async function saveNotificationToken(
    fid: number,
    token: string,
    notificationUrl: string
) {
    const { data, error } = await supabase
        .from('notification_tokens')
        .upsert(
            {
                fid,
                token,
                notification_url: notificationUrl,
            },
            {
                onConflict: 'token',
            }
        )

    if (error) {
        console.error('Error saving notification token:', error)
        throw error
    }

    return data
}

/**
 * Get notification token for a user
 */
export async function getNotificationToken(fid: number) {
    const { data, error } = await supabase
        .from('notification_tokens')
        .select('*')
        .eq('fid', fid)
        .single()

    if (error) {
        console.error('Error getting notification token:', error)
        return null
    }

    return data
}

/**
 * Remove notification token (when user disables notifications)
 */
export async function removeNotificationToken(fid: number) {
    const { error } = await supabase
        .from('notification_tokens')
        .delete()
        .eq('fid', fid)

    if (error) {
        console.error('Error removing notification token:', error)
        throw error
    }
}

/**
 * Send notification to a user
 */
export async function sendNotification(fid: number, message: string) {
    const tokenData = await getNotificationToken(fid)

    if (!tokenData) {
        console.warn(`No notification token found for FID ${fid}`)
        return
    }

    const response = await fetch(tokenData.notification_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            notificationId: crypto.randomUUID(),
            title: 'PrimeCircle',
            body: message,
            targetUrl: 'https://prime-circle.vercel.app',
            tokens: [tokenData.token],
        }),
    })

    if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.statusText}`)
    }

    return response.json()
}
