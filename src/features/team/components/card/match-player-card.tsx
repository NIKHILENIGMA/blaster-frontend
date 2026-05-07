import type { FC } from 'react'
import { GiCommercialAirplane } from 'react-icons/gi'
import { teams } from '@/features/team/constants/team'

interface MatchPlayerCardProps {
    player: {
        id: string
        name: string
        profileImageUrl: string
        iplTeam: string
        role: string
        isOverseas: boolean
        finalPoints?: number | null
        multiplier?: number | null
    }
    isCaptain?: boolean
    isViceCaptain?: boolean
    isImpact?: boolean
    onClick?: () => void
}

type TeamName = 'KKR' | 'CSK' | 'MI' | 'RCB' | 'SRH' | 'RR' | 'DC' | 'PBKS' | 'LSG' | 'GT'

function teamNameGenerator(iplTeam: string): string[] {
    switch (iplTeam) {
        case 'KKR': return ['Kolkata Knight', 'Riders']
        case 'CSK': return ['Chennai Super', 'Kings']
        case 'MI': return ['Mumbai', 'Indians']
        case 'RCB': return ['Royal Challengers', 'Bangalore']
        case 'SRH': return ['Sunrisers', 'Hyderabad']
        case 'RR': return ['Rajasthan', 'Royals']
        case 'DC': return ['Delhi', 'Capitals']
        case 'PBKS': return ['Punjab', 'Kings']
        case 'LSG': return ['Lucknow', 'Super Giants']
        case 'GT': return ['Gujarat', 'Titans']
        default: return ['Mumbai', 'Indians']
    }
}

const MatchPlayerCard: FC<MatchPlayerCardProps> = ({ 
    player, 
    isCaptain,
    isViceCaptain,
    isImpact,
    onClick
}) => {
    const teamInfo = teams[player.iplTeam as TeamName]
    
    return (
        <div 
            onClick={onClick}
            className="relative w-full h-full p-6 rounded-[28px] bg-[#fdfdfd] shadow-md overflow-hidden border border-border flex flex-col items-center gap-4 group hover:border-primary/50 transition-all duration-300 cursor-pointer"
        >
            {/* Status Badges */}
            <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
                {isCaptain && (
                    <div className="bg-yellow-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg border border-white/20 uppercase tracking-tighter">
                        Captain {player.multiplier}x
                    </div>
                )}
                {isViceCaptain && (
                    <div className="bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg border border-white/20 uppercase tracking-tighter">
                        Vice Captain {player.multiplier}x
                    </div>
                )}
                {isImpact && (
                    <div className="bg-purple-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg border border-white/20 uppercase tracking-tighter">
                        Impact Player {player.multiplier}x
                    </div>
                )}
            </div>

            {/* Points Badge */}
            <div className="absolute top-4 right-4 z-30">
                <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white/20">
                    {player.finalPoints || 0} pts
                </div>
            </div>

            <div className="absolute top-2 left-2.5 z-20 text-sm text-gray-500">
                {player.isOverseas ? (
                    <span className="p-2 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                        <GiCommercialAirplane size={16} />
                    </span>
                ) : null}
            </div>

            {/* 🧍 Player Image Wrapper */}
            <div className="flex justify-center">
                <div className="relative w-[120px] h-[120px] flex items-center justify-center overflow-hidden rounded-xl border-4 border-white shadow-md">
                    {/* background cover */}
                    <div className="w-full h-full bg-muted absolute top-0 left-0" />

                    {/* image container */}
                    <div className="absolute rounded-xl h-[100%] top-6 z-20">
                        <img
                            src={player.profileImageUrl}
                            alt={player.name}
                            className="scale-150 object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* 📝 Content */}
            <div className="text-center relative">
                <p className="text-gray-600 tracking-widest text-xs uppercase">{player.name.split(' ')[0]}</p>
                <h2 className="text-lg font-extrabold text-gray-900 tracking-wide">{player.name.split(' ').slice(1).join(' ')}</h2>

                {/* Divider */}
                <div className="flex items-center justify-center gap-2 my-2">
                    <div className="w-6 h-[1px] bg-primary/30" />
                    <div className="w-1 h-1 bg-primary rounded-full" />
                    <div className="w-6 h-[1px] bg-primary/30" />
                </div>

                {/* Team Info */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <img
                        src={teamInfo?.teamLogoUrl}
                        alt={player.iplTeam}
                        className="w-8 h-8 object-contain"
                    />
                    <div className="text-left leading-tight">
                        <p className="font-bold uppercase">{teamNameGenerator(player.iplTeam)[0]}</p>
                        <p className="text-gray-400 uppercase">{teamNameGenerator(player.iplTeam)[1]}</p>
                    </div>
                </div>

                {/* Role Badge */}
                <div className="mt-4 flex justify-center">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold shadow-sm uppercase">
                        🏏 {player.role}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MatchPlayerCard
