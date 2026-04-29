import { type FC } from 'react'
import type { Player } from '../types/players'
import { ValidationErrors } from './validation-error'
import { Users } from 'lucide-react'
import PlayerCard from './players/player-card'

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

    // Group players by role
    const playersByRole = selectedPlayers.reduce<Record<string, Player[]>>((acc, player) => {
        if (!acc[player.role]) {
            acc[player.role] = [];
        }
        acc[player.role].push(player);
        return acc;
    }, {});

    return (
        <div className="w-full lg:w-[80%] flex flex-col gap-4">
            <div className="min-h-[65vh] rounded-xl border border-border bg-card p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span>
                            <Users className="h-5 w-5 text-muted-foreground" />
                        </span>

                        <h2 className="text-lg font-semibold">Selected Franchise</h2>
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {selectedPlayers.length}/{selectionLimit}
                    </span>
                </div>

                {selectedPlayers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Please select players from the left panel to assemble your franchise team.</p>
                ) : (
                    <div className="space-y-2 h-[80vh] pr-1 overflow-y-auto">
                        {Object.entries(playersByRole).map(([role, players]) => {
                            // Only apply grid for batsman, bowler, allrounder
                            const isGridRole = ['batsman', 'bowler', 'all-rounder', 'wicket-keeper'].includes(role.toLowerCase());
                            return (
                                <div key={role} className="mb-4">
                                    <h3 className="font-bold text-2xl mb-2 uppercase">{role}</h3>
                                    <div
                                        className={
                                            isGridRole
                                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'
                                                : 'space-y-2'
                                        }
                                    >
                                        {players.map((player) => (
                                            <PlayerCard
                                                key={player.id}
                                                player={player}
                                                onRemovePlayer={onRemovePlayer}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {errors && errors.length > 0 && <ValidationErrors errors={errors} />}

            <button
                onClick={() => onSavePlayers(selectedPlayers)}
                disabled={!canSave || isSaving}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                    canSave && !isSaving ? 'bg-primary/90 hover:bg-primary text-white shadow-lg' : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}>
                {isSaving ? 'Saving...' : saveLabel}
            </button>
        </div>
    )
}

export default SelectFranchiseTeam
