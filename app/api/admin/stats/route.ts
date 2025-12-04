import { NextResponse } from 'next/server'
import { getUserStats } from '@/lib/supabase'

export const dynamic = 'force-dynamic' // Ensure this is not cached statically

export async function GET() {
    try {
        const stats = await getUserStats()
        return NextResponse.json(stats)
    } catch (error) {
        console.error('Failed to fetch admin stats:', error)
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        )
    }
}
