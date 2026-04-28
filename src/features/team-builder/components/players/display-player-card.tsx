import type { FC } from 'react'
import type { Player } from '../../types/players'
import { cn } from '@/shared/lib/utils'

interface DisplayPlayerCardProps {
    player: Player
    onAddPlayer: (player: Player) => void
    canAddMore: boolean
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
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777373117/kkr-avatar-background_y9cbjm.png',
        shadowColor: 'shadow-purple-500/50',
        btnGradient: 'from-purple-600 to-purple-900'
    },
    CSK: {
        name: 'Chennai Super Kings',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385137/CSKoutline_ue3e4o.avif',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777376137/csk-avatar-background_ixbt3c.png'
    },
    MI: {
        name: 'Mumbai Indians',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385138/MIoutline_o3ejqe.avif',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777376181/mi-avatar-background_ezrjse.png',
        shadowColor: 'shadow-blue-500/50',
        btnGradient: 'from-blue-600 to-blue-900'
    },
    RCB: {
        name: 'Royal Challengers Bangalore',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385142/RCBoutline_bqhi8f.avif',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777376138/rcb-avatar-background_izmszs.png',
        shadowColor: 'shadow-red-500/50',
        btnGradient: 'from-red-600 to-red-900'
    },
    SRH: {
        name: 'Sunrisers Hyderabad',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385143/SRHoutline_mwlgle.avif',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777376136/srk-avatar-background_o8dfr2.png'
    },
    RR: {
        name: 'Rajasthan Royals',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385142/RR_Logo_cpbm10.webp',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777376136/rr-avatar-background_uzfdsi.png'
    },
    DC: {
        name: 'Delhi Capitals',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385137/DCoutline_xr0zrf.avif',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777376138/rcb-avatar-background_izmszs.png'
    },
    PBKS: {
        name: 'Punjab Kings',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385141/PBKSoutline_t02dlh.avif',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777376138/pbks-avatar-background_o7z7je.png'
    },
    LSG: {
        name: 'Lucknow Super Giants',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385138/LSGoutline_g5u9xy.avif',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777376138/lsg-avatar-background_nvnjnb.png'
    },
    GT: {
        name: 'Gujarat Titans',
        teamLogoUrl: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777385137/GToutline_fn1hjs.avif',
        bgCover: 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1777376137/gt-avatar-background_svfkkr.png'
    }
}

const DisplayPlayerCard: FC<DisplayPlayerCardProps> = ({ player, onAddPlayer, canAddMore }) => {
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

export default DisplayPlayerCard
