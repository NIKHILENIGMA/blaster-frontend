import type { FC } from 'react'

import type { Player } from '@/features/team-builder/types/players'
import { cn } from '@/shared/lib/utils'
import { teams } from '@/features/team/constants/team'

interface PlayerSidebarCardProps {
    player: Player
    onAddPlayer: (player: Player) => void
    canAddMore: boolean
}


type TeamName = 'KKR' | 'CSK' | 'MI' | 'RCB' | 'SRH' | 'RR' | 'DC' | 'PBKS' | 'LSG' | 'GT'


const PlayerSidebarCard: FC<PlayerSidebarCardProps> = ({ player, onAddPlayer, canAddMore }) => {
    return (
        <div
            className={cn(
                'relative flex items-end justify-between p-6 rounded-2xl bg-gradient-to-b from-white via-gray-100 to-white  overflow-hidden shadow-xl',
                teams[player.iplTeam as TeamName] ? teams[player.iplTeam as TeamName].shadowColor : 'shadow-none'
            )}>
            {/* Ghost Logo */}
            <img
                src={teams[player.iplTeam as TeamName]?.teamLogoUrl}
                className="absolute right-10 opacity-10 w-72"
            />

            {/* Left Image */}
            <div className="relative z-10 w-fit">
                {/* Background */}
                <div className="p-1 rounded-2xl">
                    <img
                        src={teams[player.iplTeam as TeamName]?.bgCover}
                        alt="avatar-background"
                        className="w-40 h-52 object-cover rounded-xl"
                    />
                </div>

                {/* Avatar */}
                <div
                    className={cn(
                        'absolute inset-0 left-1/2 -translate-x-1/2 top-0',
                        'w-30 h-52 rounded-2xl overflow-hidden',
                        'ring-4 ring-white shadow-2xl'
                    )}>
                    <img
                        src={player.profileImageUrl}
                        className="w-full h-full object-cover object-top scale-100 -translate-y-2"
                    />
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 ml-6 z-10">
                <p className="text-sm text-gray-500">NAME:</p>
                <h2 className="text-4xl font-bold text-gray-900 font-heading">{player.name}</h2>

                <div className="mt-4">
                    <p className="text-sm text-gray-500">TEAM:</p>
                    <div className="flex items-center gap-2 mt-1">
                        <img
                            src={teams[player.iplTeam as TeamName]?.teamLogoUrl}
                            className="w-6 h-6"
                        />
                        <span className="font-medium">{teams[player.iplTeam as TeamName]?.name}</span>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-sm text-gray-500">ROLE:</p>
                    <span className="inline-block mt-1 px-4 py-1 rounded-full bg-gradient-to-r from-green-500 via-green-500 to-green-700 text-white text-sm font-semibold">
                        {player.role === 'Batsman' ? (
                            <span className="flex items-center space-x-1">BATSMAN</span>
                        ) : player.role === 'Bowler' ? (
                            <span className="flex items-center space-x-1">BOWLER</span>
                        ) : player.role === 'All-Rounder' ? (
                            <span className="flex items-center space-x-1"> ALL-ROUNDER</span>
                        ) : player.role === 'Wicket-Keeper' ? (
                            <span className="flex items-center space-x-1">WICKET-KEEPER</span>
                        ) : null}
                    </span>
                </div>
            </div>

            {/* Button */}
            <button
                className={cn(
                    'relative z-10 rounded-sm p-2 font-semibold cursor-pointer bg-gradient-to-r  text-white shadow-lg transition',
                    teams[player.iplTeam as TeamName]?.btnGradient ? ` ${teams[player.iplTeam as TeamName].btnGradient}` : 'bg-gray-600'
                )}
                onClick={() => onAddPlayer(player)}
                disabled={!canAddMore}>
                <span className="relative">+ Add</span>
            </button>
        </div>
    )
}

export default PlayerSidebarCard
