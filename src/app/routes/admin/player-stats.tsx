import { Edit, Loader2, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PlayerManagementFilters } from '@/features/admin/components/player-management-filters'
import { PlayerFormModal } from '@/features/admin/components/player-form-modal'
import { useAdminPlayers } from '@/features/admin/api/players'
import type { AdminPlayer } from '@/features/admin/types/players'
import type { Nationality, Roles, Teams } from '@/features/franchise/types/teams'

const PAGE_SIZE = 50

const formatCost = (value: number) => {
    if (Number.isInteger(value)) return `${value}`
    return value.toFixed(2)
}

const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pages: Array<number | 'ellipsis-left' | 'ellipsis-right'> = []
    const showEllipsisLeft = currentPage > 3
    const showEllipsisRight = currentPage < totalPages - 2

    if (showEllipsisLeft) {
        pages.push(1, 'ellipsis-left')
    } else {
        for (let page = 1; page <= Math.min(3, totalPages); page++) {
            pages.push(page)
        }
    }

    if (!showEllipsisLeft && !showEllipsisRight) {
        for (let page = 1; page <= totalPages; page++) {
            if (!pages.includes(page)) pages.push(page)
        }
    } else if (currentPage > 3 && currentPage < totalPages - 2) {
        pages.push(currentPage - 1, currentPage, currentPage + 1)
    }

    if (showEllipsisRight) {
        pages.push('ellipsis-right', totalPages)
    } else if (!showEllipsisLeft) {
        for (let page = Math.max(1, totalPages - 2); page <= totalPages; page++) {
            if (!pages.includes(page)) pages.push(page)
        }
    }

    return pages
}

