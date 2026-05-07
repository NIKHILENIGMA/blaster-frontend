import {
    AlertTriangle,
    CheckCircle2,
    Copy,
    Download,
    Loader2,
    ShieldCheck,
    Sparkles,
    Trophy
} from 'lucide-react'
import { toast } from 'sonner'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useFixtureTeams, usePublishPoints } from '../api/fixtures'
import type { AdminFixtureTeamsResponse } from '../types/teams'

type FixtureTeamEntry = AdminFixtureTeamsResponse['entries'][number]

type PlayerBreakdown = {
    batting?: Record<string, unknown>
    bowling?: Record<string, unknown>
    fielding?: Record<string, unknown>
    role?: Record<string, unknown>
    totalBasePoints?: number
    finalPoints?: number
}

const RULES_LEGEND = [
    'Captain multiplier: x4',
    'Vice-captain multiplier: x3',
    'Impact player multiplier: x5.5',
    'Overseas player multiplier: x1.5',
    'Batting points include runs, 4s, 6s, strike-rate, milestones, and duck penalty',
    'Bowling points include wickets, dot balls, milestones, over bonus, economy, maidens, and lbw/bowled bonus',
    'Fielding points include catches, run-outs, stumpings, and fielding milestone bonuses'
]

const formatPoints = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-'
    return Number.isInteger(value) ? `${value}` : value.toFixed(2)
}

const getBreakdown = (value: Record<string, unknown> | null | undefined): PlayerBreakdown =>
    (value ?? {}) as PlayerBreakdown

const asEntries = (section?: Record<string, unknown>) =>
    Object.entries(section ?? {}).filter(([, value]) => typeof value === 'number')

const buildPlayerFlags = (entry: FixtureTeamEntry, player: FixtureTeamEntry['lineupPlayers'][number]) => {
    const flags: string[] = []

    if (entry.lineup?.captainId === player.id) flags.push('Captain')
    if (entry.lineup?.viceCaptainId === player.id) flags.push('Vice Captain')
    if (entry.lineup?.impactPlayerId === player.id) flags.push('Impact Player')
    if (player.isOverseas) flags.push('Overseas')
    if (player.selectionType === 'SUBSTITUTE') flags.push('Substitute')

    return flags
}

const buildRawStats = (player: FixtureTeamEntry['lineupPlayers'][number]) => {
    const items = [
        ['Runs', player.runs],
        ['4s', player.fours],
        ['6s', player.sixes],
        ['Wkts', player.wickets],
        ['Catches', player.catches],
        ['Runouts', player.runouts]
    ] as const

    return items.filter(([, value]) => value !== null && value !== undefined)
}

const getEntryWarnings = (entry: FixtureTeamEntry) => {
    const warnings: string[] = []
    const playingCount = entry.lineupPlayers.filter((player) => player.selectionType === 'PLAYING').length

    if (!entry.lineup) warnings.push('No lineup submitted')
    if (entry.lineup?.autoAppliedFromLineupId) warnings.push('Auto-applied lineup used')
    if (entry.matchPoints?.totalPoints === 0) warnings.push('Total points are zero')
    if (playingCount > 0 && playingCount !== 12) warnings.push(`Unexpected playing XII count: ${playingCount}`)

    return warnings
}

