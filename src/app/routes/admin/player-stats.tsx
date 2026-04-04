import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react'
import { useState } from 'react'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AddPlayerModal } from '@/features/admin/components/add-player-modal'

interface PlayerStat {
    id: string
    name: string
    team: string
    runs: number
    wickets: number
    catches: number
    fantasyPoints: number
}

const mockPlayerStats: PlayerStat[] = [
    {
        id: '1',
        name: 'Virat Kohli',
        team: 'Royal Challengers Bangalore',
        runs: 850,
        wickets: 0,
        catches: 5,
        fantasyPoints: 1200
    },
    {
        id: '2',
        name: 'Jasprit Bumrah',
        team: 'Mumbai Indians',
        runs: 45,
        wickets: 18,
        catches: 2,
        fantasyPoints: 950
    },
    {
        id: '3',
        name: 'Rohit Sharma',
        team: 'Mumbai Indians',
        runs: 620,
        wickets: 0,
        catches: 8,
        fantasyPoints: 1050
    },
    {
        id: '4',
        name: 'MS Dhoni',
        team: 'Chennai Super Kings',
        runs: 450,
        wickets: 0,
        catches: 12,
        fantasyPoints: 980
    }
]

export default function PlayerStatsPage() {
    const [players, setPlayers] = useState<PlayerStat[]>(mockPlayerStats)
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editValues, setEditValues] = useState<Partial<PlayerStat>>({})

    const deletePlayer = (id: string) => {
        setPlayers(players.filter((p) => p.id !== id))
    }

    const startEdit = (player: PlayerStat) => {
        setEditingId(player.id)
        setEditValues(player)
    }

    const saveEdit = () => {
        if (editingId) {
            setPlayers(players.map((p) => (p.id === editingId ? { ...p, ...editValues } : p)))
            setEditingId(null)
        }
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Player Stats</h1>
                    <p className="text-sm text-muted-foreground">Manage player statistics and fantasy points</p>
                </div>
                <Button
                    onClick={() => setAddModalOpen(true)}
                    className="w-full sm:w-auto gap-2">
                    <Plus className="h-4 w-4" />
                    Add Player
                </Button>
            </div>

            <AddPlayerModal
                open={addModalOpen}
                onOpenChange={setAddModalOpen}
                onAdd={(player) => {
                    if (!player || typeof player !== 'object') return
                    setPlayers([...players, { ...(player as Omit<PlayerStat, 'id'>), id: Date.now().toString() }])
                    setAddModalOpen(false)
                }}
            />

            {/* Table container */}
            <Card className="overflow-hidden">
                <CardHeader className="border-b bg-accent/50">
                    <CardTitle className="text-base sm:text-lg">Player Statistics</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Desktop table */}
                    <div className="hidden sm:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b bg-accent/30">
                                    <TableHead className="font-semibold">Player Name</TableHead>
                                    <TableHead className="font-semibold">Team</TableHead>
                                    <TableHead className="text-right font-semibold">Runs</TableHead>
                                    <TableHead className="text-right font-semibold">Wickets</TableHead>
                                    <TableHead className="text-right font-semibold">Catches</TableHead>
                                    <TableHead className="text-right font-semibold">Fantasy Points</TableHead>
                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {players.map((player) => (
                                    <TableRow
                                        key={player.id}
                                        className="hover:bg-accent/50 border-b">
                                        <TableCell className="font-medium text-sm">{player.name}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{player.team}</TableCell>
                                        <TableCell className="text-right text-sm font-semibold">{player.runs}</TableCell>
                                        <TableCell className="text-right text-sm font-semibold text-red-600">{player.wickets}</TableCell>
                                        <TableCell className="text-right text-sm font-semibold text-green-600">{player.catches}</TableCell>
                                        <TableCell className="text-right text-sm font-bold text-blue-600">{player.fantasyPoints}</TableCell>
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
                                                    <DropdownMenuItem onClick={() => startEdit(player)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                                                <span className="text-red-500">Delete</span>
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogTitle>Delete Player</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete {player.name}? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                            <div className="flex gap-2 justify-end">
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => deletePlayer(player.id)}
                                                                    className="bg-red-600 hover:bg-red-700">
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </div>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
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
                        {players.map((player) => (
                            <Card
                                key={player.id}
                                className="border">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-sm">{player.name}</h3>
                                            <p className="text-xs text-muted-foreground">{player.team}</p>
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
                                                <DropdownMenuItem onClick={() => startEdit(player)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                                            <span className="text-red-500">Delete</span>
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogTitle>Delete Player</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete {player.name}?
                                                        </AlertDialogDescription>
                                                        <div className="flex gap-2 justify-end">
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => deletePlayer(player.id)}
                                                                className="bg-red-600 hover:bg-red-700">
                                                                Delete
                                                            </AlertDialogAction>
                                                        </div>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {editingId === player.id ? (
                                        <div className="space-y-2 border-t pt-3">
                                            <div>
                                                <label className="text-xs text-muted-foreground">Runs</label>
                                                <Input
                                                    type="number"
                                                    value={editValues.runs || ''}
                                                    onChange={(e) => setEditValues({ ...editValues, runs: parseInt(e.target.value) })}
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-muted-foreground">Wickets</label>
                                                <Input
                                                    type="number"
                                                    value={editValues.wickets || ''}
                                                    onChange={(e) => setEditValues({ ...editValues, wickets: parseInt(e.target.value) })}
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-muted-foreground">Catches</label>
                                                <Input
                                                    type="number"
                                                    value={editValues.catches || ''}
                                                    onChange={(e) => setEditValues({ ...editValues, catches: parseInt(e.target.value) })}
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    size="sm"
                                                    className="h-8 flex-1 text-xs"
                                                    onClick={saveEdit}>
                                                    Save
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 flex-1 text-xs"
                                                    onClick={() => setEditingId(null)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 text-xs border-t pt-3">
                                            <div>
                                                <p className="text-muted-foreground">Runs</p>
                                                <p className="font-semibold">{player.runs}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Wickets</p>
                                                <p className="font-semibold text-red-600">{player.wickets}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Catches</p>
                                                <p className="font-semibold text-green-600">{player.catches}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Fantasy</p>
                                                <p className="font-semibold text-blue-600">{player.fantasyPoints}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
