import { ChevronDown, Loader2, Trophy, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFixtureTeams, useFixtures } from '@/features/admin/api/fixtures'
import { FixtureLineupDetails } from '@/features/team/components/fixture-lineup-details'

const formatDateTime = (date: string | Date | null | undefined) => {
    if (!date) return '-'

    const parsed = new Date(date)
    if (Number.isNaN(parsed.getTime())) return '-'

    return parsed.toLocaleString()
}

export default function AdminTeamsPage() {
    const [selectedFixtureId, setSelectedFixtureId] = useState('')
    const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set())
    const [selectedTeamFilter, setSelectedTeamFilter] = useState<Set<string>>(new Set())
    const [showTeamFilter, setShowTeamFilter] = useState(false)
    const { data: fixtures, isLoading: fixturesLoading, error: fixturesError } = useFixtures()

    useEffect(() => {
        if (!selectedFixtureId && fixtures?.length) {
            setSelectedFixtureId(fixtures[0].id)
        }
    }, [fixtures, selectedFixtureId])

    const toggleTeamExpanded = (teamId: string) => {
        setExpandedTeams((prev) => {
            const next = new Set(prev)
            if (next.has(teamId)) {
                next.delete(teamId)
            } else {
                next.add(teamId)
            }
            return next
        })
    }

    const toggleTeamFilter = (teamName: string) => {
        setSelectedTeamFilter((prev) => {
            const next = new Set(prev)
            if (next.has(teamName)) {
                next.delete(teamName)
            } else {
                next.add(teamName)
            }
            return next
        })
    }

    const sortedFixtures = useMemo(
        () =>
            [...(fixtures ?? [])].sort(
                (left, right) =>
                    new Date(right.startTime).getTime() - new Date(left.startTime).getTime()
            ),
        [fixtures]
    )

    const {
        data: fixtureTeams,
        isLoading: teamsLoading,
        error: teamsError
    } = useFixtureTeams(selectedFixtureId)

    // Extract unique team names from fixture teams
    const uniqueTeams = useMemo(() => {
        if (!fixtureTeams?.entries) return []
        const teams = new Set(fixtureTeams.entries.map((entry) => entry.franchise.teamName))
        return Array.from(teams).sort()
    }, [fixtureTeams])

    // Filter teams based on selected team filter
    const filteredTeams = useMemo(() => {
        if (!fixtureTeams?.entries) return []
        if (selectedTeamFilter.size === 0) return fixtureTeams.entries
        return fixtureTeams.entries.filter((entry) => selectedTeamFilter.has(entry.franchise.teamName))
    }, [fixtureTeams, selectedTeamFilter])

    if (fixturesLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (fixturesError) {
        return <div className="p-6 text-destructive">Failed to load fixtures.</div>
    }

    return (
        <div className="space-y-6 p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Teams</h1>
                    <p className="text-sm text-muted-foreground">
                        Select a fixture to review every user lineup in the same team view used on the player side.
                    </p>
                </div>

                <div className="w-full lg:w-[22rem]">
                    <Select
                        value={selectedFixtureId}
                        onValueChange={(id) => {
                            setSelectedFixtureId(id)
                            setSelectedTeamFilter(new Set())
                            setExpandedTeams(new Set())
                        }}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select fixture" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortedFixtures.map((fixture) => (
                                <SelectItem
                                    key={fixture.id}
                                    value={fixture.id}>
                                    {fixture.teamA} vs {fixture.teamB} ({fixture.id})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {!selectedFixtureId ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No fixtures available.
                    </CardContent>
                </Card>
            ) : teamsLoading ? (
                <div className="flex h-[320px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : teamsError || !fixtureTeams ? (
                <Card>
                    <CardContent className="py-12 text-center text-destructive">
                        Failed to load teams for the selected fixture.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    <Card className="border-border/70 shadow-sm">
                        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <CardTitle className="text-xl">
                                    {fixtureTeams.fixture.teamA} vs {fixtureTeams.fixture.teamB}
                                </CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Fixture ID: <span className="font-mono">{fixtureTeams.fixture.id}</span>
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline">{formatDateTime(fixtureTeams.fixture.startTime)}</Badge>
                                <Badge variant={fixtureTeams.fixture.isProcessed ? 'default' : 'secondary'}>
                                    {fixtureTeams.fixture.isProcessed ? 'Processed' : 'Pending'}
                                </Badge>
                                <Badge variant="secondary">{fixtureTeams.entries.length} teams</Badge>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Team filter section */}
                    {uniqueTeams.length > 0 && (
                        <Card className="border-border/70 shadow-sm">
                            <CardContent className="p-4 space-y-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowTeamFilter(!showTeamFilter)}
                                    className="w-full justify-between">
                                    <span className="font-medium">
                                        Filter Teams {selectedTeamFilter.size > 0 && `(${selectedTeamFilter.size} selected)`}
                                    </span>
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform ${showTeamFilter ? 'rotate-180' : ''}`}
                                    />
                                </Button>

                                {showTeamFilter && (
                                    <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {uniqueTeams.map((team) => (
                                            <div
                                                key={team}
                                                className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`team-filter-${team}`}
                                                    checked={selectedTeamFilter.has(team)}
                                                    onCheckedChange={() => toggleTeamFilter(team)}
                                                />
                                                <label
                                                    htmlFor={`team-filter-${team}`}
                                                    className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    {team}
                                                </label>
                                            </div>
                                        ))}
                                        {selectedTeamFilter.size > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedTeamFilter(new Set())}
                                                className="col-span-full text-xs">
                                                Clear filter
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {fixtureTeams.entries.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                No roster cycles were found for this fixture.
                            </CardContent>
                        </Card>
                    ) : filteredTeams.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                No teams match the selected filter.
                            </CardContent>
                        </Card>
                    ) : (
                        filteredTeams.map((entry) => {
                            const isExpanded = expandedTeams.has(entry.rosterCycleId)
                            return (
                                <Card
                                    key={entry.rosterCycleId}
                                    className="overflow-hidden border-border/70 shadow-sm">
                                    <CardHeader className="border-b bg-accent/30">
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <Avatar className="h-10 w-10 sm:h-14 sm:w-14 border flex-shrink-0">
                                                    <AvatarImage src={entry.user.profileImage ?? undefined} />
                                                    <AvatarFallback>
                                                        {entry.user.firstName?.[0]}
                                                        {entry.user.lastName?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1 min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h2 className="text-base sm:text-xl font-semibold truncate">
                                                            {entry.franchise.teamName}
                                                        </h2>
                                                        <Badge variant="outline" className="text-xs">
                                                            @{entry.user.username}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                                        {entry.user.firstName} {entry.user.lastName}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-start sm:items-center">
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="secondary" className="gap-1 text-xs sm:text-sm">
                                                        <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                        {(entry.lineupPlayers ?? []).filter((player) => player.selectionType === 'PLAYING').length} Playing
                                                    </Badge>
                                                    {entry.matchPoints ? (
                                                        <Badge variant="default" className="gap-1 text-xs sm:text-sm">
                                                            <Trophy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                            {entry.matchPoints.totalPoints} pts
                                                        </Badge>
                                                    ) : null}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toggleTeamExpanded(entry.rosterCycleId)}
                                                    className="w-full sm:w-auto gap-2 justify-center sm:justify-start">
                                                    <span className="text-xs sm:text-sm">
                                                        {isExpanded ? 'Collapse' : 'Expand'}
                                                    </span>
                                                    <ChevronDown
                                                        className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    {isExpanded && (
                                        <CardContent className="p-4 sm:p-6">
                                            <FixtureLineupDetails
                                                lineupResponse={{
                                                    fixture: fixtureTeams.fixture,
                                                    lineup: entry.lineup,
                                                    lineupPlayers: entry.lineupPlayers,
                                                    matchPoints: entry.matchPoints
                                                }}
                                                heading={entry.franchise.teamName}
                                                description={`${entry.user.firstName} ${entry.user.lastName}'s playing XII for ${fixtureTeams.fixture.teamA} vs ${fixtureTeams.fixture.teamB}.`}
                                                showMatchBanner={false}
                                                emptyStateTitle="No lineup available"
                                                emptyStateDescription="This user has not submitted a fixture lineup yet, and no auto-applied lineup was found."
                                            />
                                        </CardContent>
                                    )}
                                </Card>
                            )
                        })
                    )}
                </div>
            )}
        </div>
    )
}
