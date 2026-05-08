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
                className="h-[95vh] rounded-t-2xl bg-background p-6 md:hidden">
                <SheetHeader className="mb-1">
                    <SheetTitle className="text-sidebar-foreground">Buy Players</SheetTitle>
                </SheetHeader>
                <div className="flex items-start px-4 py-1 bg-primary/10 text-primary rounded-b-lg ">
                    <div className="w-full flex justify-between gap-8">
                        <div className="flex flex-col gap-1">
                            <p className="text-xs font-medium ">Budget Remaining</p>
                            <p className="text-xl font-bold">{budgetRemaining.toLocaleString()} Points</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-xs font-medium ">Squad Size</p>
                            <p className="text-xl font-bold ">{selectedCount}/25</p>
                        </div>
                    </div>
                </div>
                <div className="px-4 flex items-center justify-between gap-2">
                    <h2 className="text-xl font-bold">Buy Players</h2>
                    <div className="flex items-center gap-2 text-xs font-medium">
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

                <div className="space-y-2">
                    <Filters
                        availablePlayers={availablePlayers}
                        selectedPlayers={selectedPlayers}
                        classes="space-y-1"
                    />
                </div>

                <ScrollArea className="h-[calc(85vh-120px)] overflow-y-scroll">
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

                <div className="space-y-2 border-t border-border pt-4">
                    <Button
                        disabled={isSubmitDisabled }
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
