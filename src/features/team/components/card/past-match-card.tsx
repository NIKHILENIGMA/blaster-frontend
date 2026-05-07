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
}

export default function PastMatchCard({ match }: PastMatchCardProps) {
    return (
        <div className="relative bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition">
            {/* Status Badge */}
            <span className="absolute top-3 right-3 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Completed</span>

            {/* Match Info */}
            <div className="text-xs text-gray-400 mb-3">Match {match.matchNo}</div>

            {/* Score */}
            <div className="flex justify-between items-center mb-3">
                <div className="text-center">
                    <p className="font-medium text-sm">{match.teamA}</p>
                    <p className="text-xl font-bold">{match.scoreA}</p>
                </div>

                <div className="text-gray-400 text-sm">VS</div>

                <div className="text-center">
                    <p className="font-medium text-sm">{match.teamB}</p>
                    <p className="text-xl font-bold">{match.scoreB}</p>
                </div>
            </div>

            {/* Result */}
            <div className="bg-green-50 text-green-600 text-xs font-medium px-3 py-2 rounded-lg text-center">{match.result}</div>

            {/* Footer */}
            <div className="mt-3 text-xs text-gray-400">{match.date}</div>
        </div>
    )
}
