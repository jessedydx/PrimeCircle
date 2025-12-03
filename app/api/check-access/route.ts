import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { 
    PRIME_CIRCLE_ACCESS, 
    ONE_WAY_ACCESS, 
    OPPORTUNITIES_ACCESS,
    ACCESS_CONTRACT_ABI,
    TIME_CAPSULES_NFT 
} from '@/config/contracts'

const ERC721_ABI = [
    {
        inputs: [{ name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const

// Create a public client for reading from Base blockchain
const publicClient = createPublicClient({
    chain: base,
    transport: http(),
})

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const addressesParam = searchParams.get('addresses')

        if (!addressesParam) {
            return NextResponse.json(
                { error: 'Missing addresses parameter' },
                { status: 400 }
            )
        }

        // Parse addresses (comma-separated)
        const addresses = addressesParam.split(',').map(addr => addr.trim() as `0x${string}`)

        // Check all contracts in parallel
        const [lowScoreResults, oneWayResults, opportunitiesResults, nftResults] = await Promise.all([
            // Low Score Access
            Promise.all(
                addresses.map(address =>
                    publicClient.readContract({
                        address: PRIME_CIRCLE_ACCESS as `0x${string}`,
                        abi: ACCESS_CONTRACT_ABI,
                        functionName: 'checkAccess',
                        args: [address],
                    }).catch(() => false)
                )
            ),
            // One-Way Access
            Promise.all(
                addresses.map(address =>
                    publicClient.readContract({
                        address: ONE_WAY_ACCESS as `0x${string}`,
                        abi: ACCESS_CONTRACT_ABI,
                        functionName: 'checkAccess',
                        args: [address],
                    }).catch(() => false)
                )
            ),
            // Opportunities Access
            Promise.all(
                addresses.map(address =>
                    publicClient.readContract({
                        address: OPPORTUNITIES_ACCESS as `0x${string}`,
                        abi: ACCESS_CONTRACT_ABI,
                        functionName: 'checkAccess',
                        args: [address],
                    }).catch(() => false)
                )
            ),
            // NFT Ownership
            Promise.all(
                addresses.map(address =>
                    publicClient.readContract({
                        address: TIME_CAPSULES_NFT as `0x${string}`,
                        abi: ERC721_ABI,
                        functionName: 'balanceOf',
                        args: [address],
                    }).catch(() => BigInt(0))
                )
            ),
        ])

        // Check if any address has access
        const hasNftAccess = nftResults.some(balance => Number(balance) > 0)
        const hasLowScoreAccess = lowScoreResults.some(result => result === true) || hasNftAccess
        const hasOneWayAccess = oneWayResults.some(result => result === true) || hasNftAccess
        const hasOpportunitiesAccess = opportunitiesResults.some(result => result === true) || hasNftAccess

        return NextResponse.json({
            lowScore: hasLowScoreAccess,
            oneWay: hasOneWayAccess,
            opportunities: hasOpportunitiesAccess,
            nft: hasNftAccess,
        })
    } catch (error) {
        console.error('Access check error:', error)
        return NextResponse.json(
            { error: 'Failed to check access' },
            { status: 500 }
        )
    }
}
