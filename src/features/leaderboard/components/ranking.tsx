import type { FC } from 'react'

import type { LeaderboardEntry } from '@/features/dashboard/types/dashboard'
import { cn } from '@/shared/lib/utils'

type RankingProps = {
    entries?: LeaderboardEntry[]
    isPending?: boolean
}

type TopPlayer = {
    rank: number
    name: string
    points: number
    type: 'gold' | 'silver' | 'bronze'
    avatar: string
    classes: string
}

const styleByRank: Record<number, { type: 'gold' | 'silver' | 'bronze'; classes: string; bg: string }> = {
    1: {
        type: 'gold',
        classes:
            'h-48 bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-800 rounded-t-lg flex items-start justify-center text-yellow-600 font-bold shadow-xl',
        bg: 'FFD700'
    },
    2: {
        type: 'silver',
        classes:
            'h-40 bg-gradient-to-b from-gray-200 via-gray-500 to-gray-800 rounded-t-lg flex items-start justify-center text-gray-500 font-bold shadow-xl',
        bg: 'C0C0C0'
    },
    3: {
        type: 'bronze',
        classes:
            'h-36 bg-gradient-to-b from-amber-200 via-amber-500 to-amber-900 rounded-t-lg flex items-start justify-center text-amber-600 font-bold shadow-lg shadow-amber-900/40',
        bg: '8B4513'
    }
}

const Ranking: FC<RankingProps> = ({ entries = [], isPending }) => {
    if (isPending) {
        return <section className="mb-10 rounded-xl bg-white p-6 text-center text-gray-500 shadow">Loading top players...</section>
    }

    const normalizedTopThree: TopPlayer[] = entries
        .filter((entry) => entry.rank >= 1 && entry.rank <= 3)
        .map((entry) => {
            const style = styleByRank[entry.rank]
            const name = [entry.firstName, entry.lastName].filter(Boolean).join(' ').trim() || entry.username

            return {
                rank: entry.rank,
                name,
                points: entry.totalScore,
                type: style.type,
                classes: style.classes,
                avatar: entry.profileImage
                    ? entry.profileImage
                    : 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1775216051/Default-Men_pzwcaj.avif'
            }
        })

    const byRank = new Map(normalizedTopThree.map((player) => [player.rank, player]))
    const displayOrder = [2, 1, 3].map((rank) => byRank.get(rank)).filter(Boolean) as TopPlayer[]

    if (displayOrder.length === 0) {
        return <section className="">No top ranking data available.</section>
    }
    return (
        <section className="grid grid-cols-3 gap-6 items-end mb-10">
            {displayOrder.map((player) => (
                <div
                    key={player.rank}
                    className="text-center relative">
                    <img
                        src={player.avatar}
                        alt={player.name}
                        className={cn(
                            'md:w-28 md:h-28 w-20 h-20 rounded-full mx-auto border-4',
                            player.type === 'gold' ? 'border-yellow-400' : player.type === 'silver' ? 'border-gray-400' : 'border-amber-400'
                        )}
                    />
                    <img
                        src={player.type === 'gold' ? './gold.png' : player.type === 'silver' ? './silver.png' : './bronze.png'}
                        alt="medal"
                        className="w-10 h-10 absolute top-13 left-[60%] md:top-20 md:w-12 md:h-12 md:left-[59%] -translate-x-1/2 object-cover rounded-full"
                    />
                    <p className="mt-2 font-medium">{player.name}</p>
                    <p className="text-blue-600 font-semibold">{player.points.toLocaleString()} pts</p>
                    <div className={cn('mt-3', player.classes)}>
                        <p className="p-6 text-white/30 text-xl md:text-6xl tracking-widest">{player.type.toUpperCase()}</p>
                    </div>
                </div>
            ))}
        </section>
    )
}

export default Ranking
