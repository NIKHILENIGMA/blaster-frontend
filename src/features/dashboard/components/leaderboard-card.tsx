import { useEffect, useState } from 'react'
import { PiMedalFill } from 'react-icons/pi'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import type { LeaderboardDTO, LeaderboardEntry } from '../types/dashboard'

interface LeaderboardCardProps {
    leaderboardEntries?: LeaderboardEntry[]
    isPending: boolean
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ leaderboardEntries, isPending }) => {
    const navigate = useNavigate()
    const [formattedEntries, setFormattedEntries] = useState<LeaderboardDTO[]>([])

    useEffect(() => {
        if (leaderboardEntries) {
            const topEntries = leaderboardEntries.map((entry) => ({
                rank: entry.rank,
                firstName: entry.firstName,
                lastName: entry.lastName,
                username: entry.username,
                totalScore: entry.totalScore,
                color: entry.rank === 1 ? '#FFD700' : entry.rank === 2 ? '#C0C0C0' : '#8B4513',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.username)}&background=${entry.rank === 1 ? 'FFD700' : entry.rank === 2 ? 'C0C0C0' : '8B4513'}&color=fff&size=128`
            }))
            setFormattedEntries(topEntries)
        }
    }, [leaderboardEntries])

    return (
        <Card className="bg-white shadow-3xl border-none px-5 sm:p-4 md:p-6 lg:px-8">
            <div className="flex flex-row items-start sm:items-center justify-between gap-3 mb-3 md:py-1">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-heading">Top Players</h2>
                <button className="w-fit sm:w-auto bg-[#2E7D3212] text-[#238128] text-xs uppercase px-2.5 py-1 font-semibold font-body rounded-2xl">
                    Global
                </button>
            </div>

            <div className="w-full py-1 sm:py-2 rounded-lg mb-3 space-y-3 sm:space-y-4">
                {isPending === false && formattedEntries.length !== 0 ? (
                    formattedEntries.map((entry, index) => (
                        <div
                            key={index}
                            className="card-item w-full flex items-center gap-2 sm:gap-3 rounded-lg px-1 py-1">
                            <div className="shrink-0">
                                {entry.avatar ? (
                                    <img
                                        src={entry.avatar}
                                        alt={entry.username}
                                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover border-2 sm:border-3 shadow-sm"
                                        style={{
                                            borderColor: entry.color
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white font-bold"
                                        style={{
                                            backgroundColor: entry.color
                                        }}>
                                        {entry.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="text-sm sm:text-base md:text-md font-medium font-heading truncate">{entry.username}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground font-body">{entry.totalScore} Pts</p>
                                </div>
                                <PiMedalFill
                                    className="text-lg sm:text-xl shrink-0"
                                    style={{ color: entry.color }}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm sm:text-base md:text-md text-muted-foreground font-body">No leaderboard data available.</p>
                )}
            </div>
            <Button
                variant="outline"
                onClick={() => navigate('/leaderboard')}
                className="w-full md:w-auto text-sm sm:text-base">
                View Full Leaderboard
            </Button>
        </Card>
    )
}

export default LeaderboardCard
