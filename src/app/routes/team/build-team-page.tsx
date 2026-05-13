import { CircleAlert, CircleCheck, Trophy, X, Star, Zap } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useGetFranchiseOverview } from '@/features/franchise/api/get-franchise-overview'
import type { Player } from '@/features/franchise/types/players'
import { useGetLineup } from '@/features/team/api/get-lineup'
import { useSaveLineup } from '@/features/team/api/save-lineup'
import BuildTeamPlayerPool from '@/features/team/components/build-team-player-pool'
import { teams } from '@/features/team/constants/team'
import { cn } from '@/shared/lib/utils'
import CountdownTimer from '@/components/shared/countdown-timer'
import { teamNameGenerator } from '@/features/team/util/team-name-generator'

const ROLE_CONFIG = {
    Batsman: { target: 4, color: 'bg-green-500' },
    Bowler: { target: 5, color: 'bg-blue-500' },
    'All-Rounder': { target: 2, color: 'bg-yellow-500' },
    'Wicket-Keeper': { target: 1, color: 'bg-red-500' }
} as const

const BuildTeamPage = () => {
    const { fixtureId } = useParams<{ fixtureId: string }>()
    const navigate = useNavigate()

    // 1. Fetch Fixture Info
    const { data: lineupData, isLoading: isLineupLoading } = useGetLineup({
        fixtureId: fixtureId || ''
    })

    // 2. Fetch Franchise Pool (The 25 players)
    const { data: overview, isLoading: isOverviewLoading } = useGetFranchiseOverview()

    const [selectedPlayingIds, setSelectedPlayingIds] = useState<Set<string>>(new Set())
    const [captainId, setCaptainId] = useState<string | null>(null)
    const [viceCaptainId, setViceCaptainId] = useState<string | null>(null)
    const [impactPlayerId, setImpactPlayerId] = useState<string | null>(null)
    const [sheetOpen, setSheetOpen] = useState<boolean>(false)

    const saveMutation = useSaveLineup({
        mutationConfig: {
            onSuccess: () => {
                toast.success('Match team locked successfully!')
                navigate(`/matches/${fixtureId}`)
            },
            onError: (error: Error) => {
                toast.error(error.message || 'Failed to save team')
            }
        }
    })

    // 3. Sync initial state if editing
    useEffect(() => {
        if (lineupData?.lineupPlayers && lineupData.lineup) {
            const playingIds = new Set(lineupData.lineupPlayers.filter((p) => p.selectionType === 'PLAYING').map((p) => p.id))
            setSelectedPlayingIds(playingIds)
            setCaptainId(lineupData.lineup.captainId)
            setViceCaptainId(lineupData.lineup.viceCaptainId)
            setImpactPlayerId(lineupData.lineup.impactPlayerId)
        }
    }, [lineupData])

    // Pool of 25 players to choose from
    const franchisePool = useMemo(() => {
        return (overview?.rosterCycle || []) as unknown as Player[]
    }, [overview])

    const selectedPlayers = useMemo(() => {
        return franchisePool.filter((p) => selectedPlayingIds.has(p.id))
    }, [franchisePool, selectedPlayingIds])

    const availablePlayers = useMemo(() => {
        return franchisePool.filter((p) => !selectedPlayingIds.has(p.id))
    }, [franchisePool, selectedPlayingIds])

    // 4. Validation Logic
    const validation = useMemo(() => {
        const errors: string[] = []
        const counts = { Batsman: 0, Bowler: 0, 'All-Rounder': 0, 'Wicket-Keeper': 0 }
        let overseas = 0

        selectedPlayers.forEach((p) => {
            counts[p.role]++
            if (p.isOverseas) overseas++
        })

        if (selectedPlayers.length !== 12) errors.push('Select exactly 12 players')
        if (counts['Batsman'] !== 4) errors.push('Need exactly 4 Batsmen')
        if (counts['Bowler'] !== 5) errors.push('Need exactly 5 Bowlers')
        if (counts['All-Rounder'] !== 2) errors.push('Need exactly 2 All-Rounders')
        if (counts['Wicket-Keeper'] !== 1) errors.push('Need exactly 1 Wicket-Keeper')
        if (overseas > 4) errors.push('Maximum 4 Overseas players allowed')

        if (!captainId) errors.push('Select a Captain')
        if (!viceCaptainId) errors.push('Select a Vice-Captain')
        if (!impactPlayerId) errors.push('Select an Impact Player')

        const uniqueRoles = new Set([captainId, viceCaptainId, impactPlayerId].filter(Boolean))
        if (uniqueRoles.size !== [captainId, viceCaptainId, impactPlayerId].filter(Boolean).length) {
            errors.push('Roles (C, VC, Impact) must be unique')
        }

        return { errors, counts, overseas }
    }, [selectedPlayers, captainId, viceCaptainId, impactPlayerId])

    const handleAddPlayer = (player: Player) => {
        if (selectedPlayingIds.size < 12) {
            setSelectedPlayingIds((prev) => new Set([...prev, player.id]))
        } else {
            toast.warning('Lineup limit of 12 reached')
        }
    }

    const handleRemovePlayer = (playerId: string) => {
        setSelectedPlayingIds((prev) => {
            const next = new Set(prev)
            next.delete(playerId)
            return next
        })
        if (captainId === playerId) setCaptainId(null)
        if (viceCaptainId === playerId) setViceCaptainId(null)
        if (impactPlayerId === playerId) setImpactPlayerId(null)
    }

    const handleSave = () => {
        if (validation.errors.length > 0) return

        const playingPlayerIds = Array.from(selectedPlayingIds)
        const substitutePlayerIds = franchisePool.filter((p) => !selectedPlayingIds.has(p.id)).map((p) => p.id)

        saveMutation.mutate({
            fixtureId: fixtureId || '',
            data: {
                playingPlayerIds,
                substitutePlayerIds,
                captainId: captainId!,
                viceCaptainId: viceCaptainId!,
                impactPlayerId: impactPlayerId!
            }
        })
    }

    if (isLineupLoading || isOverviewLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    const fixture = lineupData?.fixture

    return (
        <div className="flex min-h-screen flex-col bg-background pb-32 md:pb-0">
            <main className="flex-1 w-full px-4 py-6 lg:px-3 max-w-7xl mx-auto flex flex-col space-y-6">
                <h2 className="text-center text-2xl font-black tracking-tight">Build Your Match Team</h2>
                {/* Match Banner */}
                {fixture && (
                    <div className="match-banner w-full min-h-[12rem] lg:min-h-[16rem] flex bg-gradient-to-br from-indigo-900 to-purple-800 rounded-2xl items-center justify-center relative overflow-hidden shadow-lg text-white">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                        <div className="relative z-10 flex items-center justify-between w-full px-8 lg:px-20">
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-white/10 rounded-full border border-white/20">
                                    <img
                                        src={teams[fixture.teamA as keyof typeof teams]?.teamLogoUrl}
                                        alt={fixture.teamA}
                                        className="w-16 h-16 lg:w-24 lg:h-24 object-contain"
                                    />
                                </div>
                                <h2 className="font-black text-lg">{teamNameGenerator(fixture.teamA)}</h2>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-3xl font-black italic opacity-50">VS</span>
                                <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest">
                                    {new Date(fixture.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-white/10 rounded-full border border-white/20">
                                    <img
                                        src={teams[fixture.teamB as keyof typeof teams]?.teamLogoUrl}
                                        alt={fixture.teamB}
                                        className="w-16 h-16 lg:w-24 lg:h-24 object-contain"
                                    />
                                </div>
                                <h2 className="font-black text-lg">{teamNameGenerator(fixture.teamB)}</h2>
                            </div>
                        </div>
                    </div>
                )}

                {/* Countdown Timer */}
                {fixture?.lineupLockAt && <CountdownTimer windowClosesAt={new Date(fixture.lineupLockAt)} />}

                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_350px] gap-8">
                    {/* Left: Squad Canvas */}
                    <div className="space-y-6">
                        {/* Validation Messages */}
                        {validation.errors.length > 0 && (
                            <section className="rounded-xl border border-destructive/25 bg-card shadow-sm overflow-hidden">
                                <div className="flex flex-col gap-3 border-b border-destructive/15 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                                            <CircleAlert className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-black text-foreground">Lineup checklist</h4>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Complete these requirements before locking your match team.
                                            </p>
                                        </div>
                                    </div>
                                    <span className="w-fit rounded-md border border-destructive/20 bg-background px-3 py-1 text-xs font-black text-destructive">
                                        {validation.errors.length} pending
                                    </span>
                                </div>

                                <ul className="grid gap-2 p-4 md:grid-cols-2">
                                    {validation.errors.map((err) => (
                                        <li
                                            key={err}
                                            className="flex items-start gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground">
                                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-destructive" />
                                            <span className="leading-6">{err}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                                <div
                                    key={role}
                                    className="bg-card border border-border p-4 rounded-xl shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{role}s</span>
                                        {validation.counts[role as keyof typeof validation.counts] === config.target && (
                                            <CircleCheck className="text-green-500 w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-2xl font-black">{validation.counts[role as keyof typeof validation.counts]}</span>
                                        <span className="text-xs font-bold text-muted-foreground">/ {config.target}</span>
                                    </div>
                                    <Progress
                                        value={(validation.counts[role as keyof typeof validation.counts] / config.target) * 100}
                                        className={cn('h-1.5', config.color)}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Selected Players Grid */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                <Trophy className="text-primary w-5 h-5" />
                                Playing Lineup ({selectedPlayers.length}/12)
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                {selectedPlayers.map((player) => (
                                    <div
                                        key={player.id}
                                        className="relative group bg-card border border-border p-5 rounded-xl hover:border-primary/50 transition-all shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-20 h-20 border-2 border-background">
                                                <AvatarImage
                                                    src={player.profileImageUrl}
                                                    className="object-cover object-top"
                                                />
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                    {player.name[0]}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-lg font-black truncate">{player.name}</p>
                                                <p className="text-[13px] font-bold text-muted-foreground uppercase">
                                                    {player.role} • {player.iplTeam}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleRemovePlayer(player.id)}
                                                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Role Selectors */}
                                        <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-3">
                                            <button
                                                onClick={() => setCaptainId(captainId === player.id ? null : player.id)}
                                                className={cn(
                                                    'flex-1 flex items-center justify-center gap-1 text-[9px] font-black uppercase py-1 rounded-md border transition-all',
                                                    captainId === player.id
                                                        ? 'bg-yellow-500 border-yellow-600 text-white shadow-inner'
                                                        : 'bg-muted/50 border-transparent text-muted-foreground hover:bg-muted'
                                                )}>
                                                <Star className={cn('w-3 h-3', captainId === player.id && 'fill-current')} /> C
                                            </button>
                                            <button
                                                onClick={() => setViceCaptainId(viceCaptainId === player.id ? null : player.id)}
                                                className={cn(
                                                    'flex-1 flex items-center justify-center gap-1 text-[9px] font-black uppercase py-1 rounded-md border transition-all',
                                                    viceCaptainId === player.id
                                                        ? 'bg-blue-500 border-blue-600 text-white shadow-inner'
                                                        : 'bg-muted/50 border-transparent text-muted-foreground hover:bg-muted'
                                                )}>
                                                <Star className={cn('w-3 h-3', viceCaptainId === player.id && 'fill-current')} /> VC
                                            </button>
                                            <button
                                                onClick={() => setImpactPlayerId(impactPlayerId === player.id ? null : player.id)}
                                                className={cn(
                                                    'flex-1 flex items-center justify-center gap-1 text-[9px] font-black uppercase py-1 rounded-md border transition-all',
                                                    impactPlayerId === player.id
                                                        ? 'bg-purple-600 border-purple-700 text-white shadow-inner'
                                                        : 'bg-muted/50 border-transparent text-muted-foreground hover:bg-muted'
                                                )}>
                                                <Zap className={cn('w-3 h-3', impactPlayerId === player.id && 'fill-current')} /> IP
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {Array.from({ length: 12 - selectedPlayers.length }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-[104px] border-2 border-dashed border-muted rounded-xl flex items-center justify-center text-muted-foreground/30 font-black text-4xl">
                                        ?
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Available Pool (Desktop) */}
                    <div className="hidden lg:flex flex-col h-[calc(100vh-8rem)] sticky top-24">
                        <BuildTeamPlayerPool
                            players={availablePlayers}
                            selectedCount={selectedPlayingIds.size}
                            onAddPlayer={handleAddPlayer}
                            className="overflow-hidden rounded-2xl border border-border shadow-sm"
                        />
                    </div>
                </div>
            </main>

            {/* Sticky Footer for Actions */}
            <footer className="fixed bottom-24 left-4 right-4 z-40 rounded-2xl border border-border bg-background/95 p-3 shadow-xl shadow-black/15 backdrop-blur-md md:bottom-0 md:left-0 md:right-0 md:rounded-none md:border-x-0 md:border-b-0 md:p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="hidden md:flex flex-col">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Team Status</p>
                        <p className={cn('text-sm font-bold', validation.errors.length === 0 ? 'text-green-500' : 'text-destructive')}>
                            {validation.errors.length === 0 ? 'Lineup Valid' : `${validation.errors.length} Requirements Missing`}
                        </p>
                    </div>

                    <div className="flex gap-3 flex-1 md:flex-initial">
                        <Sheet
                            open={sheetOpen}
                            onOpenChange={setSheetOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex-1 md:hidden">
                                    Pick Pool ({availablePlayers.length})
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="bottom"
                                className="h-[80vh] rounded-t-3xl p-0">
                                <BuildTeamPlayerPool
                                    players={availablePlayers}
                                    selectedCount={selectedPlayingIds.size}
                                    onAddPlayer={handleAddPlayer}
                                />
                            </SheetContent>
                        </Sheet>

                        <Button
                            size="lg"
                            className="flex-1 md:w-64 font-black uppercase tracking-widest"
                            disabled={validation.errors.length > 0 || saveMutation.isPending}
                            onClick={handleSave}>
                            {saveMutation.isPending ? 'Locking...' : 'Lock Match Team'}
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default BuildTeamPage
