import { Plus, Edit, Lock, Unlock, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

// import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useMatches, useToggleMatchLock } from '@/features/admin/api/matches'
import { CreateMatchModal } from '@/features/admin/components/create-match-modal'

// const getStatusColor = (status: string) => {
//     switch (status.toUpperCase()) {
//         case 'UPCOMING':
//         case 'SCHEDULED':
//             return 'bg-gray-100 text-gray-800'
//         case 'LIVE':
//             return 'bg-green-100 text-green-800'
//         case 'COMPLETED':
//             return 'bg-blue-100 text-blue-800'
//         default:
//             return 'bg-gray-100 text-gray-800'
//     }
// }

export default function MatchesPage() {
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const { data: matches, isLoading, error } = useMatches()
    const toggleLockMutation = useToggleMatchLock()

    const handleToggleLock = (id: string, currentLock: boolean) => {
        toggleLockMutation.mutate(
            { matchId: id, isLocked: !currentLock },
            {
                onSuccess: () => {
                    toast.success(`Match ${!currentLock ? 'locked' : 'unlocked'} successfully`)
                },
                onError: (err) => {
                    toast.error(err.message || 'Failed to toggle lock')
                }
            }
        )
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
                <p className="text-destructive font-medium">Failed to load matches</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Page header with create button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Game Cycle</h1>
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
                                    {/* <TableHead className="font-semibold">Status</TableHead> */}
                                    <TableHead className="font-semibold text-center">Lock</TableHead>
                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {matches?.map((match) => (
                                    <TableRow
                                        key={match.id}
                                        className="hover:bg-accent/50 border-b">
                                        <TableCell className="font-medium text-sm">{match.title}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(match.startTime).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(match.endTime).toLocaleString()}
                                        </TableCell>
                                        {/* <TableCell>
                                            <Badge className={getStatusColor(match. || 'Scheduled')}>
                                                {match.status || 'Scheduled'}
                                            </Badge>
                                        </TableCell> */}
                                        <TableCell className="text-center">
                                            <div className="flex justify-center">
                                                <Switch
                                                    checked={match.isLocked}
                                                    disabled={toggleLockMutation.isPending}
                                                    onCheckedChange={() => handleToggleLock(match.id, match.isLocked)}
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
                        {matches?.map((match) => (
                            <Card
                                key={match.id}
                                className="border">
                                <CardContent className="p-4 space-y-3">
                                    <div>
                                        <h3 className="font-semibold text-sm mb-1">{match.title}</h3>
                                        <div className="space-y-1 text-xs text-muted-foreground">
                                            <p>📅 {new Date(match.startTime).toLocaleString()}</p>
                                            <p>⏱️ Ends: {new Date(match.endTime).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        {/* <Badge className={getStatusColor(match.status || 'Scheduled')}>
                                            {match.status || 'Scheduled'}
                                        </Badge> */}
                                        <div className="flex items-center gap-2">
                                            {match.isLocked ? (
                                                <Lock className="h-4 w-4 text-red-500" />
                                            ) : (
                                                <Unlock className="h-4 w-4 text-green-500" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <span className="text-xs text-muted-foreground">{match.isLocked ? 'Teams Locked' : 'Teams Unlocked'}</span>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-xs"
                                                disabled={toggleLockMutation.isPending}
                                                onClick={() => handleToggleLock(match.id, match.isLocked)}>
                                                {match.isLocked ? 'Unlock' : 'Lock'}
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
