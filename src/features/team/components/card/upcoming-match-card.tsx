import { useNavigate } from "react-router"

import { cn } from "@/shared/lib/utils"
import { teams } from "../../constants/team"

interface UpcomingMatchCardProps {
    match: {
        matchNo: number
        teamA: string
        teamB: string
        teamAGradient: string
        teamBGradient: string
        date: string
        time: string
        venue: string
    }
    fixtureId: string
}

export default function UpcomingMatchCard({ match, fixtureId }: UpcomingMatchCardProps) {

    
    const navigate = useNavigate()
    return (
        <div className="relative group rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            {/* Background Glow */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br",
              match.teamAGradient,
              match.teamBGradient
            )} />

            {/* Stadium Light Effect */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.3),transparent_60%)]" />
            </div>

            {/* Glass Overlay */}
            <div className="absolute inset-0 backdrop-blur-[2px]" />

            {/* Content */}
            <div className="relative p-5 text-white flex flex-col gap-4">
                {/* Match Badge */}
                <div className="flex justify-between items-center">
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur">Match {match.matchNo}</span>
                    <span className="text-xs opacity-70">{match.date}</span>
                </div>

                {/* Teams Section */}
                <div className="flex items-center justify-between">
                    {/* Team A */}
                    <div className="relative flex flex-col items-center w-1/3">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-inner">
                            <img
                                src={teams[match.teamA as keyof typeof teams]?.teamLogoUrl}
                                alt={match.teamA}
                                className="object-cover w-full h-full rounded-full z-40"
                            />
                        </div>
                        <p className="text-sm mt-2 text-center font-bold">{match.teamA}</p>
                    </div>

                    {/* VS */}
                    <div className="relative flex flex-col items-center">
                        <div className="text-xs opacity-60 mt-3">VS</div>

                        {/* Glow Ring */}
                        <div className="absolute w-10 h-10 rounded-full border border-white/20 animate-pulse" />
                    </div>

                    {/* Team B */}
                    <div className="flex flex-col items-center w-1/3">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-inner">
                            <img
                                src={teams[match.teamB as keyof typeof teams]?.teamLogoUrl}
                                alt={match.teamB}
                                className="object-cover w-full h-full rounded-full"
                            />
                        </div>
                        <p className="text-sm mt-2 text-center font-bold">{match.teamB}</p>
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="flex items-center justify-between mt-2 text-white">
                    <div className="flex flex-col text-sm">
                        <p>{match.time}</p>
                        <p className="opacity-60">{match.venue}</p>
                    </div>

                    <button
                    onClick={() => navigate(`${fixtureId}`)}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer z-50">
                        Your Team
                    </button>
                </div>
            </div>

            {/* Hover Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </div>
        </div>
    )
}
