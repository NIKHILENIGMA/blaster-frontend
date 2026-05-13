import { AlertCircle, CheckCircle2, CloudUpload } from 'lucide-react'
import { useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { useFilterStore } from '../../store/use-filter-store'
import type { Player } from '../../types/players'
import PlayerSidebarItem from '../cards/player-sidebar-item'
import Filters from '../sidebar/filters'
import { useBuildFranchise } from '../../hook/use-build-franchise'

interface MobileDrawerProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    allPlayers: Player[]
    onAddPlayer: (player: Player) => void
    onRemovePlayer: (playerId: string) => void
    selectedPlayers: Map<string, Player>
    onSubmit: () => void
    isSubmitDisabled: boolean
    budgetRemaining: number
    selectedCount: number
}

export function MobileDrawer({
    isOpen,
    onOpenChange,
    allPlayers,
    onAddPlayer,
    onRemovePlayer,
    selectedPlayers,
    onSubmit,
    isSubmitDisabled,
    budgetRemaining,
    selectedCount
}: MobileDrawerProps) {
    const availablePlayers = allPlayers.filter((player) => !selectedPlayers.has(player.id))
    const { searchQuery, roleFilter, teamFilter, nationalityFilter } = useFilterStore()
    const { saveStatus, lastSavedAt } = useBuildFranchise()

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
                className="flex h-[92vh] flex-col rounded-t-2xl bg-background p-3 md:hidden">
                <SheetHeader className="mb-1 px-1">
                    <SheetTitle className="text-sidebar-foreground">Buy Players</SheetTitle>
                </SheetHeader>
                <div className="rounded-xl bg-primary/10 px-3 py-2 text-primary">
                    <div className="flex w-full justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium">Budget</p>
                            <p className="truncate text-base font-bold">{budgetRemaining.toLocaleString()} Points</p>
                        </div>
                        <div className="shrink-0 text-right">
                            <p className="text-[11px] font-medium">Squad</p>
                            <p className="text-base font-bold">{selectedCount}/25</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-2 px-1">
                    <h2 className="text-lg font-bold">Buy Players</h2>
                    <div className="flex min-w-0 items-center justify-end gap-2 text-xs font-medium">
                        {saveStatus === 'saving' && (
                            <span className="flex items-center text-blue-500 animate-pulse">
                                <CloudUpload className="w-4 h-4 mr-1" /> Saving...
                            </span>
                        )}

                        {saveStatus === 'saved' && (
                            <span className="flex items-center text-green-500">
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Saved {lastSavedAt && `at ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                            </span>
                        )}

                        {saveStatus === 'error' && (
                            <span className="flex items-center text-red-500">
                                <AlertCircle className="w-4 h-4 mr-1" /> Save Failed
                            </span>
                        )}
                    </div>
                </div>

                <div>
                    <Filters
                        availablePlayers={availablePlayers}
                        selectedPlayers={selectedPlayers}
                        classes="space-y-2"
                    />
                </div>

                <ScrollArea className="min-h-0 flex-1 overflow-y-scroll">
                    <div className="space-y-3 pr-2 pb-3">
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

                <div className="border-t border-border pt-3">
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
                </div>
            </SheetContent>
        </Sheet>
    )
}
