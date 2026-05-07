import { MoreVertical, Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useFixtures, useUpdateFixture } from '@/features/admin/api/fixtures'
import { CreateFixtureModal } from '@/features/admin/components/create-fixture-modal'
import { EditFixtureModal } from '@/features/admin/components/edit-fixture-modal'
import type { Fixture } from '@/features/admin/types/fixtures'

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

export default function FixturesPage() {
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null)
    const [editModalOpen, setEditModalOpen] = useState(false)

    const { data: fixtures, isLoading, error } = useFixtures()
    const updateFixtureMutation = useUpdateFixture()

    const updateStatus = (id: string, newStatus: string) => {
        updateFixtureMutation.mutate(
            {
                fixtureId: id,
                data: { matchStatus: newStatus.toLowerCase() as 'scheduled' | 'live' | 'completed' }
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

    const filteredFixtures =
        statusFilter === 'all'
            ? fixtures
            : fixtures?.filter((f) => (f.matchStatus || 'upcoming').toUpperCase() === statusFilter.toUpperCase())

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
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">IPL Fixtures</h1>
                    <p className="text-sm text-muted-foreground">Manage match fixtures and processing status</p>
                </div>
                <Button
                    onClick={() => setCreateModalOpen(true)}
                    className="w-full sm:w-auto gap-2">
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table container */}
            <Card className="overflow-hidden">
                <CardHeader className="border-b bg-accent/50">
                    <CardTitle className="text-base sm:text-lg">Fixtures List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Desktop table */}
                    <div className="hidden sm:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b bg-accent/30">
                                    <TableHead className="font-semibold min-w-[340px]">Fixture</TableHead>
                                    <TableHead className="font-semibold min-w-[220px]">Schedule</TableHead>
                                    <TableHead className="font-semibold min-w-[180px]">Venue</TableHead>
                                    <TableHead className="font-semibold min-w-[170px]">Status & Result</TableHead>
                                    <TableHead className="font-semibold text-center">Processed</TableHead>
                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFixtures?.map((fixture) => (
                                    <TableRow
                                        key={fixture.id}
                                        className="hover:bg-accent/50 border-b">
                                        <TableCell className="text-sm align-top">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold">{fixture.teamA}</p>
                                                    <span className="text-muted-foreground text-xs">vs</span>
                                                    <p className="font-semibold">{fixture.teamB}</p>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] h-5 px-1.5">
                                                        Match #{fixture.matchNumber || '-'}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[11px] text-muted-foreground font-medium">Fixture ID</p>
                                                    <p className="font-mono text-xs break-all">{fixture.id}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[11px] text-muted-foreground font-medium">Match ID</p>
                                                    <p className="font-mono text-xs break-all">{fixture.matchId}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm align-top">
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-[11px] text-muted-foreground font-medium">Start Time</p>
                                                    <p>{formatDateTime(fixture.startTime)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] text-muted-foreground font-medium">Lineup Lock</p>
                                                    <p>{formatDateTime(fixture.lineupLockAt)}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm align-top break-words">{fixture.venueId || '-'}</TableCell>
                                        <TableCell className="align-top">
                                            <div className="space-y-2">
                                                <Badge className={getStatusColor(fixture.matchStatus || 'upcoming')}>
                                                    {fixture.matchStatus || 'upcoming'}
                                                </Badge>
                                                <p className="text-sm">
                                                    <span className="text-muted-foreground">Result: </span>
                                                    {fixture.matchResult || '-'}
                                                </p>
                                            </div>
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
                                            <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        disabled={updateFixtureMutation.isPending}>
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditModal(fixture)}>
                                                        Edit Lock Time
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
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile card view */}
                    <div className="sm:hidden space-y-3 p-4">
                        {filteredFixtures?.map((fixture) => (
                            <Card
                                key={fixture.id}
                                className="border shadow-sm">
                                <CardContent className="p-4 space-y-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm leading-tight">
                                                {fixture.teamA} vs {fixture.teamB}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Match #{fixture.matchNumber || '-'}
                                            </p>
                                        </div>
                                        <Badge className={getStatusColor(fixture.matchStatus || 'upcoming')}>
                                            {fixture.matchStatus || 'upcoming'}
                                        </Badge>
                                    </div>

                                    <div className="rounded-md border bg-muted/30 p-3 space-y-2 text-xs">
                                        <div className="flex justify-between gap-3 items-start">
                                            <span className="text-muted-foreground">Match #</span>
                                            <span className="font-medium text-right">{fixture.matchNumber || '-'}</span>
                                        </div>
                                        <div className="flex justify-between gap-3 items-start">
                                            <span className="text-muted-foreground">Start</span>
                                            <span className="font-medium text-right">{formatDateTime(fixture.startTime)}</span>
                                        </div>
                                        <div className="flex justify-between gap-3 items-start">
                                            <span className="text-muted-foreground">Lineup Lock</span>
                                            <span className="font-medium text-right">{formatDateTime(fixture.lineupLockAt)}</span>
                                        </div>
                                        <div className="flex justify-between gap-3 items-start">
                                            <span className="text-muted-foreground">Venue</span>
                                            <span className="font-medium text-right">{fixture.venueId || '-'}</span>
                                        </div>
                                        <div className="flex justify-between gap-3 items-start">
                                            <span className="text-muted-foreground">Result</span>
                                            <span className="font-medium text-right">{fixture.matchResult || '-'}</span>
                                        </div>
                                    </div>

                                    <div className="rounded-md border p-3 space-y-1">
                                        <p className="text-[11px] text-muted-foreground font-medium">Fixture ID</p>
                                        <p className="font-mono text-[11px] break-all">{fixture.id}</p>
                                        <p className="text-[11px] text-muted-foreground font-medium mt-2">Match ID</p>
                                        <p className="font-mono text-[11px] break-all">{fixture.matchId}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={fixture.isProcessed}
                                                disabled
                                            />
                                            <span className="text-xs text-muted-foreground">{fixture.isProcessed ? 'Processed' : 'Pending'}</span>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    disabled={updateFixtureMutation.isPending}>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => openEditModal(fixture)}>
                                                    Edit Lock Time
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => updateStatus(fixture.id, 'scheduled')}>
                                                    Mark Scheduled
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateStatus(fixture.id, 'live')}>
                                                    Mark Live
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateStatus(fixture.id, 'completed')}>
                                                    Mark Completed
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {(!filteredFixtures || filteredFixtures.length === 0) && (
                        <div className="p-8 text-center text-muted-foreground">
                            <p>No fixtures found</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
