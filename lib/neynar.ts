import { NeynarAPIClient } from '@neynar/nodejs-sdk'

// Initialize client only if API key is present (to avoid build errors)
// The check will happen at runtime when API calls are made
const apiKey = process.env.NEYNAR_API_KEY || 'dummy_key_for_build'

export const neynarClient = new NeynarAPIClient({ apiKey })

/**
 * Get all users a FID is following (enriched with scores)
 */
export async function getFollowing(fid: number) {
    let allFids: number[] = []
    let cursor: string | undefined = undefined

    try {
        // 1. Fetch all FIDs first
        do {
            const response = await neynarClient.fetchUserFollowing({ fid, limit: 100, cursor })
            const fids = response.users.map((u: any) => u.user.fid)
            allFids = [...allFids, ...fids]
            cursor = response.next?.cursor || undefined
        } while (cursor)

        // 2. Fetch details for all FIDs in bulk (to get scores)
        if (allFids.length === 0) return []
        return await getUsersBulk(allFids)
    } catch (error) {
        console.error('Error fetching following:', error)
        throw error
    }
}

/**
 * Get all followers of a FID (enriched with scores)
 */
export async function getFollowers(fid: number) {
    let allFids: number[] = []
    let cursor: string | undefined = undefined

    try {
        // 1. Fetch all FIDs first
        do {
            const response = await neynarClient.fetchUserFollowers({ fid, limit: 100, cursor })
            const fids = response.users.map((u: any) => u.user.fid)
            allFids = [...allFids, ...fids]
            cursor = response.next?.cursor || undefined
        } while (cursor)

        // 2. Fetch details for all FIDs in bulk (to get scores)
        if (allFids.length === 0) return []
        return await getUsersBulk(allFids)
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
            // Map 'score' to 'neynar_user_score' if needed (API inconsistency safety)
            // AND Normalize score: API returns 0-1 (e.g. 0.98), we need 0-100 (e.g. 98)
            const mappedUsers = response.users.map((u: any) => {
                const rawScore = u.score || u.neynar_user_score || 0
                return {
                    ...u,
                    neynar_user_score: rawScore * 100,
                }
            })
            chunks.push(...mappedUsers)
        }

        return chunks
    } catch (error) {
        console.error('Error fetching bulk users:', error)
        throw error
    }
}
