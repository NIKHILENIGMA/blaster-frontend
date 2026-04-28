import { type FC } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'

import type { FranchiseFixture, FranchiseOverview } from '../types/franchise'

import PlayerCard from './player-card'
import TeamSection from './team-section'

interface MyTeamProps {
    overview: FranchiseOverview
    nextFixture: FranchiseFixture | null
}

const MyTeam: FC<MyTeamProps> = ({ overview, nextFixture }) => {
    const navigate = useNavigate()

    const franchise = overview.franchise
    const players = overview.rosterCycle ?? []
    const sessionLocked = overview.activeCycle?.isLocked ?? false

    return (
        <main className="flex flex-col items-center px-4 py-10">
            <section className="max-w-6xl mx-auto">
                <header className="flex flex-col gap-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {franchise?.teamLogo ? (
                                <img
                                    src={franchise.teamLogo}
                                    alt={franchise.teamName}
                                    className="h-16 w-16 rounded-xl border border-border object-cover"
                                />
                            ) : null}
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    {franchise?.teamName || 'My Franchise'}
                                </h1>
                                <p className="text-gray-500 text-sm max-w-md">
                                    Your active cycle squad contains {players.length} players. Build
                                    the lineup for the next fixture from this roster.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="default"
                                onClick={() => navigate('/my-squad/create')}
                                disabled={sessionLocked}
                            >
                                Edit 25-Player Squad
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() =>
                                    nextFixture &&
                                    navigate(`/my-squad/${nextFixture.id}/change`)
                                }
                                disabled={!nextFixture}
                            >
                                Manage Playing 12
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    nextFixture &&
                                    navigate(`/my-squad/${nextFixture.id}/roles`)
                                }
                                disabled={!nextFixture}
                            >
                                Change Roles
                            </Button>
                        </div>
                    </div>

                    {nextFixture ? (
                        <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
                            Next fixture: <strong>{nextFixture.teamA}</strong> vs{' '}
                            <strong>{nextFixture.teamB}</strong> at{' '}
                            {new Date(nextFixture.startTime).toLocaleString()}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                            No upcoming fixture is available for the active cycle yet.
                        </div>
                    )}
                </header>

                {players.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500">
                            No squad saved yet. Build your 25-player roster first.
                        </p>
                    </div>
                ) : (
                    <TeamSection title="Franchise Squad" count={`${players.length} Players`}>
                        {players.map((player) => (
                            <PlayerCard
                                key={player.id}
                                name={player.name}
                                credits={player.purchasePrice ?? player.cost}
                                tag={`${player.role}${player.iplTeam ? ` • ${player.iplTeam}` : ''}`}
                                badge={player.isOverseas ? 'Overseas' : undefined}
                                profilePicUrl={player.profileImageUrl}
                            />
                        ))}
                    </TeamSection>
                )}
            </section>
        </main>
    )
}

export default MyTeam
