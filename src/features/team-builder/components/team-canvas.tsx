import { Crown, Award, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { INITIAL_CREDITS } from '@/shared/lib/mock-data'

import type { Player } from '../types/players'

interface TeamCanvasProps {
    selectedPlayers: Player[]
    captain: string | null
    viceCaptain: string | null
    remainingCredits: number
    onRemovePlayer: (playerId: string) => void
    onSetCaptain: (playerId: string) => void
    onSetViceCaptain: (playerId: string) => void
}

const ROLE_COLORS: Record<string, string> = {
    Batsman: 'bg-blue-600',
    Bowler: 'bg-red-600',
    'All-Rounder': 'bg-purple-600',
    'All-rounder': 'bg-purple-600',
    'Wicket-Keeper': 'bg-yellow-600',
    Wicketkeeper: 'bg-yellow-600'
}

export function TeamCanvas({
    selectedPlayers,
    captain,
    viceCaptain,
    remainingCredits,
    onRemovePlayer,
    onSetCaptain,
    onSetViceCaptain
}: TeamCanvasProps) {
    const creditUsagePercent = (((INITIAL_CREDITS - remainingCredits) / INITIAL_CREDITS) * 100).toFixed(0)

    return (
        <Card className="bg-card text-foreground flex flex-col h-[70vh] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border space-y-4">
                <h2 className="text-lg font-bold">Your Team</h2>

                {/* Status */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-accent rounded-lg p-2">
                        <p className="text-xs text-muted-foreground">Players</p>
                        <p className="text-lg font-bold">{selectedPlayers.length}/11</p>
                    </div>
                    <div className="bg-accent rounded-lg p-2">
                        <p className="text-xs text-muted-foreground">Remaining</p>
                        <p className="text-lg font-bold text-success">{remainingCredits.toFixed(1)} Pts</p>
                    </div>
                    <div className="bg-accent rounded-lg p-2">
                        <p className="text-xs text-muted-foreground">Used</p>
                        <p className="text-lg font-bold text-warning">{(INITIAL_CREDITS - remainingCredits).toFixed(1)} Pts</p>
                    </div>
                </div>

                {/* Credits Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">Credit Usage</p>
                        <p className="text-xs font-semibold">{creditUsagePercent}%</p>
                    </div>
                    <Progress
                        value={parseFloat(creditUsagePercent)}
                        className="h-2"
                    />
                </div>
            </div>

            {/* Players Grid */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {selectedPlayers.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-center">Select players from the left panel to build your team</p>
                    </div>
                ) : (
                    selectedPlayers.map((player) => {
                        const isPlayerCaptain = captain === player.id
                        const isPlayerViceCaptain = viceCaptain === player.id

                        return (
                            <div
                                key={player.id}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                    isPlayerCaptain
                                        ? 'bg-background/90 border-primary text-foreground hover:bg-primary/10'
                                        : isPlayerViceCaptain
                                          ? 'bg-muted border-secondary hover:bg-primary/10'
                                          : 'bg-card border-border hover:bg-primary/10'
                                }`}>
                                <div className="flex items-start justify-between gap-2">
                                    {/* Player Info */}
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        {/* Avatar */}
                                        {player.profileImageUrl !== '' ? (
                                            <img
                                                src={player.profileImageUrl}
                                                alt={player.name}
                                                className="h-18 w-18 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-18 w-18 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                                <span className="font-bold text-sm text-primary-foreground">{player.name.charAt(0)}</span>
                                            </div>
                                        )}

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-semibold truncate">{player.name}</p>
                                                {isPlayerCaptain && <Crown className="w-4 h-4 text-accent flex-shrink-0" />}
                                                {isPlayerViceCaptain && <Award className="w-4 h-4 text-secondary flex-shrink-0" />}
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap mt-1">
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs">
                                                    {(player as Player & { team?: string }).team || player.iplTeam}
                                                </Badge>
                                                <Badge className={`text-xs ${ROLE_COLORS[player.role] || 'bg-secondary'}`}>{player.role}</Badge>
                                                <span className="text-xs text-foreground font-bold bg-muted px-2 py-1 rounded">
                                                    {(player as Player & { credits?: number }).credits ?? player.cost} Pts
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onRemovePlayer(player.id)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Captain/VC Selection */}
                                <div className="flex gap-2 mt-3">
                                    <Button
                                        size="sm"
                                        variant={isPlayerCaptain ? 'default' : 'outline'}
                                        onClick={() => onSetCaptain(player.id)}
                                        className="flex-1 text-xs">
                                        Captain
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={isPlayerViceCaptain ? 'default' : 'outline'}
                                        onClick={() => onSetViceCaptain(player.id)}
                                        className="flex-1 text-xs">
                                        Vice-Captain
                                    </Button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </Card>
    )
}
