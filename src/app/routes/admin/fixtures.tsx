import { Copy, Loader2, MoreVertical, Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useFixtures, useUpdateFixture } from '@/features/admin/api/fixtures'
import { useMatches } from '@/features/admin/api/matches'
import { CreateFixtureModal } from '@/features/admin/components/create-fixture-modal'
import { EditFixtureModal } from '@/features/admin/components/edit-fixture-modal'
import type { Fixture } from '@/features/admin/types/fixtures'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
        case 'UPCOMING':
        case 'SCHEDULED':
            return 'bg-gray-100 text-gray-800'
        case 'LIVE':
            return 'bg-green-100 text-green-800'
        case 'COMPLETED':
            return 'bg-blue-100 text-blue-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

const formatDateTime = (date: string | Date | null | undefined) => {
    if (!date) return '-'

    const parsed = new Date(date)
    if (Number.isNaN(parsed.getTime())) return '-'

    return parsed.toLocaleString()
}

const copyToClipboard = async (value: string, label: string) => {
    try {
        await navigator.clipboard.writeText(value)
        toast.success(`${label} copied`)
    } catch {
        toast.error(`Failed to copy ${label.toLowerCase()}`)
    }
}

const getFixtureCopyText = (fixture: Fixture) =>
    [
        `${fixture.teamA} vs ${fixture.teamB}`,
        `Fixture ID: ${fixture.id}`,
        `Match ID: ${fixture.matchId}`,
        `Match Number: ${fixture.matchNumber || '-'}`,
        `Start Time: ${formatDateTime(fixture.startTime)}`,
        `Lineup Lock: ${formatDateTime(fixture.lineupLockAt)}`,
        `Venue: ${fixture.venueId || '-'}`,
        `Status: ${fixture.matchStatus || 'scheduled'}`
    ].join('\n')

