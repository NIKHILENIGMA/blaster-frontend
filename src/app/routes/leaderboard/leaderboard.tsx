import { useUser } from '@clerk/clerk-react'
import { useState, type FC } from 'react'

import { useLeaderboardEntries } from '@/features/leaderboard/api/get-leader-board-entry'
import LeaderboardHeader from '@/features/leaderboard/components/leaderboard-header'
import LeaderboardTable from '@/features/leaderboard/components/leaderboard-table'
import Ranking from '@/features/leaderboard/components/ranking'

const LeaderboardPage: FC = () => {
    const { user } = useUser()
    const { data: leaderboardEntries, isPending } = useLeaderboardEntries({})
    const [showScoreboard] = useState(false)
    const currentUserId = user?.id

    const sortedEntries = [...(leaderboardEntries ?? [])].sort((a, b) => {
        if (a.rank !== b.rank) return a.rank - b.rank
        return b.totalScore - a.totalScore
    })

    const topThreeEntries = sortedEntries.slice(0, 3)
    const remainingEntries = sortedEntries.slice(3)

    return (
        <div className="min-h-screen bg-neutral-background">
            <main className="w-full py-8 lg:py-10">
                <div className="mx-4 max-w-7xl md:mx-8 xl:mx-auto">
                    {/* Header */}
                    <LeaderboardHeader />

                    {showScoreboard ? (
                        <>
                            {/* Top 3 */}
                            <Ranking
                                entries={topThreeEntries}
                                isPending={isPending}
                                currentUserId={currentUserId}
                            />

                            {/* Table */}
                            <LeaderboardTable
                                entries={remainingEntries}
                                isPending={isPending}
                                currentUserId={currentUserId}
                            />
                        </>
                    ) : (
                        <section className="rounded-xl bg-white px-6 py-16 text-center shadow-2xl">
                            <p className="text-xl font-semibold text-gray-800 sm:text-2xl">
                                Results will be announced at the winning ceremony stay toon
                            </p>
                        </section>
                    )}
                </div>
            </main>
        </div>
    )
}

export default LeaderboardPage
