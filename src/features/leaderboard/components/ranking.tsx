import type { FC } from 'react'

import type { LeaderboardEntry } from '@/features/dashboard/types/dashboard'
import { formatLeaderboardName } from '@/features/leaderboard/lib/format-leaderboard-name'
import { cn } from '@/shared/lib/utils'

type RankingProps = {
    entries?: LeaderboardEntry[]
    isPending?: boolean
    currentUserId?: string
}

type TopPlayer = {
    rank: number
    name: string
    points: number
    type: 'gold' | 'silver' | 'bronze'
    avatar: string
    classes: string
    isCurrentUser: boolean
}

const styleByRank: Record<number, { type: 'gold' | 'silver' | 'bronze'; classes: string; bg: string }> = {
    1: {
        type: 'gold',
        classes:
            'h-48 lg:h-64 bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-800 rounded-t-lg flex items-start justify-center text-yellow-600 font-bold shadow-xl',
        bg: 'FFD700'
    },
    2: {
        type: 'silver',
        classes:
            'h-40 lg:h-56 bg-gradient-to-b from-gray-200 via-gray-500 to-gray-800 rounded-t-lg flex items-start justify-center text-gray-500 font-bold shadow-xl',
        bg: 'C0C0C0'
    },
    3: {
        type: 'bronze',
        classes:
            'h-36 lg:h-52 bg-gradient-to-b from-amber-200 via-amber-500 to-amber-900 rounded-t-lg flex items-start justify-center text-amber-600 font-bold shadow-lg shadow-amber-900/40',
        bg: '8B4513'
    }
}

const Ranking: FC<RankingProps> = ({ entries = [], isPending, currentUserId }) => {
    if (isPending) {
        return <section className="mb-10 rounded-xl bg-white p-6 text-center text-gray-500 shadow">Loading top players...</section>
    }

    const normalizedTopThree: TopPlayer[] = entries
        .filter((entry) => entry.rank >= 1 && entry.rank <= 3)
        .map((entry) => {
            const style = styleByRank[entry.rank]
            const name = formatLeaderboardName(entry)

            return {
                rank: entry.rank,
                name,
                points: entry.totalScore,
                type: style.type,
                classes: style.classes,
                avatar: entry.profileImage
                    ? entry.profileImage
                    : 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1775216051/Default-Men_pzwcaj.avif',
                isCurrentUser: Boolean(currentUserId && entry.userId === currentUserId)
            }
        })

    const byRank = new Map(normalizedTopThree.map((player) => [player.rank, player]))
    const displayOrder = [2, 1, 3].map((rank) => byRank.get(rank)).filter(Boolean) as TopPlayer[]

    if (displayOrder.length === 0) {
        return <section className="">No top ranking data available.</section>
    }
    return (
        <section className="mb-10 grid grid-cols-3 items-end gap-3 sm:gap-6 lg:gap-8">
            {displayOrder.map((player) => (
                <div
                    key={player.rank}
                    className={cn(
                        'relative rounded-xl px-2 pt-3 text-center',
                        player.isCurrentUser && 'bg-blue-50 ring-2 ring-blue-500/60 ring-offset-2'
                    )}>
                    <img
                        src={player.avatar}
                        alt={player.name}
                        className={cn(
                            'mx-auto h-20 w-20 rounded-full border-4 object-cover md:h-28 md:w-28 lg:h-36 lg:w-36',
                            player.type === 'gold' ? 'border-yellow-400' : player.type === 'silver' ? 'border-gray-400' : 'border-amber-400'
                        )}
                    />
                    <img
                        src={player.type === 'gold' ? './gold.png' : player.type === 'silver' ? './silver.png' : './bronze.png'}
                        alt="medal"
                        className="absolute left-[60%] top-13 h-10 w-10 -translate-x-1/2 rounded-full object-cover md:left-[59%] md:top-20 md:h-12 md:w-12 lg:top-27 lg:h-14 lg:w-14"
                    />
                    <div className="mt-3 flex min-w-0 items-center justify-center gap-2">
                        <p className="truncate text-sm font-semibold sm:text-base lg:text-xl">{player.name}</p>
                        {player.isCurrentUser ? (
                            <span className="shrink-0 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white lg:text-xs">Me</span>
                        ) : null}
                    </div>
                    <p className="text-sm font-semibold text-blue-600 lg:text-lg">{player.points.toLocaleString()} pts</p>
                    <div className={cn('mt-3', player.classes)}>
                        <p className="p-6 text-xl font-bold tracking-widest text-white/30 md:text-6xl lg:text-7xl">{player.type.toUpperCase()}</p>
                    </div>
                </div>
            ))}
        </section>
    )
}

export default Ranking
