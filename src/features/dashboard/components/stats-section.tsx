import { useEffect, useState, type FC } from 'react'
import { FaWallet } from 'react-icons/fa'
import { IoStar } from 'react-icons/io5'
import { MdStadium } from 'react-icons/md'
import { PiMedalFill } from 'react-icons/pi'

import type { DashboardStats, LeaderboardEntry, StatCard } from '../types/dashboard'

import LeaderboardCard from './leaderboard-card'
import { StatsCard } from './stats-card'
import UpcomingCarousel from './upcoming-carousel'

interface StatsSectionProps {
    stats?: DashboardStats
    isPending: boolean
    leaderboardEntries?: LeaderboardEntry[]
    isLeaderboardPending: boolean
}

const StatsSection: FC<StatsSectionProps> = ({ stats, isPending, leaderboardEntries, isLeaderboardPending }) => {
    const [formattedStats, setFormattedStats] = useState<StatCard[]>([])

    useEffect(() => {
        if (stats) {
            const newStats: StatCard[] = [
                {
                    label: 'Total Points',
                    value: stats.totalScore,
                    icon: <IoStar className="fill-[#2962FF]" />,
                    cover: '#2962FF22',
                    color: '#2962FF'
                },
                {
                    label: 'Current Rank',
                    value: stats.rank,
                    icon: <PiMedalFill className="fill-[#FF6D00]" />,
                    color: '#FF6D00',
                    cover: '#FF6D0022'
                },
                {
                    label: 'Matches Played',
                    value: stats.matchPlayed,
                    icon: <MdStadium className="w-6 h-6 fill-[#2E7D32]" />,
                    cover: '#2E7D3222',
                    color: '#2E7D32'
                },
                {
                    label: 'Wallet Balance',
                    value: stats.availablePoints,
                    icon: <FaWallet className="fill-[#2962FF]" />,
                    color: '#2962FF',
                    cover: '#2962FF22'
                }
            ]
            setFormattedStats(newStats)
        }
    }, [stats])

    return (
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="w-full flex flex-col items-start justify-center space-y-1">
                    <h2 className="text-3xl font-bold font-heading">Your Performance</h2>
                    <p className="text-muted-foreground mb-8">Here's an overview of your performance metrics across different categories.</p>
                </div>
                <div className="w-full h-[70vh] md:h-[28vh] p-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {formattedStats.map((stat, index) => (
                        <StatsCard
                            key={index}
                            label={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                            color={stat.color}
                            cover={stat.cover}
                            isLoading={isPending}
                        />
                    ))}
                </div>
                <div className="w-full mt-8 grid lg:grid-cols-7 py-4 px-1 gap-2">
                    <div className="col-span-4 lg:col-span-2">
                        <LeaderboardCard
                            leaderboardEntries={leaderboardEntries}
                            isPending={isLeaderboardPending}
                        />
                    </div>
                    <div className="col-span-4 lg:col-span-5">
                        <UpcomingCarousel />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StatsSection
