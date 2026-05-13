import { useMemo, useState, type FC } from 'react'
import { useParams } from 'react-router'

import AppBreadcrumb from '@/components/shared/app-breadcrumb'
import { useGetLineup } from '@/features/team/api/get-lineup'
import MatchPlayerCard from '@/features/team/components/card/match-player-card'
import PointBreakdownDialog from '@/features/team/components/dialog/point-breakdown-dialog'
import { teams } from '@/features/team/constants/team'
import type { GetFixtureLineupResponse } from '@/features/team/types/fixtures'

type LineupPlayer = GetFixtureLineupResponse['lineupPlayers'][number]

const MatchSummaryPage: FC = () => {
    const { fixtureId } = useParams<{ fixtureId: string }>()
    const [selectedPlayer, setSelectedPlayer] = useState<LineupPlayer | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const { data: lineupData } = useGetLineup({
        fixtureId: fixtureId || ''
    })

    const lineupResponse = lineupData as GetFixtureLineupResponse

    const playingPlayers = useMemo(() => {
        if (!lineupResponse?.lineupPlayers) return []
        return lineupResponse.lineupPlayers.filter((p) => p.selectionType === 'PLAYING')
    }, [lineupResponse])

    const groupedPlayers = useMemo(() => {
        const groups = {
            'Wicket-Keeper': [] as LineupPlayer[],
            Batsman: [] as LineupPlayer[],
            'All-Rounder': [] as LineupPlayer[],
            Bowler: [] as LineupPlayer[]
        }

        playingPlayers.forEach((p) => {
            if (groups[p.role as keyof typeof groups]) {
                groups[p.role as keyof typeof groups].push(p)
            }
        })

        return groups
    }, [playingPlayers])

    const handlePlayerClick = (player: LineupPlayer) => {
        setSelectedPlayer(player)
        setIsDialogOpen(true)
    }

    if (!lineupResponse || !lineupResponse.fixture) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    const { fixture, matchPoints } = lineupResponse
    const fixtureLabel = `${fixture.teamA} vs ${fixture.teamB}`

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <main className="flex-1 w-full py-6 pb-12 px-4 lg:px-8 max-w-7xl mx-auto flex flex-col space-y-8">
                <AppBreadcrumb
                    items={[
                        { label: 'Matches', to: '/matches' },
                        { label: fixtureLabel, to: `/matches/${fixtureId}` },
                        { label: 'Summary' }
                    ]}
                />
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-2xl font-bold uppercase tracking-tight">Match Summary</h2>
                    <div className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold border border-primary/20">
                        Total Points: {matchPoints?.totalPoints || 0}
                    </div>
                </div>

                {/* Match Banner */}
                <div className="match-banner w-full min-h-[14rem] flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl items-center justify-center relative overflow-hidden shadow-xl text-white">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                    {/* Team A */}
                    <div className="relative z-10 w-[35%] flex flex-col items-center justify-center gap-4">
                        <div className="bg-white/5 backdrop-blur-md p-3 rounded-full border border-white/10 shadow-2xl">
                            <img
                                src={teams[fixture.teamA as keyof typeof teams]?.teamLogoUrl}
                                alt={fixture.teamA}
                                className="w-16 lg:w-24 h-16 lg:h-24 object-contain"
                            />
                        </div>
                        <h2 className="text-sm lg:text-xl text-center font-black tracking-wider uppercase">{fixture.teamA}</h2>
                    </div>

                    {/* VS Section */}
                    <div className="relative z-10 w-[30%] flex flex-col items-center justify-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 lg:w-14 lg:h-14 border border-white/20 rounded-full bg-white/5 backdrop-blur-md">
                            <span className="text-lg lg:text-xl font-black italic">VS</span>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">{fixture.matchResult || 'Completed'}</p>
                        </div>
                    </div>

                    {/* Team B */}
                    <div className="relative z-10 w-[35%] flex flex-col items-center justify-center gap-4">
                        <div className="bg-white/5 backdrop-blur-md p-3 rounded-full border border-white/10 shadow-2xl">
                            <img
                                src={teams[fixture.teamB as keyof typeof teams]?.teamLogoUrl}
                                alt={fixture.teamB}
                                className="w-16 lg:w-24 h-16 lg:h-24 object-contain"
                            />
                        </div>
                        <h2 className="text-sm lg:text-xl text-center font-black tracking-wider uppercase">{fixture.teamB}</h2>
                    </div>
                </div>

                {/* Squad Performance */}
                <div className="space-y-12">
                    {Object.entries(groupedPlayers).map(([role, players]) => (
                        <div
                            key={role}
                            className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-[1px] flex-1 bg-border" />
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground px-4 py-1 bg-muted rounded-full border border-border">
                                    {role}s ({players.length})
                                </h3>
                                <div className="h-[1px] flex-1 bg-border" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {players.map((player) => (
                                    <MatchPlayerCard
                                        key={player.id}
                                        player={player}
                                        isCaptain={player.id === lineupResponse.lineup?.captainId}
                                        isViceCaptain={player.id === lineupResponse.lineup?.viceCaptainId}
                                        isImpact={player.id === lineupResponse.lineup?.impactPlayerId}
                                        onClick={() => handlePlayerClick(player)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <PointBreakdownDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                player={selectedPlayer}
            />
        </div>
    )
}

export default MatchSummaryPage
