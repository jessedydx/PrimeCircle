'use client'

import { useEffect, useState } from 'react'

interface UserStats {
    fid: number
    username: string
    display_name: string
    follower_count: number
    following_count: number
    api_calls: number
    items_fetched: number
    last_active: string
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<UserStats[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadStats()
    }, [])

    async function loadStats() {
        try {
            const response = await fetch('/api/admin/stats')
            if (!response.ok) throw new Error('Failed to fetch stats')
            const data = await response.json()
            setStats(data as UserStats[])
        } catch (err) {
            console.error('Failed to load stats:', err)
            setError('Failed to load stats')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        Admin Dashboard
                    </h1>
                    <button
                        onClick={loadStats}
                        className="px-4 py-2 bg-slate-800 rounded hover:bg-slate-700 transition-colors text-sm"
                    >
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-800/50 text-gray-400 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4 text-center">FID</th>
                                    <th className="px-6 py-4 text-center">Followers</th>
                                    <th className="px-6 py-4 text-center">Following</th>
                                    <th className="px-6 py-4 text-center">API Calls</th>
                                    <th className="px-6 py-4 text-center">Items Fetched</th>
                                    <th className="px-6 py-4 text-right">Last Active</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {stats.map((user) => (
                                    <tr key={user.fid} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-white">{user.display_name}</span>
                                                <span className="text-gray-500">@{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono text-gray-400">
                                            {user.fid}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-300">
                                            {user.follower_count?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-300">
                                            {user.following_count?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                                                {user.api_calls}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
                                                {user.items_fetched?.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-400">
                                            {new Date(user.last_active).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {stats.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            No user activity recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
