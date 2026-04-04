export function LeaderboardHero() {
    return (
        <div className="relative w-full h-[30vh] sm:h-[50vh] overflow-hidden">
            {/* Background image */}
            <img
                src={'/ipl-race.png'}
                alt="Leaderboard hero background"
                className="absolute inset-0 w-full h-full object-cover object-[center_50%] opacity-80"
            />

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/40"></div>
        </div>
    )
}
