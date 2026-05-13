import type { FC } from 'react'
import { FaPlaneUp } from 'react-icons/fa6'

import { Label } from '@/components/ui/label'
import { cn } from '@/shared/lib/utils'

import type { Player } from '../../types/players'
import { teams } from '@/features/team/constants/team'
import { teamNameGenerator } from '@/features/team/util/team-name-generator'

interface PlayerSidebarItemProps {
    player: Player
    onAddPlayer: (player: Player) => void
    onRemovePlayer: (playerId: string) => void
    isSelected: boolean
    canAddMore: boolean
}


type TeamName = 'KKR' | 'CSK' | 'MI' | 'RCB' | 'SRH' | 'RR' | 'DC' | 'PBKS' | 'LSG' | 'GT'



const PlayerSidebarItem: FC<PlayerSidebarItemProps> = ({ player, onAddPlayer, onRemovePlayer, isSelected, canAddMore }) => {
    return (
        <div
            className={cn(
                'relative flex min-h-44 items-end justify-between gap-3 overflow-hidden rounded-xl bg-gradient-to-b from-white via-gray-100 to-white p-3 shadow-[0px_7px_11px_-7px_rgba(0,_0,_0,_0.1)] sm:p-4',
                teams[player.iplTeam as TeamName] ? teams[player.iplTeam as TeamName].shadowColor : 'shadow-none'
            )}>
            {/* Ghost Logo */}
            <img
                src={teams[player.iplTeam as TeamName]?.teamLogoUrl}
                className="absolute right-2 top-4 w-40 opacity-10 sm:right-6 sm:w-52"
            />

            <div className="absolute left-2 top-2 z-20 text-sm">
                {player.isOverseas ? (
                    <span className="flex rotate-45 items-center gap-1 rounded-full bg-yellow-500 p-2.5 text-black">
                        <FaPlaneUp />
                    </span>
                ) : null}
            </div>
            <div className="absolute right-3 top-3 z-20 text-right text-xs text-gray-500">
                <Label className="text-[10px] uppercase">Points</Label>
                {player.cost ? (
                    <span className="block rounded-full text-xl font-extrabold text-black">{player.cost}</span>
                ) : null}
            </div>
            {/* Left Image */}
            <div className="relative z-10 w-fit shrink-0">
                {/* Background */}
                <div className="p-1 rounded-2xl">
                    <img
                        src={teams[player.iplTeam as TeamName]?.bgCover}
                        alt="avatar-background"
                        className="h-36 w-24 rounded-lg object-cover sm:h-40 sm:w-28"
                    />
                </div>

                {/* Avatar */}
                <div
                    className={cn(
                        'absolute inset-0 left-1/2 -translate-x-1/2 top-0',
                        'h-36 w-20 overflow-hidden rounded-xl sm:h-40 sm:w-24',
                        'ring-2 ring-white shadow-xl'
                    )}>
                    <img
                        src={player.profileImageUrl}
                        className="w-full h-full object-cover object-top scale-100 -translate-y-2"
                    />
                </div>
            </div>

            {/* Info */}
            <div className="z-10 min-w-0 flex-1 pb-11">
                <p className="text-xs text-gray-500">NAME:</p>
                <h2 className="line-clamp-2 pr-12 font-heading text-xl font-bold leading-tight text-gray-900 sm:text-2xl">{player.name}</h2>

                <div className="mt-2">
                    <p className="text-xs text-gray-500">TEAM:</p>
                    <div className="flex items-center gap-2 mt-1">
                        <img
                            src={teams[player.iplTeam as TeamName]?.teamLogoUrl}
                            className="h-5 w-5 shrink-0"
                        />
                        <span className="truncate text-sm font-medium">{teamNameGenerator(player.iplTeam as TeamName)}</span>
                    </div>
                </div>

                <div className="mt-2">
                    <p className="text-xs text-gray-500">ROLE:</p>
                    <span className="mt-1 inline-block rounded-full bg-gradient-to-r from-green-500 via-green-500 to-green-700 px-3 py-1 text-xs font-semibold text-white">
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
                    'absolute bottom-3 right-3 z-10 min-h-10 min-w-24 cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md transition',
                    isSelected
                        ? 'bg-red-600 hover:bg-red-700'
                        : teams[player.iplTeam as TeamName]?.btnGradient
                          ? `bg-gradient-to-r ${teams[player.iplTeam as TeamName].btnGradient}`
                          : 'bg-gray-600'
                )}
                onClick={() => {
                    if (isSelected) {
                        onRemovePlayer(player.id)
                        return
                    }

                    onAddPlayer(player)
                }}
                disabled={!canAddMore && !isSelected}>
                <span className="relative">{isSelected ? 'Remove' : '+ Add'}</span>
            </button>
        </div>
    )
}

export default PlayerSidebarItem
