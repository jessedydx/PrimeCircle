
import { NextRequest, NextResponse } from 'next/server'
import { recordPurchase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { fid, type, source } = body

        if (!fid || !type) {
            return NextResponse.json(
                { error: 'Missing fid or type' },
                { status: 400 }
            )
        }

        if (!['low-score', 'one-way', 'opportunities'].includes(type)) {
            return NextResponse.json(
                { error: 'Invalid purchase type' },
                { status: 400 }
            )
        }

        await recordPurchase(
            fid,
            type as 'low-score' | 'one-way' | 'opportunities',
            source as 'payment' | 'nft' // Default handled in fn if undefined
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error recording purchase:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
