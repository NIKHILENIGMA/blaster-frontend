import type { FC } from 'react'

const LeaderboardHeader: FC = () => {
    return (
        <header className="flex justify-between items-center mb-6">
            <div className="space-y-1.5">
                <p className="text-xs">
                    <span className="font-bold bg-secondary/30 text-red-800 px-1.5 py-0.5 rounded-2xl uppercase">Global Rankings</span>
                </p>
                <h1 className="text-3xl font-bold font-heading">
                    Fortune Premier League <span className="text-primary">Leaderboard</span>
                </h1>
            </div>
        </header>
    )
}

export default LeaderboardHeader
