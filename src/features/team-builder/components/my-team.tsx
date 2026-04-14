import { useEffect, useState, type FC } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'

import type { CurrentTeam } from '../types/team'

import PlayerCard from './player-card'
import TeamSection from './team-section'

interface MyTeamProps {
    team: CurrentTeam
}

interface Player {
    id: string
    name: string
    team: string
    isOverseas: boolean
    cost: number
    profilePicUrl: string
    role: string
}

const MyTeam: FC<MyTeamProps> = ({ team }) => {
    const navigate = useNavigate()
    const sessionLocked = team.session?.isLocked ?? false
    const [players, setPlayers] = useState<Player[]>([]) // Initialize with players from props

    useEffect(() => {
        if (team.team) {
            setPlayers(team.team.players)
        }
    }, [team]) // Update players state when team prop changes

    return (
        <main className="flex flex-col items-center px-4 py-10">
            <section className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">{team.team?.name || 'My Fantasy Team'}</h1>
                        <p className="text-gray-500 text-sm max-w-md">
                            Optimized for high-performance fantasy matchups. Your current selection balances aggressive hitting and disciplined death
                            bowling.
                        </p>
                    </div>
                    <Button
                        variant={'default'}
                        onClick={() => navigate(`${team.team?.id}/change`)}
                        disabled={sessionLocked}>
                        Edit Team
                    </Button>
                    <Button
                        variant={'secondary'}
                        onClick={() => navigate(`${team.team?.id}/roles`)}
                        >
                        Change C/VC
                    </Button>
                </header>

                {/* Sections */}
                {players.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500">No players in your team yet. Start building your squad!</p>
                    </div>
                ) : (
                    <TeamSection
                        title="My Players"
                        count={`${players.length} Players`}>
                        {players.map((player) => (
                            <PlayerCard
                                key={player.id}
                                name={player.name}
                                credits={player.cost}
                                tag={`${player.role}${player.team ? ` • ${player.team}` : ''}`}
                                badge={player.isOverseas ? 'Overseas' : undefined}
                                profilePicUrl={player.profilePicUrl}
                                isCaptain={team.team?.captainId === player.id}
                                isViceCaptain={team.team?.viceCaptainId === player.id}
                            />
                        ))}
                    </TeamSection>
                )}
            </section>
        </main>
    )
}

export default MyTeam
