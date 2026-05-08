import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { teams } from '../../constants/team'

interface PastMatchCardProps {
    match: {
        matchNo: number
        teamA: string
        teamB: string
        scoreA: number
        scoreB: number
        result: string
        date: string
    }
    fixtureId: string
}

export default function PastMatchCard({ match, fixtureId }: PastMatchCardProps) {
    const navigate = useNavigate()
    return (
        <div className="relative bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition">
            {/* Status Badge */}
            <span className="absolute top-3 right-3 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Completed</span>

            {/* Match Info */}
            <div className="text-xs text-gray-400 mb-3">Match {match.matchNo}</div>

            {/* Score */}
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

            {/* Result */}
            <div className="bg-green-50 text-green-600 text-xs font-medium px-3 py-2 rounded-lg text-center">{match.result}</div>

            {/* Footer */}
            <div className="mt-3 text-xs text-gray-400">{match.date}</div>
            <Button onClick={() => navigate(`/matches/${fixtureId}/summary`)}>View Details</Button>
        </div>
    )
}
