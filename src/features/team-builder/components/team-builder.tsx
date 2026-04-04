import axios from 'axios'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import client from '@/shared/lib/api-client.ts'
import { INITIAL_CREDITS } from '@/shared/lib/mock-data'

import type { Player } from '../types/players.ts'
import type { CurrentTeam } from '../types/team'

import { PlayerList } from './player-list'
import { TeamCanvas } from './team-canvas.tsx'
import { ValidationErrors } from './validation-error'

interface TeamBuilderProps {
    players: Player[]
    matchId: string | null
    mode?: 'create' | 'edit'
    teamId?: string
    initialTeam?: CurrentTeam['team'] | null
}

type ApiErrorPayload = {
    error?: string
    message?: string
    errors?: Array<{ message?: string }>
}

type PlayerSource = {
    id?: string | number
    name?: string
    iplTeam?: string
    team?: string
    role?: string
    profileImageUrl?: string
    profilePicUrl?: string
    isOverseas?: boolean
    cost?: number
    credits?: number
}

const normalizePlayer = (player: PlayerSource): Player => {
    return {
        id: String(player.id ?? ''),
        name: String(player.name ?? ''),
        iplTeam: String(player.iplTeam ?? player.team ?? '') as Player['iplTeam'],
        role: String(player.role ?? '') as Player['role'],
        profileImageUrl: String(player.profileImageUrl ?? player.profilePicUrl ?? ''),
        isOverseas: Boolean(player.isOverseas),
        cost: Number(player.cost ?? player.credits ?? 0)
    }
}