const downloadCsv = (fixtureName: string, entries: FixtureTeamEntry[]) => {
    const rows = [
        [
            'Rank',
            'Franchise',
            'Username',
            'Full Name',
            'Email',
            'Points',
            'Playing Count',
            'Lineup Status',
            'Auto Applied'
        ],
        ...entries.map((entry, index) => [
            `${index + 1}`,
            entry.franchise.teamName,
            entry.user.username,
            `${entry.user.firstName} ${entry.user.lastName}`,
            entry.user.email,
            `${entry.matchPoints?.totalPoints ?? 0}`,
            `${entry.lineupPlayers.filter((player) => player.selectionType === 'PLAYING').length}`,
            entry.lineup?.status ?? 'none',
            entry.lineup?.autoAppliedFromLineupId ? 'yes' : 'no'
        ])
    ]

    const csv = rows
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${fixtureName.replace(/\s+/g, '-').toLowerCase()}-points-preview.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
    return (
        <Card className="gap-3 border-border bg-card py-4 shadow-sm">
            <CardContent className="px-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
                <p className="mt-2 text-2xl font-extrabold leading-none text-foreground">{value}</p>
                {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
            </CardContent>
        </Card>
    )
}

function SectionBreakdown({
    title,
    entries
}: {
    title: string
    entries: Array<[string, unknown]>
}) {
    if (entries.length === 0) return null

    return (
        <div className="rounded-xl border border-border/80 bg-muted/40 p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{title}</p>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {entries.map(([label, value]) => (
                    <div
                        key={`${title}-${label}`}
                        className="rounded-md border border-border/70 bg-background px-3 py-2 text-sm shadow-sm">
                        <span className="text-muted-foreground">{label}: </span>
                        <span className="font-semibold">{formatPoints(value as number)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function PlayerBreakdownCard({
    entry,
    player
}: {
    entry: FixtureTeamEntry
    player: FixtureTeamEntry['lineupPlayers'][number]
}) {
    const breakdown = getBreakdown(player.breakdown)
    const flags = buildPlayerFlags(entry, player)
    const rawStats = buildRawStats(player)

    return (
        <Card className="gap-4 border-border bg-card py-4 shadow-sm">
            <CardContent className="space-y-4 px-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base font-semibold sm:text-lg">{player.name}</h4>
                            <Badge variant="outline">{player.role}</Badge>
                            <Badge variant={player.selectionType === 'PLAYING' ? 'default' : 'secondary'}>
                                {player.selectionType}
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {player.iplTeam} • {player.isOverseas ? 'Overseas' : 'Domestic'}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {flags.map((flag) => (
                            <Badge
                                key={`${player.id}-${flag}`}
                                variant="secondary">
                                {flag}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard label="Base Points" value={formatPoints(player.basePoints)} />
                    <MetricCard label="Multiplier" value={formatPoints(player.multiplier)} />
                    <MetricCard label="Bonus Points" value={formatPoints(player.bonusPoints)} />
                    <MetricCard label="Final Points" value={formatPoints(player.finalPoints)} />
                </div>

                {rawStats.length > 0 ? (
                    <div className="rounded-lg border bg-accent/20 p-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Raw Match Stats</p>
                        <div className="flex flex-wrap gap-2">
                            {rawStats.map(([label, value]) => (
                                <Badge
                                    key={`${player.id}-${label}`}
                                    variant="outline">
                                    {label}: {value}
                                </Badge>
                            ))}
                        </div>
                    </div>
                ) : null}

                <div className="space-y-3">
                    <SectionBreakdown title="Batting" entries={asEntries(breakdown.batting)} />
                    <SectionBreakdown title="Bowling" entries={asEntries(breakdown.bowling)} />
                    <SectionBreakdown title="Fielding" entries={asEntries(breakdown.fielding)} />
                    <SectionBreakdown title="Role & Multiplier" entries={asEntries(breakdown.role)} />
                </div>
            </CardContent>
        </Card>
    )
}

type PointsPreviewContentProps = {
    fixtureId: string
    fixtureName: string
    onPublishSuccess?: () => void
}

export function PointsPreviewContent({
    fixtureId,
    fixtureName,
    onPublishSuccess
}: PointsPreviewContentProps) {
    const { data: fixtureTeams, isLoading, error } = useFixtureTeams(fixtureId)
    const publishMutation = usePublishPoints()

    const sortedEntries = [...(fixtureTeams?.entries ?? [])].sort(
        (left, right) => (right.matchPoints?.totalPoints ?? -1) - (left.matchPoints?.totalPoints ?? -1)
    )

    const scoredEntries = sortedEntries.filter((entry) => entry.matchPoints)
    const totalUsers = sortedEntries.length
    const totalScored = scoredEntries.length
    const highestPoints = scoredEntries[0]?.matchPoints?.totalPoints ?? null
    const lowestPoints = scoredEntries[scoredEntries.length - 1]?.matchPoints?.totalPoints ?? null
    const averagePoints =
        scoredEntries.length > 0
            ? scoredEntries.reduce((sum, entry) => sum + (entry.matchPoints?.totalPoints ?? 0), 0) /
              scoredEntries.length
            : null
    const autoAppliedCount = sortedEntries.filter((entry) => entry.lineup?.autoAppliedFromLineupId).length
    const noLineupCount = sortedEntries.filter((entry) => !entry.lineup).length
    const zeroPointCount = scoredEntries.filter((entry) => entry.matchPoints?.totalPoints === 0).length
    const hasCalculatedData = scoredEntries.length > 0

    const handlePublish = () => {
        publishMutation.mutate(fixtureId, {
            onSuccess: () => {
                toast.success('Points published successfully!')
                onPublishSuccess?.()
            },
            onError: (err) => {
                toast.error(err.message || 'Failed to publish points')
            }
        })
    }

    const handleCopyJson = async () => {
        if (!fixtureTeams) return

        await navigator.clipboard.writeText(JSON.stringify(fixtureTeams, null, 2))
        toast.success('Preview JSON copied to clipboard')
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-border bg-card">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !fixtureTeams) {
        return (
            <Card className="border-border bg-card py-8">
                <CardContent className="px-5 text-center text-destructive">
                    Failed to load preview. Please calculate points first.
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-5 sm:space-y-6">
            <Card className="gap-4 border-border bg-card py-5 shadow-sm">
                <CardContent className="space-y-4 px-4 sm:px-5">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                                <Badge variant={fixtureTeams.fixture.isProcessed ? 'default' : 'secondary'}>
                                    {fixtureTeams.fixture.isProcessed ? 'Published' : 'Calculated, not published'}
                                </Badge>
                                <Badge variant="outline">Fixture ID: {fixtureTeams.fixture.id}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {fixtureTeams.fixture.isProcessed
                                    ? 'These points are already published and rank snapshots are locked.'
                                    : 'Sandbox calculation complete. Review carefully before publishing.'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                            <Button
                                variant="outline"
                                onClick={() => downloadCsv(fixtureName, sortedEntries)}
                                disabled={!sortedEntries.length}
                                className="w-full sm:w-auto">
                                <Download className="mr-2 h-4 w-4" />
                                Export CSV
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleCopyJson}
                                disabled={!sortedEntries.length}
                                className="w-full sm:w-auto">
                                <Copy className="mr-2 h-4 w-4" />
                                Copy JSON
                            </Button>
                            <Button
                                onClick={handlePublish}
                                disabled={!hasCalculatedData || publishMutation.isPending || fixtureTeams.fixture.isProcessed}
                                className="w-full gap-2 sm:w-auto">
                                {publishMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                {fixtureTeams.fixture.isProcessed ? 'Already Published' : 'Publish Points'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                <MetricCard label="User Teams" value={`${totalUsers}`} />
                <MetricCard label="Scored Teams" value={`${totalScored}`} />
                <MetricCard label="Highest" value={formatPoints(highestPoints)} />
                <MetricCard label="Lowest" value={formatPoints(lowestPoints)} />
                <MetricCard label="Average" value={formatPoints(averagePoints)} />
                <MetricCard label="Auto Applied" value={`${autoAppliedCount}`} hint={`${noLineupCount} with no lineup`} />
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
                <Card className="gap-4 border-border bg-card py-5 shadow-sm">
                    <CardHeader className="px-5 pb-0">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Audit Flags
                        </CardTitle>
                        <CardDescription>
                            Quick checks to catch suspicious outcomes before points are published.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-5">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">No lineup: {noLineupCount}</Badge>
                            <Badge variant="secondary">Auto-applied: {autoAppliedCount}</Badge>
                            <Badge variant="secondary">Zero-point teams: {zeroPointCount}</Badge>
                            <Badge variant="secondary">
                                Incomplete playing XII:{' '}
                                {
                                    sortedEntries.filter(
                                        (entry) =>
                                            entry.lineupPlayers.filter((player) => player.selectionType === 'PLAYING').length > 0 &&
                                            entry.lineupPlayers.filter((player) => player.selectionType === 'PLAYING').length !== 12
                                    ).length
                                }
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="gap-4 border-border bg-card py-5 shadow-sm">
                    <CardHeader className="px-5 pb-0">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ShieldCheck className="h-5 w-5 text-emerald-600" />
                            Rules Legend
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5">
                        <div className="space-y-2 text-sm text-muted-foreground">
                            {RULES_LEGEND.map((rule) => (
                                <p key={rule}>{rule}</p>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {!hasCalculatedData ? (
                <Card className="gap-4 border-dashed bg-card py-6 shadow-sm">
                    <CardContent className="px-5 text-center">
                        <Sparkles className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                        <p className="text-lg font-semibold">No calculated points yet</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Run the scoring engine first. Once calculation completes, this preview will show user totals and per-player breakdown.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card className="gap-4 border-border bg-card py-5 shadow-sm">
                    <CardHeader className="px-4 pb-0 sm:px-5">
                        <CardTitle>User Point Verification</CardTitle>
                        <CardDescription>
                            Expand any user to inspect raw stats, multipliers, and final player contributions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-5">
                        <Accordion type="single" collapsible className="w-full">
                            {sortedEntries.map((entry, index) => {
                                const warnings = getEntryWarnings(entry)
                                const playingPlayers = entry.lineupPlayers.filter((player) => player.selectionType === 'PLAYING')
                                const benchPlayers = entry.lineupPlayers.filter((player) => player.selectionType === 'SUBSTITUTE')

                                return (
                                    <AccordionItem
                                        key={entry.rosterCycleId}
                                        value={entry.rosterCycleId}
                                        className="mb-3 overflow-hidden rounded-lg border border-border/80 bg-background px-3 last:mb-0 sm:px-4">
                                        <AccordionTrigger className="py-4 hover:no-underline">
                                            <div className="flex w-full flex-col gap-3 pr-2 lg:flex-row lg:items-center lg:justify-between">
                                                <div className="flex items-center gap-3 sm:gap-4">
                                                    <Avatar className="h-10 w-10 border sm:h-12 sm:w-12">
                                                        <AvatarImage src={entry.user.profileImage ?? undefined} />
                                                        <AvatarFallback>
                                                            {entry.user.firstName?.[0]}
                                                            {entry.user.lastName?.[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0 text-left">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <p className="text-sm font-semibold sm:text-base">{entry.franchise.teamName}</p>
                                                            <Badge variant="outline">@{entry.user.username}</Badge>
                                                            <Badge variant="secondary">#{index + 1}</Badge>
                                                        </div>
                                                        <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">
                                                            {entry.user.firstName} {entry.user.lastName} • {entry.user.email}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    {entry.lineup?.autoAppliedFromLineupId ? <Badge variant="secondary">Auto Applied</Badge> : null}
                                                    {!entry.lineup ? <Badge variant="destructive">No Lineup</Badge> : null}
                                                    <Badge variant="outline">{playingPlayers.length} playing</Badge>
                                                    <Badge variant={entry.matchPoints ? 'default' : 'secondary'} className="gap-1">
                                                        <Trophy className="h-3.5 w-3.5" />
                                                        {formatPoints(entry.matchPoints?.totalPoints)}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </AccordionTrigger>

                                        <AccordionContent>
                                            <div className="space-y-5 pb-4 pt-1">
                                                <div className="grid gap-4 lg:grid-cols-4">
                                                    <MetricCard label="Fixture Points" value={formatPoints(entry.matchPoints?.totalPoints)} />
                                                    <MetricCard
                                                        label="Published Rank"
                                                        value={entry.matchPoints?.rankSnapshot ? `#${entry.matchPoints.rankSnapshot}` : `#${index + 1}`}
                                                        hint={fixtureTeams.fixture.isProcessed ? 'Locked rank snapshot' : 'Preview order before publish'}
                                                    />
                                                    <MetricCard label="Lineup Status" value={entry.lineup?.status ?? 'none'} />
                                                    <MetricCard label="Playing / Bench" value={`${playingPlayers.length} / ${benchPlayers.length}`} />
                                                </div>

                                                {warnings.length > 0 ? (
                                                    <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                                                        <p className="font-semibold">Warnings</p>
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {warnings.map((warning) => (
                                                                <Badge
                                                                    key={`${entry.rosterCycleId}-${warning}`}
                                                                    variant="outline"
                                                                    className="border-amber-400 text-amber-900">
                                                                    {warning}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : null}

                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                                            Playing XII Breakdown
                                                        </p>
                                                        <div className="mt-3 grid gap-4 2xl:grid-cols-2">
                                                            {playingPlayers.map((player) => (
                                                                <PlayerBreakdownCard key={player.id} entry={entry} player={player} />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {benchPlayers.length > 0 ? (
                                                        <>
                                                            <Separator />
                                                            <div>
                                                                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                                                    Substitute Bench
                                                                </p>
                                                                <div className="mt-3 grid gap-4 2xl:grid-cols-2">
                                                                    {benchPlayers.map((player) => (
                                                                        <PlayerBreakdownCard key={player.id} entry={entry} player={player} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
