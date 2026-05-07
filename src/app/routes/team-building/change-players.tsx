import { useEffect, useMemo, useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import Footer from '@/components/shared/footer'
import Header from '@/components/shared/header'
import { Button } from '@/components/ui/button'
import { useGetFixtureLineup, useSaveLineup } from '@/features/team-builder/api/franchise'
import type { RosterCyclePlayer } from '@/features/team-builder/types/franchise'
import { getTimeState } from '@/features/team-builder/utils/time'

const ROLE_REQUIREMENTS = {
    Batsman: 4,
    Bowler: 5,
    'All-Rounder': 2,
    'Wicket-Keeper': 1
} as const

export default function ChangePlayers() {
    const { fixtureId } = useParams<{ fixtureId: string }>()
    const navigate = useNavigate()
    const { data, isPending } = useGetFixtureLineup({ fixtureId: fixtureId ?? '' })
    const { mutateAsync: saveLineup, isPending: isSaving } = useSaveLineup()

    const [playingIds, setPlayingIds] = useState<string[]>([])
    const [captainId, setCaptainId] = useState<string | null>(null)
    const [viceCaptainId, setViceCaptainId] = useState<string | null>(null)
    const [impactPlayerId, setImpactPlayerId] = useState<string | null>(null)

    useEffect(() => {
        if (!data) return

        const initialPlaying =
            data.lineupPlayers.length > 0
                ? data.lineupPlayers.filter((player) => player.selectionType === 'PLAYING').map((player) => player.id)
                : data.squadPlayers.slice(0, 12).map((player) => player.id)

        setPlayingIds(initialPlaying)
        setCaptainId(data.lineup?.captainId ?? initialPlaying[0] ?? null)
        setViceCaptainId(data.lineup?.viceCaptainId ?? initialPlaying[1] ?? null)
        setImpactPlayerId(data.lineup?.impactPlayerId ?? initialPlaying[2] ?? null)
    }, [data])

    const squadPlayers = useMemo(() => data?.squadPlayers ?? [], [data?.squadPlayers])
    const isLocked = data?.fixture ? getTimeState(data.fixture.startTime).isLocked : true

    const playingPlayers = useMemo(() => squadPlayers.filter((player) => playingIds.includes(player.id)), [playingIds, squadPlayers])
    const substitutePlayers = useMemo(() => squadPlayers.filter((player) => !playingIds.includes(player.id)), [playingIds, squadPlayers])

    const validationErrors = useMemo(() => {
        const errors: string[] = []

        if (playingIds.length !== 12) {
            errors.push('Select exactly 12 players for the playing lineup')
        }

        const overseas = playingPlayers.filter((player) => player.isOverseas).length
        if (overseas > 4) {
            errors.push('Playing 12 can contain a maximum of 4 overseas players')
        }

        const roleCount = playingPlayers.reduce<Record<string, number>>((acc, player) => {
            acc[player.role] = (acc[player.role] ?? 0) + 1
            return acc
        }, {})

        for (const [role, required] of Object.entries(ROLE_REQUIREMENTS)) {
            if ((roleCount[role] ?? 0) < required) {
                errors.push(`Playing 12 must include at least ${required} ${role}`)
            }
        }

        if (!captainId || !viceCaptainId || !impactPlayerId) {
            errors.push('Captain, vice-captain, and impact player are required')
        }

        if (new Set([captainId, viceCaptainId, impactPlayerId]).size !== 3) {
            errors.push('Captain, vice-captain, and impact player must be different players')
        }

        if (
            captainId &&
            viceCaptainId &&
            impactPlayerId &&
            (!playingIds.includes(captainId) || !playingIds.includes(viceCaptainId) || !playingIds.includes(impactPlayerId))
        ) {
            errors.push('All role assignments must come from the playing 12')
        }

        return errors
    }, [captainId, impactPlayerId, playingIds, playingPlayers, viceCaptainId])

    const togglePlayingStatus = (playerId: string) => {
        if (isLocked) return

        setPlayingIds((current) => {
            if (current.includes(playerId)) {
                return current.filter((id) => id !== playerId)
            }

            if (current.length >= 12) {
                toast.error('Playing 12 already selected. Remove one player first.')
                return current
            }

            return [...current, playerId]
        })
    }

    const handleSave = async () => {
        if (!fixtureId || validationErrors.length > 0 || isLocked) return

        await saveLineup({
            fixtureId,
            payload: {
                playingPlayerIds: playingIds,
                substitutePlayerIds: substitutePlayers.map((player) => player.id),
                captainId: captainId ?? '',
                viceCaptainId: viceCaptainId ?? '',
                impactPlayerId: impactPlayerId ?? ''
            }
        })

        toast.success('Fixture lineup saved successfully!')
        navigate('/my-squad')
    }

    const renderRoleSelector = (label: string, value: string | null, onChange: (value: string) => void) => (
        <div className="rounded-xl border border-border bg-card p-4">
            <label className="mb-2 block text-sm font-medium">{label}</label>
            <select
                value={value ?? ''}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                disabled={isLocked}>
                <option value="">Select {label}</option>
                {playingPlayers.map((player) => (
                    <option
                        key={player.id}
                        value={player.id}>
                        {player.name} • {player.role}
                    </option>
                ))}
            </select>
        </div>
    )

    return (
        <div className="min-h-screen bg-neutral-background">
            <Header />
            <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
                <Button
                    onClick={() => navigate('/my-squad')}
                    variant="outline">
                    <FaArrowLeftLong />
                    Go back
                </Button>

                {isPending || !data ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500">Loading fixture lineup...</p>
                    </div>
                ) : (
                    <>
                        <section className="rounded-xl border border-border bg-card p-4 md:p-6">
                            <h1 className="text-2xl font-bold">
                                {data.fixture.teamA} vs {data.fixture.teamB}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">Pick your playing 12 from the saved 25-player squad.</p>
                            <p className="text-sm text-muted-foreground mt-2">Start time: {new Date(data.fixture.startTime).toLocaleString()}</p>
                        </section>

                        <section className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-xl border border-border bg-card p-4">
                                <p className="text-sm text-muted-foreground">Playing 12</p>
                                <p className="text-2xl font-bold">{playingIds.length}/12</p>
                            </div>
                            <div className="rounded-xl border border-border bg-card p-4">
                                <p className="text-sm text-muted-foreground">Substitutes</p>
                                <p className="text-2xl font-bold">{substitutePlayers.length}/13</p>
                            </div>
                            <div className="rounded-xl border border-border bg-card p-4">
                                <p className="text-sm text-muted-foreground">Status</p>
                                <p className="text-2xl font-bold">{isLocked ? 'Locked' : 'Editable'}</p>
                            </div>
                        </section>

                        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                            <div className="rounded-xl border border-border bg-card p-4 md:p-6">
                                <h2 className="text-lg font-semibold mb-4">25-Player Squad</h2>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {squadPlayers.map((player: RosterCyclePlayer) => {
                                        const isPlayingPlayer = playingIds.includes(player.id)
                                        return (
                                            <button
                                                key={player.id}
                                                type="button"
                                                onClick={() => togglePlayingStatus(player.id)}
                                                disabled={isLocked}
                                                className={`rounded-xl border p-4 text-left transition ${
                                                    isPlayingPlayer ? 'border-primary bg-primary/5' : 'border-border bg-background'
                                                } ${isLocked ? 'cursor-not-allowed opacity-75' : 'hover:border-primary/50'}`}>
                                                <div className="flex items-center justify-between gap-2">
                                                    <div>
                                                        <p className="font-semibold">{player.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {player.iplTeam} • {player.role}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs font-medium">{isPlayingPlayer ? 'PLAYING' : 'SUB'}</span>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {renderRoleSelector('Captain', captainId, setCaptainId)}
                                {renderRoleSelector('Vice-Captain', viceCaptainId, setViceCaptainId)}
                                {renderRoleSelector('Impact Player', impactPlayerId, setImpactPlayerId)}

                                {validationErrors.length > 0 && (
                                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                                        <h3 className="mb-2 font-semibold text-destructive">Validation</h3>
                                        <ul className="list-disc space-y-1 pl-5 text-sm text-destructive">
                                            {validationErrors.map((error) => (
                                                <li key={error}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <Button
                                    onClick={handleSave}
                                    disabled={isLocked || validationErrors.length > 0 || isSaving}
                                    className="w-full">
                                    {isSaving ? 'Saving...' : 'Save Fixture Lineup'}
                                </Button>
                            </div>
                        </section>
                    </>
                )}
            </main>
            <Footer />
        </div>
    )
}
