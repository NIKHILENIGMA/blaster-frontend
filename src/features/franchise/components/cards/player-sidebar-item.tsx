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
                'relative flex items-end justify-between p-4 rounded-xl bg-gradient-to-b from-white via-gray-100 to-white overflow-hidden shadow-lg',
                teams[player.iplTeam as TeamName] ? teams[player.iplTeam as TeamName].shadowColor : 'shadow-none'
            )}>
            {/* Ghost Logo */}
            <img
                src={teams[player.iplTeam as TeamName]?.teamLogoUrl}
                className="absolute right-6 opacity-10 w-52"
            />

            <div className="absolute left-2 top-2.5 z-20 text-sm ">
                {player.isOverseas ? (
                    <span className="p-3 bg-yellow-500 text-black rounded-full flex items-center gap-1 rotate-45">
                        <FaPlaneUp />
                    </span>
                ) : null}
            </div>
            <div className="absolute right-2 top-6.5 z-20 text-sm text-gray-500">
                <Label>Points</Label>
                {player.cost ? (
                    <span className="p-3 text-black rounded-full flex items-center gap-1 font-extrabold text-2xl">{player.cost}</span>
                ) : null}
            </div>
            {/* Left Image */}
            <div className="relative z-10 w-fit">
                {/* Background */}
                <div className="p-1 rounded-2xl">
                    <img
                        src={teams[player.iplTeam as TeamName]?.bgCover}
                        alt="avatar-background"
                        className="w-28 h-40 object-cover rounded-lg"
                    />
                </div>

                {/* Avatar */}
                <div
                    className={cn(
                        'absolute inset-0 left-1/2 -translate-x-1/2 top-0',
                        'w-24 h-40 rounded-xl overflow-hidden',
                        'ring-2 ring-white shadow-xl'
                    )}>
                    <img
                        src={player.profileImageUrl}
                        className="w-full h-full object-cover object-top scale-100 -translate-y-2"
                    />
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 ml-4 z-10">
                <p className="text-xs text-gray-500">NAME:</p>
                <h2 className="text-2xl font-bold text-gray-900 font-heading leading-tight">{player.name}</h2>

                <div className="mt-3">
                    <p className="text-xs text-gray-500">TEAM:</p>
                    <div className="flex items-center gap-2 mt-1">
                        <img
                            src={teams[player.iplTeam as TeamName]?.teamLogoUrl}
                            className="w-5 h-5"
                        />
                        <span className="font-medium text-sm">{teamNameGenerator(player.iplTeam as TeamName)}</span>
                    </div>
                </div>

                <div className="mt-3">
                    <p className="text-xs text-gray-500">ROLE:</p>
                    <span className="inline-block mt-1 px-3 py-1 rounded-full bg-gradient-to-r from-green-500 via-green-500 to-green-700 text-white text-xs font-semibold">
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
                    'relative z-10 rounded-sm px-3 py-1.5 text-sm font-semibold cursor-pointer text-white shadow-md transition',
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
