import { Plus, Edit, Lock, Unlock } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CreateMatchModal } from '@/features/admin/components/create-match-modal'
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog'

interface Match {
    id: string
    title: string
    startTime: string
    endTime: string
    status: 'Scheduled' | 'Live' | 'Completed'
    locked: boolean
}

const mockMatches: Match[] = [
    {
        id: '1',
        title: 'Mumbai Indians vs Delhi Capitals',
        startTime: '2024-04-10 19:30',
        endTime: '2024-04-10 23:30',
        status: 'Scheduled',
        locked: false
    },
    {
        id: '2',
        title: 'Chennai Super Kings vs Rajasthan Royals',
        startTime: '2024-04-11 15:30',
        endTime: '2024-04-11 19:30',
        status: 'Live',
        locked: true
    },
    {
        id: '3',
        title: 'Kolkata Knight Riders vs Punjab Kings',
        startTime: '2024-04-09 19:30',
        endTime: '2024-04-09 23:45',
        status: 'Completed',
        locked: true
    }
]

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Scheduled':
            return 'bg-gray-100 text-gray-800'
        case 'Live':
            return 'bg-green-100 text-green-800'
        case 'Completed':
            return 'bg-blue-100 text-blue-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

export default function MatchesPage() {
    const [matches, setMatches] = useState<Match[]>(mockMatches)
    const [createModalOpen, setCreateModalOpen] = useState(false)

    const toggleLock = (id: string) => {
        setMatches(matches.map((m) => (m.id === id ? { ...m, locked: !m.locked } : m)))
    }

    return (
        <div className="space-y-6">
            {/* Page header with create button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Matches</h1>
                    <p className="text-sm text-muted-foreground">Manage match schedules and lock status</p>
                </div>
                <Button
                    onClick={() => setCreateModalOpen(true)}
                    className="w-full sm:w-auto gap-2">
                    <Plus className="h-4 w-4" />
                    Create Match
                </Button>
            </div>

            <CreateMatchModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
            />

            {/* Table container - responsive */}
            <Card className="overflow-hidden">
                <CardHeader className="border-b bg-accent/50">
                    <CardTitle className="text-base sm:text-lg">Upcoming Matches</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Desktop table - hidden on mobile */}
                    <div className="hidden sm:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b bg-accent/30">
                                    <TableHead className="font-semibold">Title</TableHead>
                                    <TableHead className="font-semibold">Start Time</TableHead>
                                    <TableHead className="font-semibold">End Time</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold text-center">Lock</TableHead>
                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {matches.map((match) => (
                                    <TableRow
                                        key={match.id}
                                        className="hover:bg-accent/50 border-b">
                                        <TableCell className="font-medium text-sm">{match.title}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{match.startTime}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{match.endTime}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(match.status)}>{match.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center">
                                                <Switch
                                                    checked={match.locked}
                                                    onCheckedChange={() => toggleLock(match.id)}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile card view */}
                    <div className="sm:hidden space-y-3 p-4">
                        {matches.map((match) => (
                            <Card
                                key={match.id}
                                className="border">
                                <CardContent className="p-4 space-y-3">
                                    <div>
                                        <h3 className="font-semibold text-sm mb-1">{match.title}</h3>
                                        <div className="space-y-1 text-xs text-muted-foreground">
                                            <p>📅 {match.startTime}</p>
                                            <p>⏱️ Ends: {match.endTime}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Badge className={getStatusColor(match.status)}>{match.status}</Badge>
                                        <div className="flex items-center gap-2">
                                            {match.locked ? <Lock className="h-4 w-4 text-red-500" /> : <Unlock className="h-4 w-4 text-green-500" />}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <span className="text-xs text-muted-foreground">{match.locked ? 'Teams Locked' : 'Teams Unlocked'}</span>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-xs"
                                                onClick={() => toggleLock(match.id)}>
                                                {match.locked ? 'Unlock' : 'Lock'}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
