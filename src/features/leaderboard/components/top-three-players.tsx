import { Crown, ArrowUp } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface Player {
    rank: number
    name: string
    points: number
    avatar: string
    initials: string
    medal: string
    change?: number
}

const topPlayers: Player[] = [
    {
        rank: 2,
        name: 'Luna Rivera',
        points: 8450,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
        initials: 'LR',
        medal: '🥈',
        change: -2
    },
    {
        rank: 1,
        name: 'Phoenix Elite',
        points: 9875,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Phoenix',
        initials: 'PE',
        medal: '👑',
        change: 1
    },
    {
        rank: 3,
        name: 'Nexus Prime',
        points: 7620,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nexus',
        initials: 'NP',
        medal: '🥉',
        change: 3
    }
]

export function TopThreePlayers() {
    const [, setHoveredRank] = useState<number | null>(null)

    // Reorder for display: rank 1 in middle, 2 and 3 on sides
    const displayOrder = [topPlayers[0], topPlayers[1], topPlayers[2]]

    return (
        <div className="relative -mt-20 sm:-mt-24 md:-mt-28 mb-12 px-4 z-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3 md:gap-6">
                {/* Rank 2 */}
                <div className="flex justify-center">
                    <div
                        className="transform transition-all duration-300 hover:scale-105"
                        onMouseEnter={() => setHoveredRank(2)}
                        onMouseLeave={() => setHoveredRank(null)}>
                        <Card className="w-full max-w-xs bg-gradient-to-br from-slate-700 to-slate-800 border-slate-500 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                            <div className="p-6 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="relative">
                                        <Avatar className="w-16 h-16 ring-2 ring-slate-400">
                                            <AvatarImage
                                                src={displayOrder[0].avatar}
                                                alt={displayOrder[0].name}
                                            />
                                            <AvatarFallback>{displayOrder[0].initials}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -top-1 -right-1 text-2xl">{displayOrder[0].medal}</div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">{displayOrder[0].name}</h3>
                                <Badge className="bg-slate-500 text-slate-100 mb-3">#{displayOrder[0].rank}</Badge>
                                <p className="text-2xl font-bold text-blue-300">{displayOrder[0].points.toLocaleString()}</p>
                                <p className="text-xs text-slate-300 mt-2">points</p>
                                {displayOrder[0].change && (
                                    <div className="flex items-center justify-center gap-1 mt-3">
                                        <ArrowUp className="w-4 h-4 text-green-400" />
                                        <span className="text-xs text-green-400">Up {displayOrder[0].change} spots</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Rank 1 - Bigger and Elevated */}
                <div className="flex justify-center sm:-translate-y-8 md:-translate-y-12">
                    <div
                        className="transform transition-all duration-300 hover:scale-110"
                        onMouseEnter={() => setHoveredRank(1)}
                        onMouseLeave={() => setHoveredRank(null)}>
                        <Card className="w-full max-w-xs bg-gradient-to-br from-yellow-700 via-yellow-600 to-amber-700 border-2 border-yellow-400 shadow-2xl hover:shadow-yellow-400/30 transition-all duration-300 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/15 to-transparent pointer-events-none"></div>
                            <div className="p-8 text-center relative z-10">
                                <div className="flex justify-center mb-4">
                                    <div className="relative">
                                        <Avatar className="w-20 h-20 ring-4 ring-yellow-400">
                                            <AvatarImage
                                                src={displayOrder[1].avatar}
                                                alt={displayOrder[1].name}
                                            />
                                            <AvatarFallback>{displayOrder[1].initials}</AvatarFallback>
                                        </Avatar>
                                        <Crown
                                            className="absolute -top-3 -right-2 w-8 h-8 text-yellow-300 drop-shadow-lg"
                                            fill="currentColor"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{displayOrder[1].name}</h3>
                                <Badge className="bg-yellow-500 text-yellow-50 mb-3 scale-110">#{displayOrder[1].rank}</Badge>
                                <p className="text-4xl font-bold text-yellow-200 drop-shadow-lg">{displayOrder[1].points.toLocaleString()}</p>
                                <p className="text-sm text-yellow-50 mt-2 font-semibold">points</p>
                                {displayOrder[1].change && (
                                    <div className="flex items-center justify-center gap-1 mt-4">
                                        <ArrowUp className="w-4 h-4 text-green-400" />
                                        <span className="text-sm text-green-400 font-semibold">Up {displayOrder[1].change} spot</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Rank 3 */}
                <div className="flex justify-center">
                    <div
                        className="transform transition-all duration-300 hover:scale-105"
                        onMouseEnter={() => setHoveredRank(3)}
                        onMouseLeave={() => setHoveredRank(null)}>
                        <Card className="w-full max-w-xs bg-gradient-to-br from-orange-700 to-orange-800 border-orange-500 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                            <div className="p-6 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="relative">
                                        <Avatar className="w-16 h-16 ring-2 ring-orange-500">
                                            <AvatarImage
                                                src={displayOrder[2].avatar}
                                                alt={displayOrder[2].name}
                                            />
                                            <AvatarFallback>{displayOrder[2].initials}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -top-1 -right-1 text-2xl">{displayOrder[2].medal}</div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">{displayOrder[2].name}</h3>
                                <Badge className="bg-orange-600 text-orange-100 mb-3">#{displayOrder[2].rank}</Badge>
                                <p className="text-2xl font-bold text-orange-300">{displayOrder[2].points.toLocaleString()}</p>
                                <p className="text-xs text-orange-200 mt-2">points</p>
                                {displayOrder[2].change && (
                                    <div className="flex items-center justify-center gap-1 mt-3">
                                        <ArrowUp className="w-4 h-4 text-green-400" />
                                        <span className="text-xs text-green-400">Up {displayOrder[2].change} spots</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Mobile note */}
            <div className="sm:hidden text-center mt-6 text-xs text-slate-400">Swipe to see more details</div>
        </div>
    )
}
