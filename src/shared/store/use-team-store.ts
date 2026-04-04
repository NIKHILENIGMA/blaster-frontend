import { create } from 'zustand'

// We only need the essential player data for the client-side state
export type TeamPlayer = {
    id: number
    name: string
    creditValue: number
    isOverseas: boolean
    role: string // 'BAT', 'BOWL', 'AR', 'WK'
}

interface TeamState {
    // State Values
    selectedPlayers: TeamPlayer[]
    budget: number
    overseasCount: number
    captainId: number | null
    viceCaptainId: number | null
    impactPlayerId: number | null

    // Actions
    addPlayer: (player: TeamPlayer) => { success: boolean; message?: string }
    removePlayer: (playerId: number) => void
    setRole: (roleType: 'captain' | 'viceCaptain' | 'impactPlayer', playerId: number) => { success: boolean; message?: string }
    resetTeam: () => void
    loadExistingTeam: (players: TeamPlayer[], captainId: number, viceCaptainId: number, impactPlayerId: number) => void
}

const INITIAL_BUDGET = 500
const MAX_PLAYERS = 11
const MAX_OVERSEAS = 4

export const useTeamStore = create<TeamState>((set, get) => ({
    // --- Initial State ---
    selectedPlayers: [],
    budget: INITIAL_BUDGET,
    overseasCount: 0,
    captainId: null,
    viceCaptainId: null,
    impactPlayerId: null,

    // --- Actions ---

    addPlayer: (player) => {
        const state = get()

        // 1. Check if team is full
        if (state.selectedPlayers.length >= MAX_PLAYERS) {
            return { success: false, message: 'Your squad already has 11 players.' }
        }

        // 2. Check if player is already selected
        if (state.selectedPlayers.some((p) => p.id === player.id)) {
            return { success: false, message: 'Player is already in your squad.' }
        }

        // 3. Check budget constraint
        if (state.budget < player.creditValue) {
            return { success: false, message: `Not enough credits. You need ${player.creditValue} but have ${state.budget}.` }
        }

        // 4. Check overseas constraint
        if (player.isOverseas && state.overseasCount >= MAX_OVERSEAS) {
            return { success: false, message: 'You can only have a maximum of 4 overseas players.' }
        }

        // 5. Update state
        set((state) => ({
            selectedPlayers: [...state.selectedPlayers, player],
            budget: state.budget - player.creditValue,
            overseasCount: state.overseasCount + (player.isOverseas ? 1 : 0)
        }))

        return { success: true }
    },

    removePlayer: (playerId) => {
        set((state) => {
            const playerToRemove = state.selectedPlayers.find((p) => p.id === playerId)
            if (!playerToRemove) return state

            return {
                selectedPlayers: state.selectedPlayers.filter((p) => p.id !== playerId),
                budget: state.budget + playerToRemove.creditValue, // Refund the points
                overseasCount: state.overseasCount - (playerToRemove.isOverseas ? 1 : 0),
                // Instantly clear roles if the removed player was holding one
                captainId: state.captainId === playerId ? null : state.captainId,
                viceCaptainId: state.viceCaptainId === playerId ? null : state.viceCaptainId,
                impactPlayerId: state.impactPlayerId === playerId ? null : state.impactPlayerId
            }
        })
    },

    setRole: (roleType, playerId) => {
        const state = get()

        // Ensure the player is actually in the squad before assigning a role
        if (!state.selectedPlayers.some((p) => p.id === playerId)) {
            return { success: false, message: 'You must add the player to your team first.' }
        }

        // Prevent assigning the same player to multiple roles
        if (
            (roleType !== 'captain' && state.captainId === playerId) ||
            (roleType !== 'viceCaptain' && state.viceCaptainId === playerId) ||
            (roleType !== 'impactPlayer' && state.impactPlayerId === playerId)
        ) {
            return { success: false, message: 'A player can only hold one role.' }
        }

        if (roleType === 'captain') set({ captainId: playerId })
        if (roleType === 'viceCaptain') set({ viceCaptainId: playerId })
        if (roleType === 'impactPlayer') set({ impactPlayerId: playerId })

        return { success: true }
    },

    resetTeam: () => {
        set({
            selectedPlayers: [],
            budget: INITIAL_BUDGET,
            overseasCount: 0,
            captainId: null,
            viceCaptainId: null,
            impactPlayerId: null
        })
    },

    // Useful for when a user logs in and you fetch their previously saved team from the DB
    loadExistingTeam: (players, captainId, viceCaptainId, impactPlayerId) => {
        const totalSpent = players.reduce((sum, p) => sum + p.creditValue, 0)
        const overseasTotal = players.filter((p) => p.isOverseas).length

        set({
            selectedPlayers: players,
            budget: INITIAL_BUDGET - totalSpent,
            overseasCount: overseasTotal,
            captainId,
            viceCaptainId,
            impactPlayerId
        })
    }
}))
