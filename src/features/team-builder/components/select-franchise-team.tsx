import { Users } from 'lucide-react'
import { type FC } from 'react'

import type { Player } from '../types/players'

import PlayerCard from './players/player-card'
import { ValidationErrors } from './validation-error'

interface SelectFranchiseTeamProps {
    selectedPlayers: Player[]
    selectionLimit: number
    onRemovePlayer: (playerId: string) => void
    onSavePlayers: (players: Player[]) => void
    isSaving?: boolean
    errors?: string[]
    saveLabel?: string
    canSave?: boolean
}

const SelectFranchiseTeam: FC<SelectFranchiseTeamProps> = ({
    selectedPlayers,
    selectionLimit,
    onRemovePlayer,
    onSavePlayers,
    isSaving,
    errors,
    saveLabel,
    canSave
}) => {
    // Define the roles in a fixed order for the UI
    const ROLE_ORDER = ['Wicket-Keeper', 'Batsman', 'All-Rounder', 'Bowler'] as const

    // Group players by role
    const playersByRole = selectedPlayers.reduce<Record<string, Player[]>>((acc, player) => {
        if (!acc[player.role]) {
            acc[player.role] = []
        }
        acc[player.role].push(player)
        return acc
    }, {})

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="min-h-[65vh] bg-white p-4">
                <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Build Your Squad</h2>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">IPL 2026 Season</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-primary">
                            {selectedPlayers.length}
                            <span className="text-sm text-muted-foreground font-medium">/{selectionLimit}</span>
                        </span>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Players Selected</p>
                    </div>
                </div>

                {selectedPlayers.length === 0 ? (
                    <div className="h-[50vh] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-xl">
                        <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground">No Players Selected</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Select players from the catalog to build your championship winning team.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8 h-[75vh] pr-2 overflow-y-auto custom-scrollbar">
                        {ROLE_ORDER.map((role) => {
                            const players = playersByRole[role] || []
                            if (players.length === 0) return null

                            return (
                                <div
                                    key={role}
                                    className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                                        <h3 className="font-black text-sm uppercase tracking-[0.2em] text-muted-foreground px-4 py-1 bg-muted rounded-full border border-border">
                                            {role}s ({players.length})
                                        </h3>
                                        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {players.map((player) => (
                                            <PlayerCard
                                                key={player.id}
                                                player={player}
                                                onRemovePlayer={onRemovePlayer}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {errors && errors.length > 0 && <ValidationErrors errors={errors} />}

            <button
                onClick={() => onSavePlayers(selectedPlayers)}
                disabled={!canSave || isSaving}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform active:scale-[0.98] ${
                    canSave && !isSaving
                        ? 'bg-primary text-primary-foreground shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_25px_-10px_rgba(0,0,0,0.4)] hover:-translate-y-1'
                        : 'bg-muted text-muted-foreground cursor-not-allowed opacity-70'
                }`}>
                {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                    </span>
                ) : (
                    saveLabel
                )}
            </button>
        </div>
    )
}

export default SelectFranchiseTeam
