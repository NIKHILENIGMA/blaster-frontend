import { useEffect, useMemo, useState } from 'react'
import { BiSolidLeftArrowCircle } from 'react-icons/bi'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import AppBreadcrumb from '@/components/shared/app-breadcrumb'
import { Button } from '@/components/ui/button'
import { useGetFixtureLineup, useSaveLineup } from '@/features/team-builder/api/franchise'
import { getFixtureLockTime, getTimeState } from '@/features/team-builder/utils/time'

export default function ChangeCaptainRoles() {
    const { fixtureId } = useParams<{ fixtureId: string }>()
    const navigate = useNavigate()
    const { data, isPending } = useGetFixtureLineup({ fixtureId: fixtureId ?? '' })
    const { mutateAsync: saveLineup, isPending: isSaving } = useSaveLineup()

    const playingPlayers = useMemo(() => data?.lineupPlayers.filter((player) => player.selectionType === 'PLAYING') ?? [], [data?.lineupPlayers])

    const [captainId, setCaptainId] = useState<string | null>(null)
    const [viceCaptainId, setViceCaptainId] = useState<string | null>(null)
    const [impactPlayerId, setImpactPlayerId] = useState<string | null>(null)

    useEffect(() => {
        if (!data) return

        setCaptainId(data.lineup?.captainId ?? playingPlayers[0]?.id ?? null)
        setViceCaptainId(data.lineup?.viceCaptainId ?? playingPlayers[1]?.id ?? null)
        setImpactPlayerId(data.lineup?.impactPlayerId ?? playingPlayers[2]?.id ?? null)
    }, [data, playingPlayers])

    const isLocked = data?.fixture ? getTimeState(getFixtureLockTime(data.fixture.startTime, data.fixture.lineupLockAt)).isLocked : true

    const isFormValid =
        Boolean(captainId) && Boolean(viceCaptainId) && Boolean(impactPlayerId) && new Set([captainId, viceCaptainId, impactPlayerId]).size === 3

    const handleSubmit = async () => {
        if (!data || !fixtureId || !isFormValid || isLocked) return

        await saveLineup({
            fixtureId,
            payload: {
                playingPlayerIds: playingPlayers.map((player) => player.id),
                substitutePlayerIds: data.squadPlayers
                    .filter((player) => !playingPlayers.some((playingPlayer) => playingPlayer.id === player.id))
                    .map((player) => player.id),
                captainId: captainId ?? '',
                viceCaptainId: viceCaptainId ?? '',
                impactPlayerId: impactPlayerId ?? ''
            }
        })

        toast.success('Roles updated successfully!')
        navigate('/my-squad')
    }

    const renderSelector = (label: string, value: string | null, onChange: (value: string) => void) => (
        <div className="rounded-xl border border-border bg-card p-4">
            <label className="mb-2 block text-sm font-medium">{label}</label>
            <select
                value={value ?? ''}
                onChange={(event) => onChange(event.target.value)}
                disabled={isLocked}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
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
            <main className="max-w-3xl mx-auto px-4 py-6 pb-20 space-y-6">
                <AppBreadcrumb
                    items={[
                        { label: 'My Squad', to: '/my-squad' },
                        { label: data?.fixture ? `${data.fixture.teamA} vs ${data.fixture.teamB}` : 'Fixture Roles' },
                        { label: 'Change Roles' }
                    ]}
                />
                <Button onClick={() => navigate('/my-squad')}>
                    <BiSolidLeftArrowCircle />
                    Go back
                </Button>

                {isPending || !data ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500">Loading fixture roles...</p>
                    </div>
                ) : (
                    <>
                        <section className="rounded-xl border border-border bg-card p-4 md:p-6">
                            <h1 className="text-2xl font-bold">
                                Update Roles for {data.fixture.teamA} vs {data.fixture.teamB}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Choose captain, vice-captain, and impact player from the current playing 12.
                            </p>
                        </section>

                        <section className="grid gap-4 md:grid-cols-3">
                            {renderSelector('Captain', captainId, setCaptainId)}
                            {renderSelector('Vice-Captain', viceCaptainId, setViceCaptainId)}
                            {renderSelector('Impact Player', impactPlayerId, setImpactPlayerId)}
                        </section>

                        <section className="rounded-xl border border-border bg-card p-4 md:p-6">
                            <h2 className="mb-4 text-lg font-semibold">Current Playing 12</h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {playingPlayers.map((player) => (
                                    <div
                                        key={player.id}
                                        className="rounded-lg border border-border px-3 py-2">
                                        <p className="font-medium">{player.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {player.iplTeam} • {player.role}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {!isFormValid && (
                            <p className="text-sm text-destructive">Select three different players for captain, vice-captain, and impact player.</p>
                        )}

                        <Button
                            onClick={handleSubmit}
                            disabled={!isFormValid || isLocked || isSaving}
                            className="w-full">
                            {isSaving ? 'Updating...' : 'Update Roles'}
                        </Button>
                    </>
                )}
            </main>
        </div>
    )
}