export default function FixturesPage() {
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [matchIdFilter, setMatchIdFilter] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null)
    const [editModalOpen, setEditModalOpen] = useState(false)

    const { data: fixtures = [], isLoading, error } = useFixtures()
    const { data: matches = [] } = useMatches()
    const updateFixtureMutation = useUpdateFixture()

    const matchTitleById = useMemo(() => {
        return new Map(matches.map((match) => [match.id, match.title]))
    }, [matches])

    const matchIdOptions = useMemo(() => {
        return Array.from(new Set(fixtures.map((fixture) => fixture.matchId))).sort()
    }, [fixtures])

    const filteredFixtures = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase()

        return fixtures
            .filter((fixture) => {
                if (statusFilter !== 'all' && (fixture.matchStatus || 'scheduled') !== statusFilter) return false
                if (matchIdFilter !== 'all' && fixture.matchId !== matchIdFilter) return false

                if (!normalizedQuery) return true

                return [
                    fixture.id,
                    fixture.matchId,
                    fixture.teamA,
                    fixture.teamB,
                    fixture.matchNumber,
                    fixture.venueId,
                    fixture.matchResult,
                    fixture.matchStatus
                ]
                    .filter(Boolean)
                    .some((value) => String(value).toLowerCase().includes(normalizedQuery))
            })
            .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    }, [fixtures, matchIdFilter, searchQuery, statusFilter])

    const totalPages = Math.max(1, Math.ceil(filteredFixtures.length / pageSize))
    const paginatedFixtures = useMemo(() => {
        const start = (page - 1) * pageSize
        return filteredFixtures.slice(start, start + pageSize)
    }, [filteredFixtures, page, pageSize])

    useEffect(() => {
        setPage(1)
    }, [matchIdFilter, pageSize, searchQuery, statusFilter])

    const updateStatus = (id: string, newStatus: 'scheduled' | 'live' | 'completed') => {
        updateFixtureMutation.mutate(
            {
                fixtureId: id,
                data: { matchStatus: newStatus }
            },
            {
                onSuccess: () => {
                    toast.success('Fixture status updated successfully')
                },
                onError: (err) => {
                    toast.error(err.message || 'Failed to update status')
                }
            }
        )
    }

    const openEditModal = (fixture: Fixture) => {
        setSelectedFixture(fixture)
        setEditModalOpen(true)
    }

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center gap-4">
                <p className="text-destructive font-medium">Failed to load fixtures</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-4 sm:p-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-bold uppercase text-primary">Admin Controls</p>
                    <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">IPL Fixtures</h1>
                    <p className="text-sm text-muted-foreground">Search, filter, copy, and edit fixture schedule details from one dashboard.</p>
                </div>
                <Button
                    onClick={() => setCreateModalOpen(true)}
                    className="w-full gap-2 sm:w-auto">
                    <Plus className="h-4 w-4" />
                    Create Fixture
                </Button>
            </div>

            <CreateFixtureModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
            />
            <EditFixtureModal
                fixture={selectedFixture}
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
            />

            <Card>
                <CardHeader className="space-y-4 border-b bg-accent/30">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-base sm:text-lg">Fixture Directory</CardTitle>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{filteredFixtures.length} shown</Badge>
                            <Badge variant="outline">{fixtures.length} total</Badge>
                        </div>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_260px_130px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Search teams, fixture ID, match ID, venue..."
                                className="pl-9"
                            />
                        </div>

                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="live">Live</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={matchIdFilter}
                            onValueChange={setMatchIdFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Match ID" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Match IDs</SelectItem>
                                {matchIdOptions.map((matchId) => (
                                    <SelectItem
                                        key={matchId}
                                        value={matchId}>
                                        {matchTitleById.get(matchId) || matchId}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={String(pageSize)}
                            onValueChange={(value) => setPageSize(Number(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Rows" />
                            </SelectTrigger>
                            <SelectContent>
                                {PAGE_SIZE_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option}
                                        value={String(option)}>
                                        {option} rows
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="hidden overflow-x-auto md:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b bg-accent/20 hover:bg-transparent">
                                    <TableHead className="min-w-[320px] font-semibold">Fixture</TableHead>
                                    <TableHead className="min-w-[220px] font-semibold">Schedule</TableHead>
                                    <TableHead className="min-w-[180px] font-semibold">Venue</TableHead>
                                    <TableHead className="min-w-[150px] font-semibold">Status</TableHead>
                                    <TableHead className="text-center font-semibold">Processed</TableHead>
                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedFixtures.map((fixture) => (
                                    <TableRow
                                        key={fixture.id}
                                        className="border-b hover:bg-accent/40">
                                        <TableCell className="align-top text-sm">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-semibold">{fixture.teamA}</p>
                                                    <span className="text-xs text-muted-foreground">vs</span>
                                                    <p className="font-semibold">{fixture.teamB}</p>
                                                    <Badge
                                                        variant="outline"
                                                        className="h-5 px-1.5 text-[10px]">
                                                        {fixture.matchNumber || 'No match #'}
                                                    </Badge>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(fixture.id, 'Fixture ID')}
                                                    className="flex max-w-full items-center gap-1 text-left font-mono text-xs text-muted-foreground hover:text-foreground">
                                                    <Copy className="h-3.5 w-3.5 shrink-0" />
                                                    <span className="truncate">{fixture.id}</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(fixture.matchId, 'Match ID')}
                                                    className="flex max-w-full items-center gap-1 text-left font-mono text-xs text-muted-foreground hover:text-foreground">
                                                    <Copy className="h-3.5 w-3.5 shrink-0" />
                                                    <span className="truncate">{fixture.matchId}</span>
                                                </button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-top text-sm">
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-[11px] font-medium text-muted-foreground">Start Time</p>
                                                    <p>{formatDateTime(fixture.startTime)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-medium text-muted-foreground">Lineup Lock</p>
                                                    <p>{formatDateTime(fixture.lineupLockAt)}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[220px] align-top text-sm">
                                            <p className="break-words">{fixture.venueId || '-'}</p>
                                            <p className="mt-2 text-xs text-muted-foreground">Result: {fixture.matchResult || '-'}</p>
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <Badge className={getStatusColor(fixture.matchStatus || 'scheduled')}>
                                                {fixture.matchStatus || 'scheduled'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Checkbox
                                                    checked={fixture.isProcessed}
                                                    disabled
                                                />
                                                <span className="text-xs text-muted-foreground">
                                                    {fixture.isProcessed ? 'Done' : 'Pending'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => copyToClipboard(getFixtureCopyText(fixture), 'Fixture details')}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            disabled={updateFixtureMutation.isPending}>
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditModal(fixture)}>Edit Fixture</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => copyToClipboard(getFixtureCopyText(fixture), 'Fixture details')}>
                                                            Copy Fixture
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuLabel className="text-xs">Update Status</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => updateStatus(fixture.id, 'scheduled')}>
                                                            Mark Scheduled
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateStatus(fixture.id, 'live')}>Mark Live</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateStatus(fixture.id, 'completed')}>
                                                            Mark Completed
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="space-y-3 p-4 md:hidden">
                        {paginatedFixtures.map((fixture) => (
                            <Card
                                key={fixture.id}
                                className="border shadow-sm">
                                <CardContent className="space-y-4 p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-semibold leading-tight">
                                                {fixture.teamA} vs {fixture.teamB}
                                            </h3>
                                            <p className="mt-1 text-xs text-muted-foreground">{fixture.matchNumber || 'No match number'}</p>
                                        </div>
                                        <Badge className={getStatusColor(fixture.matchStatus || 'scheduled')}>
                                            {fixture.matchStatus || 'scheduled'}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 rounded-md border bg-muted/30 p-3 text-xs">
                                        <div className="flex justify-between gap-3">
                                            <span className="text-muted-foreground">Start</span>
                                            <span className="text-right font-medium">{formatDateTime(fixture.startTime)}</span>
                                        </div>
                                        <div className="flex justify-between gap-3">
                                            <span className="text-muted-foreground">Lineup Lock</span>
                                            <span className="text-right font-medium">{formatDateTime(fixture.lineupLockAt)}</span>
                                        </div>
                                        <div className="flex justify-between gap-3">
                                            <span className="text-muted-foreground">Venue</span>
                                            <span className="text-right font-medium">{fixture.venueId || '-'}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 rounded-md border p-3">
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(fixture.id, 'Fixture ID')}
                                            className="flex w-full items-start gap-2 text-left">
                                            <Copy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                            <span className="break-all font-mono text-[11px]">{fixture.id}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(fixture.matchId, 'Match ID')}
                                            className="flex w-full items-start gap-2 text-left">
                                            <Copy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                            <span className="break-all font-mono text-[11px]">{fixture.matchId}</span>
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between border-t pt-2">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={fixture.isProcessed}
                                                disabled
                                            />
                                            <span className="text-xs text-muted-foreground">{fixture.isProcessed ? 'Processed' : 'Pending'}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                                onClick={() => copyToClipboard(getFixtureCopyText(fixture), 'Fixture details')}>
                                                <Copy className="h-4 w-4" />
                                                Copy
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditModal(fixture)}>
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {paginatedFixtures.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <p>No fixtures found</p>
                        </div>
                    ) : null}

                    <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Page {page} of {totalPages} · {filteredFixtures.length} fixture{filteredFixtures.length === 1 ? '' : 's'}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage((current) => Math.max(1, current - 1))}>
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === totalPages}
                                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
