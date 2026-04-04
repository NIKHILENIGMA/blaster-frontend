import type { FC } from 'react'

import Footer from '@/components/shared/footer'
import Header from '@/components/shared/header'
import { useLeaderboardEntries } from '@/features/leaderboard/api/get-leader-board-entry'
import LeaderboardHeader from '@/features/leaderboard/components/leaderboard-header'
import LeaderboardTable from '@/features/leaderboard/components/leaderboard-table'
import Ranking from '@/features/leaderboard/components/ranking'

const LeaderboardPage: FC = () => {
    const { data: leaderboardEntries, isPending } = useLeaderboardEntries({})
    if (!leaderboardEntries) {
        return
    }

    const sortedEntries = [...leaderboardEntries].sort((a, b) => {
        if (a.rank !== b.rank) return a.rank - b.rank
        return b.totalScore - a.totalScore
    })

    const topThreeEntries = sortedEntries.slice(0, 3)
    const remainingEntries = sortedEntries.slice(3)

    return (
        <div className="min-h-screen bg-neutral-background">
            <Header />
            <main className="w-full py-8">
                <div className="max-w-6xl mx-4 md:mx-auto">
                    {/* Header */}
                    <LeaderboardHeader />

                    {/* Top 3 */}
                    <Ranking
                        entries={topThreeEntries}
                        isPending={isPending}
                    />

                    {/* Table */}
                    <LeaderboardTable
                        entries={remainingEntries}
                        isPending={isPending}
                    />
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default LeaderboardPage
