import type { FC } from 'react'

import type { LeaderboardEntry } from '@/features/dashboard/types/dashboard'

type LeaderboardTableProps = {
    entries?: LeaderboardEntry[]
    isPending?: boolean
}

const LeaderboardTable: FC<LeaderboardTableProps> = ({ entries = [], isPending = false }) => {
    if (isPending) {
        return <section className="bg-white rounded-xl shadow-2xl p-6 text-center text-gray-500">Loading leaderboard...</section>
    }

    return (
        <section className="bg-white rounded-xl shadow-2xl p-6">
            <header className="mb-6">
                <h2 className="font-heading text-2xl font-semibold">Global Challengers</h2>
            </header>

            <div className="grid grid-cols-[80px_1fr_140px] items-center text-md uppercase text-black/80 font-heading font-semibold border-b border-gray-200 pb-3">
                <span>Rank</span>
                <span>Player</span>
                <span className="text-right">Points</span>
            </div>

            <div className="divide-y divide-gray-200">
                {entries.length > 0 ? (
                    entries.map((player) => {
                        const fullName = [player.firstName, player.lastName].filter(Boolean).join(' ').trim() || player.username
                        const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.username)}&background=0D8ABC&color=fff&size=128`

                        return (
                            <div
                                key={player.username}
                                className="grid grid-cols-[80px_1fr_140px] items-center py-4 text-md transition-colors hover:bg-gray-50">
                                <div className="font-semibold text-gray-700">#{player.rank}</div>

                                <div className="flex items-center gap-3 min-w-0">
                                    <img
                                        src={avatar}
                                        alt={fullName}
                                        className="w-10 h-10 rounded-full object-cover shrink-0"
                                    />

                                    <div className="min-w-0">
                                        <p className="font-medium truncate">{fullName}</p>
                                        <p className="text-xs text-gray-500 truncate">@{player.username}</p>
                                    </div>
                                </div>

                                <div className="text-right font-bold text-blue-600">{player.totalScore.toLocaleString()}</div>
                            </div>
                        )
                    })
                ) : (
                    <p className="py-6 text-sm text-gray-500">No additional leaderboard entries.</p>
                )}
            </div>
        </section>
    )
}

export default LeaderboardTable
