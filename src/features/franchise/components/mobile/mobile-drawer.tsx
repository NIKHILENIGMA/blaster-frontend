import { useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { useFilterStore } from '../../store/use-filter-store'
import type { Player } from '../../types/players'
import PlayerSidebarItem from '../cards/player-sidebar-item'
import Filters from '../sidebar/filters'

interface MobileDrawerProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    allPlayers: Player[]
    onAddPlayer: (player: Player) => void
    onRemovePlayer: (playerId: string) => void
    selectedPlayers: Map<string, Player>
    onSubmit: () => void
    isSubmitDisabled: boolean
}

export function MobileDrawer({
    isOpen,
    onOpenChange,
    allPlayers,
    onAddPlayer,
    onRemovePlayer,
    selectedPlayers,
    onSubmit,
    isSubmitDisabled
}: MobileDrawerProps) {
    const availablePlayers = allPlayers.filter((player) => !selectedPlayers.has(player.id))
    const { searchQuery, roleFilter, teamFilter, nationalityFilter } = useFilterStore()

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
        <Sheet
            open={isOpen}
            onOpenChange={onOpenChange}>
            <SheetContent
                side="bottom"
                className="h-[75vh] rounded-t-2xl bg-background p-6 md:hidden">
                <SheetHeader className="mb-4">
                    <SheetTitle className="text-sidebar-foreground">Add Players</SheetTitle>
                </SheetHeader>

                <div className="space-y-4">
                    <Filters
                        availablePlayers={availablePlayers}
                        selectedPlayers={selectedPlayers}
                    />
                </div>

                <ScrollArea className="mt-4 h-[calc(85vh-320px)]">
                    <div className="space-y-2 pr-4">
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

                <div className="mt-4 space-y-2 border-t border-border pt-4">
                    <Button
                        disabled={isSubmitDisabled}
                        className={`w-full ${
                            isSubmitDisabled ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                        onClick={() => {
                            onSubmit()
                            onOpenChange(false)
                        }}>
                        Submit Franchise
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full border-border"
                        onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
