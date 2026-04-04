import { Badge } from '@/components/ui/badge'

import type { StatCard } from '../types/dashboard'

export function StatsCard({
    label,
    value,
    icon,
    cover,
    color,
    isLoading
}: StatCard & {
    isLoading: boolean
}) {
    return (
        <div
            className={'stats-card pb-2 rounded-lg shadow-lg h-full flex items-center justify-center font-body overflow-hidden'}
            style={{
                backgroundColor: color
            }}>
            <div className="bg-white w-full h-full flex flex-col items-start justify-start">
                <div className="stats-logo w-full h-2/5 sm:h-1/2 md:h-1/2 flex items-center justify-between text-base sm:text-lg md:text-2xl font-bold px-3 sm:pl-4 md:px-8">
                    <div
                        className="p-1.5 sm:p-2 rounded-sm"
                        style={{
                            backgroundColor: cover
                        }}>
                        {icon}
                    </div>
                    <div className="ml-3 text-sm sm:text-base md:text-lg font-medium">
                        <Badge
                            className="text-xs sm:text-sm md:text-md"
                            style={{
                                backgroundColor: cover,
                                color: color
                            }}>
                            {(label === 'Current Rank' && 'Leaderboard') ||
                                (label === 'Wallet Balance' && 'Wallet') ||
                                (label === 'Total Points' && 'Points') ||
                                'Overview'}
                        </Badge>
                    </div>
                </div>
                <div className="stats-content w-full h-3/5 sm:h-1/2 md:h-1/2 flex flex-col items-start justify-start py-1.5 sm:py-2 pl-3 sm:pl-4 md:pl-8">
                    <p className="text-xs sm:text-sm md:text-md font-body">{label}</p>
                    {isLoading ? (
                        <div className="w-16 h-6 bg-gray-300 rounded-md animate-pulse mt-1" />
                    ) : (
                        <p className="text-lg sm:text-2xl md:text-4xl font-bold">
                            {(label === 'Current Rank' && `#${value}`) ||
                                (label === 'Wallet Balance' && `${value} Pts`) ||
                                (label === 'Total Points' && `${value}`) ||
                                value}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