export default function PlayerStatsPage() {
    const { data: players, isLoading, error } = useAdminPlayers()
    const [searchQuery, setSearchQuery] = useState('')
    const [teamFilter, setTeamFilter] = useState<Teams>('All')
    const [roleFilter, setRoleFilter] = useState<Roles>('All')
    const [nationalityFilter, setNationalityFilter] = useState<Nationality>('All')
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [editingPlayer, setEditingPlayer] = useState<AdminPlayer | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    const filteredPlayers = useMemo(() => {
        return (players ?? []).filter((player) => {
            const matchesSearch =
                searchQuery.trim().length === 0 ||
                player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (player.cricbuzzPlayerId ?? '').toLowerCase().includes(searchQuery.toLowerCase())

            const matchesTeam = teamFilter === 'All' || player.iplTeam === teamFilter
            const matchesRole = roleFilter === 'All' || player.role === roleFilter
            const matchesNationality =
                nationalityFilter === 'All' ||
                (nationalityFilter === 'Overseas' && player.isOverseas) ||
                (nationalityFilter === 'Indians' && !player.isOverseas)

            return matchesSearch && matchesTeam && matchesRole && matchesNationality
        })
    }, [nationalityFilter, players, roleFilter, searchQuery, teamFilter])

    const totalPages = Math.max(1, Math.ceil(filteredPlayers.length / PAGE_SIZE))
    const firstPlayerIndex = (currentPage - 1) * PAGE_SIZE
    const paginatedPlayers = filteredPlayers.slice(firstPlayerIndex, firstPlayerIndex + PAGE_SIZE)
    const visibleStart = filteredPlayers.length === 0 ? 0 : firstPlayerIndex + 1
    const visibleEnd = Math.min(firstPlayerIndex + PAGE_SIZE, filteredPlayers.length)

    useEffect(() => {
        setCurrentPage(1)
    }, [nationalityFilter, roleFilter, searchQuery, teamFilter])

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages)
        }
    }, [currentPage, totalPages])

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return

        setCurrentPage(page)
    }

    const resetFilters = () => {
        setSearchQuery('')
        setTeamFilter('All')
        setRoleFilter('All')
        setNationalityFilter('All')
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
                <p className="text-destructive font-medium">Failed to load players</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Player Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Add new players, edit existing player details, and filter the player pool by team, role, and overseas status.
                    </p>
                </div>

                <Button
                    onClick={() => setCreateModalOpen(true)}
                    className="w-full gap-2 sm:w-auto">
                    <Plus className="h-4 w-4" />
                    Add Player
                </Button>
            </div>

            <PlayerManagementFilters
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                teamFilter={teamFilter}
                onTeamFilterChange={setTeamFilter}
                roleFilter={roleFilter}
                onRoleFilterChange={setRoleFilter}
                nationalityFilter={nationalityFilter}
                onNationalityFilterChange={setNationalityFilter}
                onReset={resetFilters}
            />

            <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                    Showing {visibleStart}-{visibleEnd} of {filteredPlayers.length}
                </Badge>
                <Badge variant="outline">{players?.length ?? 0} total players</Badge>
                <Badge variant="outline">50 per page</Badge>
            </div>

            <PlayerFormModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
            />
            <PlayerFormModal
                open={Boolean(editingPlayer)}
                onOpenChange={(open) => {
                    if (!open) setEditingPlayer(null)
                }}
                player={editingPlayer}
            />

            <Card className="overflow-hidden">
                <CardHeader className="border-b bg-accent/50">
                    <CardTitle className="text-base sm:text-lg">Players</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="hidden lg:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b bg-accent/30 hover:bg-transparent">
                                    <TableHead className="min-w-[220px] font-semibold">Player</TableHead>
                                    <TableHead className="font-semibold">Team</TableHead>
                                    <TableHead className="font-semibold">Role</TableHead>
                                    <TableHead className="font-semibold">Overseas</TableHead>
                                    <TableHead className="text-right font-semibold">Cost</TableHead>
                                    <TableHead className="min-w-[160px] font-semibold">Cricbuzz ID</TableHead>
                                    <TableHead className="min-w-[220px] font-semibold">Profile Image</TableHead>
                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedPlayers.map((player) => (
                                    <TableRow
                                        key={player.id}
                                        className="border-b hover:bg-accent/50">
                                        <TableCell className="font-medium">{player.name}</TableCell>
                                        <TableCell>{player.iplTeam}</TableCell>
                                        <TableCell>{player.role}</TableCell>
                                        <TableCell>
                                            <Badge variant={player.isOverseas ? 'default' : 'secondary'}>
                                                {player.isOverseas ? 'Overseas' : 'Indian'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">{formatCost(player.cost)}</TableCell>
                                        <TableCell className="font-mono text-xs">{player.cricbuzzPlayerId || '-'}</TableCell>
                                        <TableCell className="truncate text-sm text-muted-foreground">{player.profileImageUrl}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setEditingPlayer(player)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="space-y-3 p-4 lg:hidden">
                        {paginatedPlayers.map((player) => (
                            <Card
                                key={player.id}
                                className="border shadow-sm">
                                <CardContent className="space-y-4 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate font-semibold text-sm">{player.name}</h3>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {player.iplTeam} • {player.role}
                                            </p>
                                        </div>
                                        <Badge variant={player.isOverseas ? 'default' : 'secondary'}>
                                            {player.isOverseas ? 'Overseas' : 'Indian'}
                                        </Badge>
                                    </div>

                                    <div className="rounded-md border bg-muted/30 p-3 text-xs space-y-2">
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="text-muted-foreground">Cost</span>
                                            <span className="font-semibold">{formatCost(player.cost)}</span>
                                        </div>
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="text-muted-foreground">Cricbuzz ID</span>
                                            <span className="font-mono text-right">{player.cricbuzzPlayerId || '-'}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground">Profile Image URL</p>
                                            <p className="break-all">{player.profileImageUrl}</p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => setEditingPlayer(player)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Player
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex flex-col items-center gap-3 border-t px-4 py-4 sm:flex-row sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </p>
                            <Pagination className="mx-0 w-auto">
                                <PaginationContent className="flex flex-wrap justify-center gap-1">
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        />
                                    </PaginationItem>

                                    {getPageNumbers(currentPage, totalPages).map((page, index) => (
                                        <PaginationItem key={`${page}-${index}`}>
                                            {page === 'ellipsis-left' || page === 'ellipsis-right' ? (
                                                <PaginationEllipsis />
                                            ) : (
                                                <PaginationLink
                                                    onClick={() => handlePageChange(page)}
                                                    isActive={currentPage === page}
                                                    className="cursor-pointer">
                                                    {page}
                                                </PaginationLink>
                                            )}
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}

                    {filteredPlayers.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No players matched the current filters.
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        </div>
    )
}
