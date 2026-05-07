import SquadPlayerCard from '../components/cards/squad-player-card'
import type { Player } from '../types/players'

interface CategorySectionProps {
    title: string
    role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper'
    players: Player[]
    onAddPlayer: (player: Player) => void
    onRemovePlayer: (playerId: string) => void
    selectedPlayers: Map<string, Player>
    captainId?: string
    viceCaptainId?: string
    impactPlayerId?: string
}

export function CategorySection({ 
    title, 
    role, 
    players, 
    onRemovePlayer, 
    selectedPlayers,
    captainId,
    viceCaptainId,
    impactPlayerId
}: CategorySectionProps) {
    const selectedInCategory = players.filter((p) => selectedPlayers.has(p.id))
    const selectedBatsmenCount = selectedInCategory.filter((p) => p.role === 'Batsman').length
    const selectedBowlersCount = selectedInCategory.filter((p) => p.role === 'Bowler').length
    const selectedAllRoundersCount = selectedInCategory.filter((p) => p.role === 'All-Rounder').length
    const selectedWkCount = selectedInCategory.filter((p) => p.role === 'Wicket-Keeper').length

    return (
        <div className="pb-8">
            <div className="header mb-6 flex items-center gap-3 ">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                <h3 className="font-black text-sm uppercase tracking-[0.2em] text-muted-foreground px-4 py-1 bg-muted rounded-full border border-border">
                    {title}s (
                    {role === 'Batsman'
                        ? selectedBatsmenCount
                        : role === 'Bowler'
                          ? selectedBowlersCount
                          : role === 'All-Rounder'
                            ? selectedAllRoundersCount
                            : selectedWkCount}
                    )
                </h3>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {selectedInCategory.length > 0 && (
                <div className="mb-6">
                    <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Selected Players</p>
                    <div className="grid auto-rows-max grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {selectedInCategory.map((player) => (
                            <SquadPlayerCard
                                key={player.id}
                                player={player}
                                onRemovePlayer={onRemovePlayer}
                                isRemoveBtn={false}
                                isCaptain={player.id === captainId}
                                isViceCaptain={player.id === viceCaptainId}
                                isImpact={player.id === impactPlayerId}
                            />
                        ))}
                    </div>
                </div>
            )}

            {selectedInCategory.length === 0 && (
                <div className="mb-6 rounded-lg border border-dashed border-muted bg-muted/30 py-12 text-center">
                    <p className="text-sm text-muted-foreground">No {title.toLowerCase()} selected yet</p>
                </div>
            )}
        </div>
    )
}
