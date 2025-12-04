import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

function getSupabase() {
    if (!supabaseInstance) {
        const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase environment variables')
        }

        supabaseInstance = createClient(supabaseUrl, supabaseKey)
    }
    return supabaseInstance
}

/**
 * Save notification token to database
 */
export async function saveNotificationToken(
    fid: number,
    token: string,
    notificationUrl: string
) {
    const supabase = getSupabase()
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
    const supabase = getSupabase()
    const { data, error } = await supabase
        .from('notification_tokens')
        .select('*')
        .eq('fid', fid)
        .maybeSingle() // Returns null if no row found, instead of throwing error

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
    const supabase = getSupabase()
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

/**
 * Update user stats (API usage tracking)
 */
export async function updateUserStats(
    fid: number,
    username: string,
    displayName: string,
    followerCount: number,
    followingCount: number,
    itemsFetched: number
) {
    const supabase = getSupabase()

    // First try to get existing stats to increment counters
    const { data: existing } = await supabase
        .from('user_stats')
        .select('api_calls, items_fetched')
        .eq('fid', fid)
        .maybeSingle()

    const currentApiCalls = (existing?.api_calls || 0) + 1
    const currentItemsFetched = (existing?.items_fetched || 0) + itemsFetched

    const { error } = await supabase
        .from('user_stats')
        .upsert({
            fid,
            username,
            display_name: displayName,
            follower_count: followerCount,
            following_count: followingCount,
            api_calls: currentApiCalls,
            items_fetched: currentItemsFetched,
            last_active: new Date().toISOString(),
        })

    if (error) {
        console.error('Error updating user stats:', error)
        // Don't throw error to avoid blocking the main app flow
    }
}

/**
 * Get all user stats for dashboard
 */
export async function getUserStats() {
    const supabase = getSupabase()

    const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .order('last_active', { ascending: false })
        .limit(100)

    if (error) {
        console.error('Error fetching user stats:', error)
        throw error
    }

    return data
}