export function TeamBuilder({ players, matchId, mode = 'create', teamId, initialTeam }: TeamBuilderProps) {
    const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
    const [captain, setCaptain] = useState<string | null>(null)
    const [viceCaptain, setViceCaptain] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterTeam, setFilterTeam] = useState<string>('')
    const [filterRole, setFilterRole] = useState<string>('')
    const [filterOverseas, setFilterOverseas] = useState<boolean>(false)
    const [filterIndiansOnly, setFilterIndiansOnly] = useState<boolean>(false)
    const [teamName, setTeamName] = useState<string>(initialTeam?.name || '')
    const hasHydratedInitialTeam = useRef(false)
    const navigate = useNavigate()
    const normalizedPlayers = useMemo(() => players.map((player) => normalizePlayer(player)), [players])

    useEffect(() => {
        if (mode !== 'edit' || !initialTeam || hasHydratedInitialTeam.current) {
            return
        }

        setTeamName(initialTeam.name ?? '')
        setSelectedPlayers(initialTeam.players.map((player) => normalizePlayer(player)))
        setCaptain(initialTeam.captainId)
        setViceCaptain(initialTeam.viceCaptainId)
        hasHydratedInitialTeam.current = true
    }, [mode, initialTeam])

    // Calculate remaining credits
    const usedCredits = selectedPlayers.reduce((sum, p) => sum + p.cost, 0)
    const remainingCredits = INITIAL_CREDITS - usedCredits

    // Filter available players
    const availablePlayers = useMemo(() => {
        return normalizedPlayers.filter((player) => {
            const isSelected = selectedPlayers.some((p) => p.id === player.id)
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
    }, [normalizedPlayers, selectedPlayers, searchTerm, filterTeam, filterRole, filterOverseas, filterIndiansOnly])

    // Validation
    const errors = useMemo(() => {
        const validationErrors: string[] = []
        if (teamName.trim().length < 3) {
            validationErrors.push('Team name must be at least 3 characters long')
        }
        if (selectedPlayers.length > 11) {
            validationErrors.push('Maximum 11 players allowed')
        }
        if (selectedPlayers.length === 11 && !captain) {
            validationErrors.push('Captain is required')
        }
        if (selectedPlayers.length === 11 && !viceCaptain) {
            validationErrors.push('Vice-Captain is required')
        }
        return validationErrors
    }, [teamName, selectedPlayers.length, captain, viceCaptain])

    const canSave = selectedPlayers.length === 11 && Boolean(captain) && Boolean(viceCaptain) && errors.length === 0

    // Handlers
    const handleAddPlayer = (player: Player) => {
        if (selectedPlayers.length < 11) {
            setSelectedPlayers([...selectedPlayers, player])
        }
    }

    const handleRemovePlayer = (playerId: string) => {
        setSelectedPlayers(selectedPlayers.filter((p) => p.id !== playerId))
        if (captain === playerId) setCaptain(null)
        if (viceCaptain === playerId) setViceCaptain(null)
    }

    const handleSetCaptain = (playerId: string) => {
        if (viceCaptain === playerId) {
            setViceCaptain(null)
        }
        setCaptain(playerId)
    }

    const handleSetViceCaptain = (playerId: string) => {
        if (captain === playerId) {
            setCaptain(null)
        }
        setViceCaptain(playerId)
    }

    const handleSaveTeam = async () => {
        if (!matchId) {
            toast.error('No active match found. Please try again later.')
            return
        }

        try {
            const payload = {
                name: teamName.trim(),
                matchId,
                playerIds: selectedPlayers.map((p) => String(p.id)),
                captainId: String(captain),
                viceCaptainId: String(viceCaptain)
            }

            if (mode === 'edit') {
                if (!teamId) {
                    toast.error('Missing team id for edit. Please try again.')
                    return
                }

                await client.put(`/team/${teamId}`, payload)
            } else {
                await client.post('/team', payload)
            }

            navigate(`/my-squad/`)
            toast.success(mode === 'edit' ? 'Team updated successfully!' : 'Team saved successfully!')
        } catch (error) {
            let message = 'Failed to save team.'

            if (axios.isAxiosError<ApiErrorPayload>(error)) {
                message =
                    error.response?.data?.error ??
                    error.response?.data?.message ??
                    error.response?.data?.errors?.[0]?.message ??
                    error.message ??
                    message
            } else if (error instanceof Error) {
                message = error.message
            }
            toast.error(`Failed to ${mode === 'edit' ? 'update' : 'save'} team: ${message}`)
        }
    }

    return (
        <div className="w-full flex flex-col gap-4 p-4 md:p-6 lg:p-8">
            <div className="text-start">
                <h1 className="text-2xl font-bold">
                    Fantasy Cricket <span className="text-primary">Team Builder</span>
                </h1>
                <p className="text-sm text-muted-foreground">Select your players, assign roles, and build your dream team!</p>
            </div>
            <div className="w-full max-w-md">
                <label
                    htmlFor="team-name"
                    className="mb-2 block text-sm font-medium text-foreground">
                    Team Name
                </label>
                <input
                    id="team-name"
                    value={teamName}
                    onChange={(event) => setTeamName(event.target.value)}
                    placeholder="Enter your team name"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    maxLength={40}
                />
            </div>
            {/* Mobile: Stack vertically, Desktop: 40% left, 60% right */}
            <div className="flex flex-col lg:flex-row gap-4 w-full">
                <div className="w-full lg:w-[60%] flex flex-col gap-4">
                    <PlayerList
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
                        canAddMore={selectedPlayers.length < 11}
                        filterIndiansOnly={filterIndiansOnly}
                        onFilterIndiansOnlyChange={setFilterIndiansOnly}
                    />
                </div>

                <div className="w-full lg:w-[40%] flex flex-col gap-4">
                    <TeamCanvas
                        selectedPlayers={selectedPlayers}
                        captain={captain}
                        viceCaptain={viceCaptain}
                        remainingCredits={remainingCredits}
                        onRemovePlayer={handleRemovePlayer}
                        onSetCaptain={handleSetCaptain}
                        onSetViceCaptain={handleSetViceCaptain}
                    />

                    {errors.length > 0 && <ValidationErrors errors={errors} />}

                    <button
                        onClick={handleSaveTeam}
                        disabled={!canSave}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                            canSave ? 'bg-primary/90 hover:bg-primary text-white shadow-lg' : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}>
                        Save Team
                    </button>
                </div>
            </div>
        </div>
    )
}
