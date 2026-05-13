import { CircleCheck, Volleyball } from 'lucide-react'
import { useMemo, type ReactNode } from 'react'

import { Progress } from '@/components/ui/progress'
import { CategorySection } from '@/features/franchise/create/category-section'
import type { Player } from '@/features/franchise/types/players'
import type { Teams } from '@/features/franchise/types/teams'
import { teams } from '@/features/team/constants/team'
import type { GetFixtureLineupResponse } from '@/features/team/types/fixtures'
import { teamNameGenerator } from '../util/team-name-generator'

type FixtureLineupDetailsProps = {
    lineupResponse: GetFixtureLineupResponse
    heading?: string
    description?: string
    action?: ReactNode
    showMatchBanner?: boolean
    emptyStateTitle?: string
    emptyStateDescription?: string
}

export function FixtureLineupDetails({
    lineupResponse,
    heading = 'My Playing XII',
    description,
    action,
    showMatchBanner = true,
    emptyStateTitle = 'No lineup submitted yet',
    emptyStateDescription = 'This team has not submitted a playing XII for the selected fixture.'
}: FixtureLineupDetailsProps) {
    const selectedPlayersMap = useMemo(() => {
        const map = new Map<string, Player>()

        lineupResponse.lineupPlayers
            ?.filter((player) => player.selectionType === 'PLAYING')
            .forEach((player) => {
                map.set(player.id, {
                    ...player,
                    cost: player.cost,
                    iplTeam: player.iplTeam as Teams,
                    selectionType: player.selectionType as 'PLAYING' | 'SUBSTITUTE'
                } as Player)
            })

        return map
    }, [lineupResponse.lineupPlayers])

    const stats = useMemo(() => {
        const counts = {
            Batsman: 0,
            Bowler: 0,
            'All-Rounder': 0,
            'Wicket-Keeper': 0
        }

        lineupResponse.lineupPlayers?.forEach((player) => {
            if (player.selectionType === 'PLAYING') {
                counts[player.role]++
            }
        })

        return [
            { name: 'Batsman', value: counts['Batsman'], total: 4, color: 'bg-green-500' },
            { name: 'Bowler', value: counts['Bowler'], total: 5, color: 'bg-blue-500' },
            { name: 'All-Rounder', value: counts['All-Rounder'], total: 2, color: 'bg-yellow-500' },
            { name: 'Wicket-Keeper', value: counts['Wicket-Keeper'], total: 1, color: 'bg-red-500' }
        ]
    }, [lineupResponse.lineupPlayers])

    const playingPlayers = lineupResponse.lineupPlayers?.filter((player) => player.selectionType === 'PLAYING') ?? []
    const { fixture } = lineupResponse

    return (
        <div className="space-y-8">
            {showMatchBanner ? (
                <div className="w-full flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:items-stretch">
                    <div className="match-banner w-full min-h-[18rem] lg:min-h-[22rem] flex bg-gradient-to-br from-indigo-900 via-purple-700 to-indigo-900 rounded-2xl items-center justify-center relative overflow-hidden shadow-xl text-white">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                        <div className="relative z-10 w-[35%] flex flex-col items-center justify-center gap-4">
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 shadow-[0px_4px_13px_1px_rgba(0,_0,_0,_0.1)] overflow-hidden">
                                <img
                                    src={teams[fixture.teamA as keyof typeof teams]?.teamLogoUrl}
                                    alt={fixture.teamA}
                                    className="w-20 lg:w-32 h-20 lg:h-32 object-cover"
                                />
                            </div>
                            <h2 className="text-lg lg:text-2xl text-center font-black tracking-wider uppercase drop-shadow-md">{teamNameGenerator(fixture.teamA)}</h2>
                        </div>

                        <div className="relative z-10 w-[30%] flex flex-col items-center justify-center gap-4">
                            <div className="text-center px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                                <p className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-white/80">Match Start</p>
                                <p className="text-xs lg:text-sm font-bold">
                                    {new Date(fixture.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
                                </p>
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 border-2 border-white/30 rounded-full bg-white/5 backdrop-blur-md shadow-inner">
                                <span className="text-xl lg:text-2xl font-black italic">VS</span>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] lg:text-xs font-medium uppercase tracking-tighter text-white/60">
                                    {fixture.venueId || 'IPL Venue'}
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 w-[35%] flex flex-col items-center justify-center gap-4">
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 shadow-[0px_4px_13px_1px_rgba(0,_0,_0,_0.1)] overflow-hidden">
                                <img
                                    src={teams[fixture.teamB as keyof typeof teams]?.teamLogoUrl}
                                    alt={fixture.teamB}
                                    className="w-20 lg:w-32 h-20 lg:h-32 object-cover"
                                />
                            </div>
                            <h2 className="text-lg lg:text-2xl text-center font-black tracking-wider uppercase drop-shadow-md">{teamNameGenerator(fixture.teamB)}</h2>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-4 lg:min-w-[320px]">
                        {stats.map((stat) => (
                            <div
                                key={stat.name}
                                className="border border-border bg-card rounded-2xl p-5 shadow-sm flex flex-col justify-between group hover:border-primary/50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10 text-primary`}>
                                            <Volleyball size={18} />
                                        </div>
                                        <span className="text-sm font-bold text-foreground/80">{stat.name}</span>
                                    </div>
                                    {stat.value >= stat.total && <CircleCheck className="text-green-500 w-5 h-5" />}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black">{stat.value}</span>
                                        <span className="text-xs font-bold text-muted-foreground uppercase">/ {stat.total}</span>
                                    </div>
                                    <Progress
                                        value={(stat.value / stat.total) * 100}
                                        className="h-2"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}

            <div className="w-full pt-2">
                <div className="mb-8 flex flex-col gap-6">
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                        <h2 className="text-3xl font-black uppercase tracking-tight mb-2">{heading}</h2>
                        <div className="h-1 w-20 bg-primary rounded-full mb-4"></div>
                        <p className="text-sm text-muted-foreground max-w-xl">
                            {description ?? `Selected lineup for the ${fixture.teamA} vs ${fixture.teamB} clash.`}
                        </p>
                    </div>

                    {action ? <div className="flex w-full justify-center lg:justify-end">{action}</div> : null}

                    {playingPlayers.length > 0 ? (
                        <div className="mx-auto w-full max-w-6xl space-y-4">
                            <CategorySection
                                title="Wicket-Keeper"
                                role="Wicket-Keeper"
                                players={playingPlayers.filter((player) => player.role === 'Wicket-Keeper')}
                                onAddPlayer={() => {}}
                                onRemovePlayer={() => {}}
                                selectedPlayers={selectedPlayersMap}
                                captainId={lineupResponse.lineup?.captainId}
                                viceCaptainId={lineupResponse.lineup?.viceCaptainId}
                                impactPlayerId={lineupResponse.lineup?.impactPlayerId}
                            />
                            <CategorySection
                                title="Batsman"
                                role="Batsman"
                                players={playingPlayers.filter((player) => player.role === 'Batsman')}
                                onAddPlayer={() => {}}
                                onRemovePlayer={() => {}}
                                selectedPlayers={selectedPlayersMap}
                                captainId={lineupResponse.lineup?.captainId}
                                viceCaptainId={lineupResponse.lineup?.viceCaptainId}
                                impactPlayerId={lineupResponse.lineup?.impactPlayerId}
                            />
                            <CategorySection
                                title="All-Rounder"
                                role="All-Rounder"
                                players={playingPlayers.filter((player) => player.role === 'All-Rounder')}
                                onAddPlayer={() => {}}
                                onRemovePlayer={() => {}}
                                selectedPlayers={selectedPlayersMap}
                                captainId={lineupResponse.lineup?.captainId}
                                viceCaptainId={lineupResponse.lineup?.viceCaptainId}
                                impactPlayerId={lineupResponse.lineup?.impactPlayerId}
                            />
                            <CategorySection
                                title="Bowler"
                                role="Bowler"
                                players={playingPlayers.filter((player) => player.role === 'Bowler')}
                                onAddPlayer={() => {}}
                                onRemovePlayer={() => {}}
                                selectedPlayers={selectedPlayersMap}
                                captainId={lineupResponse.lineup?.captainId}
                                viceCaptainId={lineupResponse.lineup?.viceCaptainId}
                                impactPlayerId={lineupResponse.lineup?.impactPlayerId}
                            />
                        </div>
                    ) : (
                        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
                            <h3 className="text-lg font-semibold text-foreground">{emptyStateTitle}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{emptyStateDescription}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
