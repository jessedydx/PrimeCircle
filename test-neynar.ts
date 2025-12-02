import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function test() {
    try {
        console.log('Testing getFollowing...')
        // Dynamic import ensures env vars are loaded before client init
        const { neynarClient } = await import('./lib/neynar')

        // Use a known FID (e.g., dwr = 3)
        const fid = 3
        console.log('Fetching following for FID:', fid)
        const response = await neynarClient.fetchUserFollowing({ fid, limit: 1 })
        console.log('Response users length:', response.users.length)
        if (response.users.length > 0) {
            console.log('First user object keys:', Object.keys(response.users[0]))
            console.log('First user object:', JSON.stringify(response.users[0], null, 2))
        }
    } catch (error) {
        console.error('Test failed:', error)
    }
}

test()
