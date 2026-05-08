import type { FC } from 'react'
import { GiCommercialAirplane } from 'react-icons/gi'

import type { Player } from '../../types/players'


interface SquadPlayerCardProps {
    player: Player
    onRemovePlayer: (playerId: string) => void
    isRemoveBtn?: boolean
    isCaptain?: boolean
    isViceCaptain?: boolean
    isImpact?: boolean
}

type TeamInfo = {
    name: string
    teamLogoUrl: string
    bgCover: string
    shadowColor?: string
    btnGradient?: string
}

type TeamName = 'KKR' | 'CSK' | 'MI' | 'RCB' | 'SRH' | 'RR' | 'DC' | 'PBKS' | 'LSG' | 'GT'

const teams: Record<TeamName, TeamInfo> = {
    KKR: {
        name: 'Kolkata Knight Riders',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385137/KKRoutline_wm9ilt.avif',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777636498/kkr-avatar-background_y9cbjm_ohdd33.png',
        shadowColor: 'shadow-purple-500/50',
        btnGradient: 'from-purple-600 to-purple-900'
    },
    CSK: {
        name: 'Chennai Super Kings',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385137/CSKoutline_ue3e4o.avif',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777636498/csk-avatar-background_ixbt3c_dperzm.png',
        shadowColor: 'shadow-yellow-500/50',
        btnGradient: 'from-yellow-400 to-yellow-600'
    },
    MI: {
        name: 'Mumbai Indians',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385138/MIoutline_o3ejqe.avif',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777636498/mi-avatar-background_ju32bi.png',
        shadowColor: 'shadow-blue-500/50',
        btnGradient: 'from-blue-600 to-blue-900'
    },
    RCB: {
        name: 'Royal Challengers Bangalore',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385142/RCBoutline_bqhi8f.avif',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777556200/rcb-avatar-background_izmszs_ql7ztj.png',
        shadowColor: 'shadow-red-500/50',
        btnGradient: 'from-red-600 to-red-900'
    },
    SRH: {
        name: 'Sunrisers Hyderabad',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385143/SRHoutline_mwlgle.avif',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777636498/srk-avatar-background_q8qobf.png',
        shadowColor: 'shadow-orange-500/50',
        btnGradient: 'from-orange-600 to-orange-900'
    },
    RR: {
        name: 'Rajasthan Royals',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385142/RR_Logo_cpbm10.webp',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777636499/rr-avatar-background_uzfdsi_nstzcs.png',
        shadowColor: 'shadow-pink-500/50',
        btnGradient: 'from-pink-600 to-pink-900'
    },
    DC: {
        name: 'Delhi Capitals',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385137/DCoutline_xr0zrf.avif',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777636498/dc-avatar-background_e0y6uf_ubcdcw.png',
        shadowColor: 'shadow-blue-500/50',
        btnGradient: 'from-blue-600 to-blue-900'
    },
    PBKS: {
        name: 'Punjab Kings',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385141/PBKSoutline_t02dlh.avif',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777636498/pbks-avatar-background_o7z7je_skk1cx.png',
        shadowColor: 'shadow-red-500/50',
        btnGradient: 'from-red-600 to-red-900'
    },
    LSG: {
        name: 'Lucknow Super Giants',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385138/LSGoutline_g5u9xy.avif',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777636498/lsg-avatar-background_nvnjnb_i3qzvf.png',
        shadowColor: 'shadow-green-500/50',
        btnGradient: 'from-green-600 to-green-900'
    },
    GT: {
        name: 'Gujarat Titans',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385137/GToutline_fn1hjs.avif',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777636498/gt-avatar-background_hqtbcl.png',
        shadowColor: 'shadow-green-500/50',
        btnGradient: 'from-green-600 to-green-900'
    }
}

function teamNameGenerator(iplTeam: TeamName): string {
    switch (iplTeam) {
        case 'KKR':
            return 'Kolkata'
        case 'CSK':
            return 'Chennai'
        case 'MI':
            return 'Mumbai'
        case 'RCB':
            return 'Bangalore'
        case 'SRH':
            return 'Hyderabad'
        case 'RR':
            return 'Rajasthan'
        case 'DC':
            return 'Delhi'
        case 'PBKS':
            return 'Punjab'
        case 'LSG':
            return 'Giants'
        case 'GT':
            return 'Gujarat'
        default:
            return 'Mumbai'
    }
}

const SquadPlayerCard: FC<SquadPlayerCardProps> = ({ player, onRemovePlayer, isRemoveBtn, isCaptain, isViceCaptain, isImpact }) => {
    const teamInfo = teams[player.iplTeam as TeamName]
    return (
        <div className="relative w-full h-[410px] lg:h-full p-6 rounded-[28px] bg-[#fdfdfd] shadow-[-5px_9px_19px_-4px_rgba(236,_72,_153,_0.15)] overflow-hidden border-[1px] flex flex-col items-center gap-4 group hover:border-pink-500/50 transition-all duration-300">
            {/* Status Badges */}
            <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
                {isCaptain && (
                    <div className="bg-yellow-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg border border-white/20 uppercase tracking-tighter">
                        Captain 2x
                    </div>
                )}
                {isViceCaptain && (
                    <div className="bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg border border-white/20 uppercase tracking-tighter">
                        Vice Captain 1.5x
                    </div>
                )}
                {isImpact && (
                    <div className="bg-purple-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg border border-white/20 uppercase tracking-tighter">
                        Impact Player
                    </div>
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
                        <p className="font-bold tracking-widest text-lg">{teamNameGenerator(player.iplTeam as TeamName)[0]}</p>
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
