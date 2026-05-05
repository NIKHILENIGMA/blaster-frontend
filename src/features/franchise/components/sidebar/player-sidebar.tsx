import { useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import { useBuildFranchise } from '../../hook/use-build-franchise'
import { useFilterStore } from '../../store/use-filter-store'
import type { Player } from '../../types/players'
import PlayerSidebarItem from '../cards/player-sidebar-item'

import Filters from './filters'

interface PlayerSidebarProps {
    allPlayers: Player[]
    onAddPlayer: (player: Player) => void
    onRemovePlayer: (playerId: string) => void
    selectedPlayers: Map<string, Player>
    onSubmit: () => void
    isSubmitDisabled: boolean
}

export function PlayerSidebar({ allPlayers, onAddPlayer, onRemovePlayer, selectedPlayers, onSubmit, isSubmitDisabled }: PlayerSidebarProps) {
    const { isUpdatingFranchise } = useBuildFranchise()
    const { searchQuery, roleFilter, teamFilter, nationalityFilter } = useFilterStore()

    const availablePlayers = allPlayers.filter((player) => !selectedPlayers.has(player.id))

    const filteredPlayers = availablePlayers.filter((player) => {
        // search by name
        if (searchQuery && !player.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false
        }

        // role filter
        if (roleFilter !== 'All' && player.role !== roleFilter) return false

        // team filter
        if (teamFilter !== 'All' && player.iplTeam !== teamFilter) return false

        // nationality filter
        if (nationalityFilter === 'Indians' && player.isOverseas) return false
        if (nationalityFilter === 'Overseas' && !player.isOverseas) return false

        return true
    })

    const handleAddPlayer = useCallback(
        (player: Player) => {
            onAddPlayer(player)
        },
        [onAddPlayer]
    )

    return (
        <div className="flex flex-col border-l border-border bg-sidebar max-h-[78vh]">
            <Filters
                availablePlayers={availablePlayers}
                selectedPlayers={selectedPlayers}
            />

            <ScrollArea className="flex-1 overflow-y-scroll max-h-[90vh]">
                <div className="space-y-5 p-4">
                    {availablePlayers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <p className="text-sm text-muted-foreground">No players found</p>
                        </div>
                    ) : filteredPlayers.length > 0 ? (
                        filteredPlayers.map((player) => (
                            <PlayerSidebarItem
                                key={player.id}
                                player={player}
                                onAddPlayer={() => handleAddPlayer(player)}
                                onRemovePlayer={onRemovePlayer}
                                isSelected={selectedPlayers.has(player.id)}
                                canAddMore={selectedPlayers.size < 25}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <p className="text-sm text-muted-foreground">No players match your search query</p>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="border-t border-border p-4">
                <Button
                    disabled={isSubmitDisabled || isUpdatingFranchise}
                    className={`w-full ${
                        isSubmitDisabled ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                    onClick={onSubmit}>
                    {isUpdatingFranchise ? 'Saving...' : 'Save Squad'}
                </Button>
            </div>
        </div>
    )
}
