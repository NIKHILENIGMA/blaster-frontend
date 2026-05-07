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
import { useFixtures, useUpdateFixtureStatus } from '@/features/admin/api/fixtures'
import { CreateFixtureModal } from '@/features/admin/components/create-fixture-modal'

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

export default function FixturesPage() {
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [createModalOpen, setCreateModalOpen] = useState(false)
    
    const { data: fixtures, isLoading, error } = useFixtures()
    const updateStatusMutation = useUpdateFixtureStatus()

    const updateStatus = (id: string, newStatus: string) => {
        updateStatusMutation.mutate(
            { fixtureId: id, status: newStatus.toLowerCase() },
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
                                    <TableHead className="font-semibold">Match ID</TableHead>
                                    <TableHead className="font-semibold">Teams</TableHead>
                                    <TableHead className="font-semibold">Date</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold text-center">Processed</TableHead>
                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFixtures?.map((fixture) => (
                                    <TableRow
                                        key={fixture.id}
                                        className="hover:bg-accent/50 border-b">
                                        <TableCell className="font-mono text-sm">{fixture.matchId}</TableCell>
                                        <TableCell className="text-sm">
                                            <div className="space-y-0.5">
                                                <p className="font-medium">{fixture.teamA}</p>
                                                <p className="text-muted-foreground">vs {fixture.teamB}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">{new Date(fixture.startTime).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(fixture.matchStatus || 'upcoming')}>
                                                {fixture.matchStatus || 'upcoming'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Checkbox
                                                checked={fixture.isProcessed}
                                                disabled
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        disabled={updateStatusMutation.isPending}>
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel className="text-xs">Update Status</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => updateStatus(fixture.id, 'upcoming')}>
                                                        Mark Upcoming
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
                                className="border">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-xs font-mono text-muted-foreground mb-1">{fixture.matchId}</p>
                                            <h3 className="font-semibold text-sm">
                                                {fixture.teamA} vs {fixture.teamB}
                                            </h3>
                                        </div>
                                        <Badge className={getStatusColor(fixture.matchStatus || 'upcoming')}>
                                            {fixture.matchStatus || 'upcoming'}
                                        </Badge>
                                    </div>
                                    <div className="flex gap-3 text-xs text-muted-foreground">
                                        <span>📅 {new Date(fixture.startTime).toLocaleString()}</span>
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
                                                    disabled={updateStatusMutation.isPending}>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
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
