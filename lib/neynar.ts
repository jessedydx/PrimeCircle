import { NeynarAPIClient } from '@neynar/nodejs-sdk'

// Initialize client only if API key is present (to avoid build errors)
// The check will happen at runtime when API calls are made
const apiKey = process.env.NEYNAR_API_KEY || 'dummy_key_for_build'

export const neynarClient = new NeynarAPIClient({ apiKey })

/**
 * Get all users a FID is following
 */
export async function getFollowing(fid: number) {
    let allFollowing: any[] = []
    let cursor: string | undefined = undefined

    try {
        do {
            const response = await neynarClient.fetchUserFollowing({ fid, limit: 100, cursor })

            allFollowing = [...allFollowing, ...response.users]
            cursor = response.next?.cursor || undefined
        } while (cursor)

        return allFollowing
    } catch (error) {
        console.error('Error fetching following:', error)
        throw error
    }
}

/**
 * Get all followers of a FID
 */
export async function getFollowers(fid: number) {
    let allFollowers: any[] = []
    let cursor: string | undefined = undefined

    try {
        do {
            const response = await neynarClient.fetchUserFollowers({ fid, limit: 100, cursor })

            allFollowers = [...allFollowers, ...response.users]
            cursor = response.next?.cursor || undefined
        } while (cursor)

        return allFollowers
    } catch (error) {
        console.error('Error fetching followers:', error)
        throw error
    }
}

/**
 * Get bulk user data (including Neynar scores)
 */
export async function getUsersBulk(fids: number[]) {
    const chunks: any[] = []

    try {
        // Neynar bulk endpoint: max 100 users per request
        for (let i = 0; i < fids.length; i += 100) {
            const chunk = fids.slice(i, i + 100)
            const response = await neynarClient.fetchBulkUsers({ fids: chunk })
            chunks.push(...response.users)
        }

        return chunks
    } catch (error) {
        console.error('Error fetching bulk users:', error)
        throw error
    }
}
