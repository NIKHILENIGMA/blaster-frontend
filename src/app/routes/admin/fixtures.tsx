import { MoreVertical } from 'lucide-react'
import { useState } from 'react'

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

interface Fixture {
    id: string
    matchId: string
    teamA: string
    teamB: string
    date: string
    time: string
    status: 'Upcoming' | 'Live' | 'Completed'
    processed: boolean
}

const mockFixtures: Fixture[] = [
    {
        id: '1',
        matchId: 'M001',
        teamA: 'Mumbai Indians',
        teamB: 'Delhi Capitals',
        date: '2024-04-10',
        time: '19:30',
        status: 'Upcoming',
        processed: false
    },
    {
        id: '2',
        matchId: 'M002',
        teamA: 'Chennai Super Kings',
        teamB: 'Rajasthan Royals',
        date: '2024-04-11',
        time: '15:30',
        status: 'Live',
        processed: true
    },
    {
        id: '3',
        matchId: 'M003',
        teamA: 'Kolkata Knight Riders',
        teamB: 'Punjab Kings',
        date: '2024-04-09',
        time: '19:30',
        status: 'Completed',
        processed: true
    }
]

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Upcoming':
            return 'bg-gray-100 text-gray-800'
        case 'Live':
            return 'bg-green-100 text-green-800'
        case 'Completed':
            return 'bg-blue-100 text-blue-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

export default function FixturesPage() {
    const [fixtures, setFixtures] = useState<Fixture[]>(mockFixtures)
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const toggleProcessed = (id: string) => {
        setFixtures(fixtures.map((f) => (f.id === id ? { ...f, processed: !f.processed } : f)))
    }

    const updateStatus = (id: string, newStatus: 'Upcoming' | 'Live' | 'Completed') => {
        setFixtures(fixtures.map((f) => (f.id === id ? { ...f, status: newStatus } : f)))
    }

    const filteredFixtures = statusFilter === 'all' ? fixtures : fixtures.filter((f) => f.status === statusFilter)

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Fixtures</h1>
                <p className="text-sm text-muted-foreground">Manage match fixtures and processing status</p>
            </div>

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
                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                        <SelectItem value="Live">Live</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
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
                                    <TableHead className="font-semibold">Time</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold text-center">Processed</TableHead>
                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFixtures.map((fixture) => (
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
                                        <TableCell className="text-sm">{fixture.date}</TableCell>
                                        <TableCell className="text-sm">{fixture.time}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(fixture.status)}>{fixture.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Checkbox
                                                checked={fixture.processed}
                                                onCheckedChange={() => toggleProcessed(fixture.id)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel className="text-xs">Update Status</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => updateStatus(fixture.id, 'Upcoming')}>Upcoming</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateStatus(fixture.id, 'Live')}>Live</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateStatus(fixture.id, 'Completed')}>
                                                        Completed
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
                        {filteredFixtures.map((fixture) => (
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
                                        <Badge className={getStatusColor(fixture.status)}>{fixture.status}</Badge>
                                    </div>
                                    <div className="flex gap-3 text-xs text-muted-foreground">
                                        <span>📅 {fixture.date}</span>
                                        <span>🕐 {fixture.time}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={fixture.processed}
                                                onCheckedChange={() => toggleProcessed(fixture.id)}
                                            />
                                            <span className="text-xs text-muted-foreground">{fixture.processed ? 'Processed' : 'Pending'}</span>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel className="text-xs">Update Status</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => updateStatus(fixture.id, 'Upcoming')}>Upcoming</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateStatus(fixture.id, 'Live')}>Live</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateStatus(fixture.id, 'Completed')}>Completed</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredFixtures.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                            <p>No fixtures found</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
