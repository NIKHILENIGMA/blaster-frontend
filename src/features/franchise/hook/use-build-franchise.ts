import { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router'

import { useGetFranchiseOverview } from '@/features/franchise/api/get-franchise-overview'
import { useUpdateFranchise } from '@/features/franchise/api/update-franchise'
import { useFranchiseStore } from '@/features/franchise/store/use-franchise-store'
import type { Player } from '@/features/franchise/types/players'
import { useGetPlayers } from '@/features/team-builder/api/get-players'

const TOTAL_BUDGET = 2000
const MAX_PLAYERS = 25

export const useBuildFranchise = () => {
    const [selectedPlayers, setSelectedPlayers] = useState<Map<string, Player>>(new Map())
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
    const navigate = useNavigate()

    const { data: playersData, isPending: isPlayersLoading } = useGetPlayers({})
    const { data: overview } = useGetFranchiseOverview()
    const { mutateAsync: updateFranchiseSquad, isPending: isUpdatingFranchise } = useUpdateFranchise()
    const { saveStatus, lastSavedAt } = useFranchiseStore()
    const matchId = overview?.activeCycle?.id || ''
    const closeWindowAt: Date | string = overview?.activeCycle?.buyWindowCloseAt || ''

    const budgetRemaining = useMemo(() => {
        const totalSpent = Array.from(selectedPlayers.values()).reduce((sum, player) => sum + player.cost, 0)
        return TOTAL_BUDGET - totalSpent
    }, [selectedPlayers])

    const filteredPlayers = useMemo(
        () => ({
            batsmen: playersData?.filter((p) => p.role === 'Batsman') ?? [],
            bowlers: playersData?.filter((p) => p.role === 'Bowler') ?? [],
            allRounders: playersData?.filter((p) => p.role === 'All-Rounder') ?? [],
            wicketKeepers: playersData?.filter((p) => p.role === 'Wicket-Keeper') ?? []
        }),
        [playersData]
    )

    // const canAddMore = selectedPlayers.size < MAX_PLAYERS && budgetRemaining > 0

    const handleAddPlayer = useCallback((player: Player) => {
        setSelectedPlayers((prev) => {
            if (prev.has(player.id)) {
                return prev
            }

            const totalSpent = Array.from(prev.values()).reduce((sum, currentPlayer) => sum + currentPlayer.cost, 0)
            const nextTotal = totalSpent + player.cost

            if (prev.size >= MAX_PLAYERS) {
                return prev
            }

            if (nextTotal > TOTAL_BUDGET) {
                return prev
            }

            const newSelected = new Map(prev)
            newSelected.set(player.id, player)

            return newSelected
        })
    }, [])

    const handleRemovePlayer = useCallback((playerId: string) => {
        setSelectedPlayers((prev) => {
            const newSelected = new Map(prev)
            newSelected.delete(playerId)
            return newSelected
        })
    }, [])

    const handleSubmit = async () => {
        if (selectedPlayers.size === 0) {
            return
        }

        const playerIds = Array.from(selectedPlayers.keys())

        try {
            await updateFranchiseSquad(
                {
                    matchId,
                    isDraft: false,
                    data: {
                        playerIds
                    }
                },
                {
                    onSuccess: () => navigate('/franchise')
                }
            )
        } catch {
            throw new Error('Failed to save squad')
        }
    }
    // Logic for budget, handleAdd, handleRemove, handleSubmit goes here...
    // Auto-save squad changes with a debounce to prevent excessive API calls during rapid player selection changes, and only trigger when there are selected players and a valid match ID to ensure we have the necessary context to save the squad
    useEffect(() => {
        if (!matchId || selectedPlayers.size === 0) return

        // 1. Get the current player IDs from the server (overview) to compare against local state before deciding to save
        const serverPlayerIds = overview?.rosterCycle?.map((p) => p.id) || []

        // 2. Get IDs from the Local State
        const localPlayerIds = Array.from(selectedPlayers.keys())

        // 3. Compare them: Only save if the lists are actually different
        const isSameAsServer = serverPlayerIds.length === localPlayerIds.length && localPlayerIds.every((id) => serverPlayerIds.includes(id))

        if (isSameAsServer) return // <--- Skip the save if they match

        const timer = setTimeout(() => {
            updateFranchiseSquad({
                matchId,
                isDraft: true,
                data: {
                    playerIds: localPlayerIds
                }
            })
        }, 1500) // Debounce updates to avoid excessive API calls during rapid player selection changes

        return () => clearTimeout(timer)
    }, [selectedPlayers, matchId, updateFranchiseSquad])

    // Hydrate selected players from overview when it loads to populate the UI with the current squad and allow users to make adjustments, but only set on initial load to avoid overwriting user selections during squad building
    useEffect(() => {
        // Create a map of
        const savedPlayers = new Map<string, Player>()

        if (overview?.rosterCycle) {
            overview.rosterCycle.forEach((player) => {
                savedPlayers.set(player.id, player)
            })

            setSelectedPlayers(savedPlayers)
        } else {
            setSelectedPlayers(new Map()) // Clear selected players if no overview or roster cycle exists to reset the state for new squad building
        }
    }, [overview])

    return {
        ...filteredPlayers,
        isUpdatingFranchise,
        playersData,
        isPlayersLoading,
        selectedPlayers,
        budgetRemaining,
        handleAddPlayer,
        handleRemovePlayer,
        handleSubmit,
        isDrawerOpen,
        setIsDrawerOpen,
        saveStatus,
        lastSavedAt,
        closeWindowAt
        // ... all other states and handlers
    }
}
