import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import type { Player } from '../types/players'

import { PlayerList } from './player-list'
import SelectFranchiseTeam from './select-franchise-team'

interface TeamBuilderProps {
    players: Player[]
    initialSelectedPlayers?: Player[]
    selectionLimit?: number
    budgetTotal?: number
    saveLabel?: string
    onSave: (selectedPlayers: Player[]) => Promise<void>
}

export function TeamBuilder({ players, initialSelectedPlayers = [], selectionLimit = 25, budgetTotal = 2000, onSave }: TeamBuilderProps) {
    const [selectedPlayers, setSelectedPlayers] = useState<Player[]>(initialSelectedPlayers)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterTeam, setFilterTeam] = useState<string>('')
    const [filterRole, setFilterRole] = useState<string>('')
    const [filterOverseas, setFilterOverseas] = useState<boolean>(false)
    const [filterIndiansOnly, setFilterIndiansOnly] = useState<boolean>(false)
    const [isSaving, setIsSaving] = useState(false)

    const usedCredits = selectedPlayers.reduce((sum, player) => sum + player.cost, 0)
    const remainingCredits = budgetTotal - usedCredits

    const availablePlayers = useMemo(() => {
        return players.filter((player) => {
            const isSelected = selectedPlayers.some((selected) => selected.id === player.id)
            if (isSelected) return false

            if (searchTerm && !player.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false
            }

            if (filterTeam && player.iplTeam !== filterTeam) return false
            if (filterRole && player.role !== filterRole) return false
            if (filterOverseas && !player.isOverseas) return false
            if (filterIndiansOnly && player.isOverseas) return false
            if (filterOverseas && filterIndiansOnly) return false

            return true
        })
    }, [players, selectedPlayers, searchTerm, filterTeam, filterRole, filterOverseas, filterIndiansOnly])

    // const roleCounts = useMemo(() => {
    //     return selectedPlayers.reduce(
    //         (acc, player) => {
    //             if (player.role === 'Batsman') acc.batsman += 1
    //             if (player.role === 'Bowler') acc.bowler += 1
    //             if (player.role === 'All-Rounder') acc.allRounder += 1
    //             if (player.role === 'Wicket-Keeper') acc.wicketKeeper += 1
    //             return acc
    //         },
    //         {
    //             batsman: 0,
    //             bowler: 0,
    //             allRounder: 0,
    //             wicketKeeper: 0
    //         }
    //     )
    // }, [selectedPlayers])

    const errors = useMemo(() => {
        const validationErrors: string[] = []

        if (selectedPlayers.length !== selectionLimit) {
            validationErrors.push(`Select exactly ${selectionLimit} players for your squad`)
        }

        if (remainingCredits < 0) {
            validationErrors.push(`Squad budget cannot exceed ${budgetTotal} credits`)
        }

        return validationErrors
    }, [budgetTotal, remainingCredits, selectedPlayers.length, selectionLimit])

    const canSave = selectedPlayers.length === selectionLimit && remainingCredits >= 0 && errors.length === 0

    const handleAddPlayer = (player: Player) => {
        if (selectedPlayers.length >= selectionLimit) {
            return
        }

        setSelectedPlayers((current) => [...current, player])
    }

    const handleRemovePlayer = (playerId: string) => {
        setSelectedPlayers((current) => current.filter((player) => player.id !== playerId))
    }

    const handleSave = async () => {
        if (!canSave) return

        try {
            setIsSaving(true)
            await onSave(selectedPlayers)
            toast.success('Squad saved successfully!')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to save squad')
        } finally {
            setIsSaving(false)
        }
    }

    // const creditUsagePercent = Math.min(100, ((budgetTotal - remainingCredits) / budgetTotal) * 100)

    return (
        <div className="w-full flex flex-col gap-4 p-4 md:p-6 lg:px-2">
            <div className="text-start">
                <h1 className="text-2xl font-bold">
                    Franchise <span className="text-primary">Squad Builder</span>
                </h1>
                <p className="text-sm text-muted-foreground">Build your 25-player roster within the 2000-credit cycle budget.</p>
            </div>

            {/* <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-4">
                <div className="rounded-lg border border-border bg-card p-3">
                    <p>Selected</p>
                    <p className="text-lg font-semibold text-foreground">
                        {selectedPlayers.length}/{selectionLimit}
                    </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3">
                    <p>Remaining</p>
                    <p className="text-lg font-semibold text-foreground">{remainingCredits.toFixed(1)}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3">
                    <p>Bats / Bowl</p>
                    <p className="text-lg font-semibold text-foreground">
                        {roleCounts.batsman} / {roleCounts.bowler}
                    </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3">
                    <p>AR / WK</p>
                    <p className="text-lg font-semibold text-foreground">
                        {roleCounts.allRounder} / {roleCounts.wicketKeeper}
                    </p>
                </div>
            </div> */}

            {/* <div className="h-2 rounded-full bg-muted">
                <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{
                        width: `${creditUsagePercent}%`
                    }}
                />
            </div> */}

            <div className="flex flex-col lg:flex-row gap-4 w-full ">
                <div className="w-full lg:w-[45%] flex flex-col gap-4">
                    <PlayerList
                        selectionLimit={selectionLimit}
                        players={availablePlayers}
                        selectedCount={selectedPlayers.length}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filterTeam={filterTeam}
                        onFilterTeamChange={setFilterTeam}
                        filterRole={filterRole}
                        onFilterRoleChange={setFilterRole}
                        filterOverseas={filterOverseas}
                        onFilterOverseasChange={setFilterOverseas}
                        onAddPlayer={handleAddPlayer}
                        canAddMore={selectedPlayers.length < selectionLimit}
                        filterIndiansOnly={filterIndiansOnly}
                        onFilterIndiansOnlyChange={setFilterIndiansOnly}
                    />
                </div>

                <SelectFranchiseTeam
                    selectedPlayers={selectedPlayers}
                    selectionLimit={selectionLimit}
                    onRemovePlayer={handleRemovePlayer}
                    onSavePlayers={handleSave}
                    isSaving={isSaving}
                    errors={errors}
                    saveLabel="Save Squad"
                    canSave={canSave}
                />
            </div>
        </div>
    )
}
