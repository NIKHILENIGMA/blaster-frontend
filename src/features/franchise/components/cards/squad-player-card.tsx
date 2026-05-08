import type { FC } from 'react'
import { GiCommercialAirplane } from 'react-icons/gi'

import type { Player } from '../../types/players'
import { teams } from '@/features/team/constants/team'
import { teamNameGenerator } from '@/features/team/util/team-name-generator'
import { Badge } from '@/components/ui/badge'

interface SquadPlayerCardProps {
    player: Player
    onRemovePlayer: (playerId: string) => void
    isRemoveBtn?: boolean
    isCaptain?: boolean
    isViceCaptain?: boolean
    isImpact?: boolean
}

type TeamName = 'KKR' | 'CSK' | 'MI' | 'RCB' | 'SRH' | 'RR' | 'DC' | 'PBKS' | 'LSG' | 'GT'

const SquadPlayerCard: FC<SquadPlayerCardProps> = ({ player, onRemovePlayer, isRemoveBtn, isCaptain, isViceCaptain, isImpact }) => {
    const teamInfo = teams[player.iplTeam as TeamName]
    return (
        <div className="relative w-full h-[410px] lg:h-full p-6 rounded-[28px] bg-[#fdfdfd] shadow-[-5px_9px_19px_-4px_rgba(236,_72,_153,_0.15)] overflow-hidden border-[1px] flex flex-col items-center gap-4 group hover:border-pink-500/50 transition-all duration-300">
            {/* Status Badges */}
            <div className="absolute top-4 right-5 z-30 flex flex-col gap-2">
                {isCaptain && (
                    <Badge variant={'default'} className="text-white text-xl rounded-full font-black  shadow-lg border border-white/20 uppercase">
                        C
                    </Badge>
                )}
                {isViceCaptain && (
                    <Badge variant={'secondary'} className="text-white text-xl rounded-full font-black  shadow-lg border border-white/20 uppercase">
                        VC 
                    </Badge>
                )}
                {isImpact && (
                    <Badge variant={'destructive'} className="text-white text-xl rounded-full font-black  shadow-lg border border-white/20 uppercase">
                        IP
                    </Badge>
                )}
            </div>

            {isRemoveBtn && (
                <button
                    onClick={() => onRemovePlayer(player.id)}
                    className="cursor-pointer absolute top-2 right-2.5 z-20 flex text-sm text-red-500 hover:text-red-700 transition-colors duration-200 items-center gap-1 border border-red-500 hover:border-red-700 rounded-full px-2 py-1">
                    Remove
                </button>
            )}
            <div className="absolute top-2 left-2.5 z-20 text-sm text-gray-500">
                {player.isOverseas ? (
                    <span className="p-3 bg-primary text-white rounded-full flex items-center gap-1 rotate-0 shadow-lg">
                        <GiCommercialAirplane size={20} />
                    </span>
                ) : null}
            </div>
            {/* 🐉 Ghost Logo */}
            <img
                src={teamInfo.teamLogoUrl}
                alt="ghost-logo"
                className="absolute right-[-30px] top-1/2 -translate-y-1/2 w-3/4 opacity-10 pointer-events-none select-none"
            />

            {/* 🧍 Player Image Wrapper */}
            <div className="flex justify-center">
                <div className="relative w-[150px] h-[150px] flex items-center justify-center overflow-hidden rounded-xl border-6 border-white shadow-[0px_10px_18px_-2px_rgba(0,_0,_0,_0.1)]">
                    {/* background glow */}
                    <img
                        src={teamInfo.bgCover}
                        alt={`${player.iplTeam}`}
                        className="w-full h-full object-cover absolute top-0 left-0 "
                    />

                    {/* image container - allow overflow from top */}
                    <div className="absolute rounded-xl h-[100%] top-12 z-20">
                        <img
                            src={player.profileImageUrl}
                            alt="player"
                            className="scale-180 object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* 📝 Content */}
            <div className="text-center relative h-full ">
                {/* Name */}
                <p className="text-gray-600 tracking-widest text-sm">{player.name.split(' ')[0]}</p>
                <h2 className="text-xl lg:text-2xl font-extrabold text-gray-900 tracking-wide">{player.name.split(' ')[1]}</h2>

                {/* Divider */}
                <div className="flex items-center justify-center gap-2 my-3">
                    <div className="w-8 h-[2px] bg-red-500" />
                    <div className="w-1 h-1 bg-red-500 rounded-full" />
                    <div className="w-8 h-[2px] bg-red-500" />
                </div>

                {/* Team */}
                <div className="flex items-center justify-center gap-3 text-sm text-gray-600 tracking-wide">
                    <img
                        src={teamInfo.teamLogoUrl}
                        className="w-12 h-12"
                    />
                    <div className="text-left uppercase">
                        <p className="font-bold tracking-widest text-lg">{teamNameGenerator(player.iplTeam as TeamName)}</p>
                    </div>
                </div>

                {/* Role Badge */}
                <div className="mt-5 flex justify-center">
                    <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-green-500 text-white text-sm font-semibold shadow-md">
                        🏏 {player.role}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SquadPlayerCard
