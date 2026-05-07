import { CircleCheck, Volleyball } from 'lucide-react'
import { useMemo, type FC } from 'react'
import { useNavigate, useParams } from 'react-router'

import Header from '@/components/shared/header'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CategorySection } from '@/features/franchise/create/category-section'
import type { Player } from '@/features/franchise/types/players'
import type { Teams } from '@/features/franchise/types/teams'
import { useGetLineup } from '@/features/team/api/get-lineup'
import { teams } from '@/features/team/constants/team'
import type { GetFixtureLineupResponse } from '@/features/team/types/fixtures'

const CurrentTeamPage: FC = () => {
    const { fixtureId } = useParams<{ fixtureId: string }>()
    const navigate = useNavigate()

    const { data: lineupData } = useGetLineup({
        fixtureId: fixtureId || ''
    })

    const lineupResponse = lineupData as GetFixtureLineupResponse

    const selectedPlayersMap = useMemo(() => {
        const map = new Map<string, Player>()
        if (lineupResponse?.lineupPlayers) {
            lineupResponse.lineupPlayers
                .filter((p) => p.selectionType === 'PLAYING')
                .forEach((p) => {
                    map.set(p.id, {
                        ...p,
                        cost: p.cost,
                        iplTeam: p.iplTeam as Teams,
                        selectionType: p.selectionType as 'PLAYING' | 'SUBSTITUTE'
                    } as Player)
                })
        }
        return map
    }, [lineupResponse])

    const stats = useMemo(() => {
        const counts = {
            Batsman: 0,
            Bowler: 0,
            'All-Rounder': 0,
            'Wicket-Keeper': 0
        }

        lineupResponse?.lineupPlayers?.forEach((p) => {
            if (p.selectionType === 'PLAYING') {
                counts[p.role]++
            }
        })

        return [
            { name: 'Batsman', value: counts['Batsman'], total: 4, color: 'bg-green-500' },
            { name: 'Bowler', value: counts['Bowler'], total: 5, color: 'bg-blue-500' },
            { name: 'All-Rounder', value: counts['All-Rounder'], total: 2, color: 'bg-yellow-500' },
            { name: 'Wicket-Keeper', value: counts['Wicket-Keeper'], total: 1, color: 'bg-red-500' }
        ]
    }, [lineupResponse])

    if (!lineupResponse || !lineupResponse.fixture) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    const { fixture } = lineupResponse

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1 w-full pt-24 pb-12 px-4 lg:px-8 max-w-7xl mx-auto flex flex-col space-y-8">
                <h2 className="text-2xl font-bold text-center pb-2 uppercase tracking-tight">Current Match</h2>

                <div className="w-full flex flex-col gap-6 lg:grid lg:grid-cols-[2fr_1fr]">
                    {/* Match Banner */}
                    <div className="match-banner w-full min-h-[18rem] lg:min-h-[22rem] flex bg-gradient-to-br from-indigo-900 via-purple-700 to-indigo-900 rounded-2xl items-center justify-center relative overflow-hidden shadow-xl text-white">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                        {/* Team A */}
                        <div className="relative z-10 w-[35%] flex flex-col items-center justify-center gap-4">
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 shadow-2xl">
                                <img
                                    src={teams[fixture.teamA as keyof typeof teams]?.teamLogoUrl}
                                    alt={fixture.teamA}
                                    className="w-20 lg:w-32 h-20 lg:h-32 object-contain"
                                />
                            </div>
                            <h2 className="text-lg lg:text-2xl text-center font-black tracking-wider uppercase drop-shadow-md">{fixture.teamA}</h2>
                        </div>

                        {/* VS Section */}
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

                        {/* Team B */}
                        <div className="relative z-10 w-[35%] flex flex-col items-center justify-center gap-4">
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 shadow-2xl">
                                <img
                                    src={teams[fixture.teamB as keyof typeof teams]?.teamLogoUrl}
                                    alt={fixture.teamB}
                                    className="w-20 lg:w-32 h-20 lg:h-32 object-contain"
                                />
                            </div>
                            <h2 className="text-lg lg:text-2xl text-center font-black tracking-wider uppercase drop-shadow-md">{fixture.teamB}</h2>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="w-full grid grid-cols-2 gap-4">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
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

                {/* Player Section */}
                <div className="w-full pt-8 relative">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <h2 className="text-3xl font-black uppercase tracking-tight mb-2">My Playing XII</h2>
                        <div className="h-1 w-20 bg-primary rounded-full mb-4"></div>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Your selected lineup for the {fixture.teamA} vs {fixture.teamB} clash. Includes Captain, Vice-Captain, and Impact Player.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 flex justify-end mb-6">
                        {lineupResponse.lineupPlayers?.filter((p) => p.selectionType === 'PLAYING').length === 12 ? (
                            <Button
                                onClick={() => navigate(`build`)}
                                variant="outline"
                                size="sm">
                                Edit Lineup
                            </Button>
                        ) : (
                            <Button onClick={() => navigate('build')}>Build Team</Button>
                        )}
                    </div>

                    <div className="space-y-4">
                        <CategorySection
                            title="Wicket-Keeper"
                            role="Wicket-Keeper"
                            players={Array.from(selectedPlayersMap.values()).filter((p) => p.role === 'Wicket-Keeper')}
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
                            players={Array.from(selectedPlayersMap.values()).filter((p) => p.role === 'Batsman')}
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
                            players={Array.from(selectedPlayersMap.values()).filter((p) => p.role === 'All-Rounder')}
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
                            players={Array.from(selectedPlayersMap.values()).filter((p) => p.role === 'Bowler')}
                            onAddPlayer={() => {}}
                            onRemovePlayer={() => {}}
                            selectedPlayers={selectedPlayersMap}
                            captainId={lineupResponse.lineup?.captainId}
                            viceCaptainId={lineupResponse.lineup?.viceCaptainId}
                            impactPlayerId={lineupResponse.lineup?.impactPlayerId}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default CurrentTeamPage
