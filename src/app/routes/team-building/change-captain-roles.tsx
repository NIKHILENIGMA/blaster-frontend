// import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { useGetFixture } from '@/features/team-builder/api/get-fixture'
import { useGetTeamById } from '@/features/team-builder/api/get-team-by-id'
import CurrentRolesCard from '@/features/team-builder/components/change-roles/current-roles-card'
import LockStatusBanner from '@/features/team-builder/components/change-roles/lock-status-banner'
import PlayerRoleCard from '@/features/team-builder/components/change-roles/player-role-card'
import RoleActionFooter from '@/features/team-builder/components/change-roles/role-action-footer'
import type { Player } from '@/features/team-builder/types/team'
import { getTimeState } from '@/features/team-builder/utils/time'
import { Button } from '@/components/ui/button'
import { BiSolidLeftArrowCircle } from 'react-icons/bi'

import { useUpdateRole } from '@/features/team-builder/api/update-role'

export default function ChangeCaptainRoles() {
    const { teamId } = useParams<{ teamId: string }>()
    const navigate = useNavigate()
    const { data: team } = useGetTeamById({
        teamId: teamId!
    })

    const { data: fixture } = useGetFixture({})

    const [selectedFixtureId, setSelectedFixtureId] = useState<string | null>(fixture?.id || null)
    const [selectedCaptainId, setSelectedCaptainId] = useState<string | null>(team?.captainId || null)
    const [selectedViceCaptainId, setSelectedViceCaptainId] = useState<string | null>(team?.viceCaptainId || null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const { mutateAsync: updateRole } = useUpdateRole()

    useEffect(() => {
        if (fixture?.id) {
            setSelectedFixtureId(fixture.id)
        }
    }, [fixture?.id])

    useEffect(() => {
        if (team?.captainId) {
            setSelectedCaptainId(team.captainId)
        }

        if (team?.viceCaptainId) {
            setSelectedViceCaptainId(team.viceCaptainId)
        }
    }, [team?.captainId, team?.viceCaptainId])

    const { isLocked } = fixture ? getTimeState(fixture.startTime) : { isLocked: true }

    // Validate form
    const isFormValid =
        selectedFixtureId &&
        selectedCaptainId &&
        selectedViceCaptainId &&
        selectedCaptainId !== selectedViceCaptainId &&
        (selectedCaptainId !== team?.captainId || selectedViceCaptainId !== team?.viceCaptainId)

    const handlePlayerRoleChange = (playerId: string, roleType: 'captain' | 'vice') => {
        if (isLocked) return

        if (roleType === 'captain') {
            if (selectedCaptainId === playerId) {
                setSelectedCaptainId(null)
            } else {
                setSelectedCaptainId(playerId)
            }
        } else {
            if (selectedViceCaptainId === playerId) {
                setSelectedViceCaptainId(null)
            } else {
                setSelectedViceCaptainId(playerId)
            }
        }
        setSubmitError(null)
    }

    const handleResetRoles = () => {
        if (!team) return

        setSelectedCaptainId(team.captainId)
        setSelectedViceCaptainId(team.viceCaptainId)
        setSubmitError(null)
    }

    const handleUpdateRoles = async () => {
        if (!isFormValid || isLocked || !team) return

        setIsSubmitting(true)
        setSubmitError(null)

        try {
            // Simulate API call

            await updateRole({
                teamId: team.id,
                data: {
                    fixtureId: selectedFixtureId!,
                    newCaptainId: selectedCaptainId!,
                    newViceCaptainId: selectedViceCaptainId!
                }
            })

            const updatedCaptainId = selectedCaptainId!
            const updatedViceCaptainId = selectedViceCaptainId!

            toast('Captain and Vice-Captain roles updated successfully!')

            // Reset after success
            setTimeout(() => {
                setSelectedFixtureId(null)
                setSelectedCaptainId(updatedCaptainId)
                setSelectedViceCaptainId(updatedViceCaptainId)
            }, 1500)
            navigate('/my-squad')
        } catch (error) {
            console.error(error)
            setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen w-full bg-neutral-background">
            {/* Main Content */}
            <main className="mx-auto w-full max-w-2xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="space-y-4 sm:space-y-6 pb-32">
                    {/* Fixture Selector */}
                    <Button
                        variant={'default'}
                        className="w-full md:w-24 "
                        onClick={() => navigate('/my-squad')}>
                        <BiSolidLeftArrowCircle />
                        Go back
                    </Button>

                    {selectedFixtureId && (
                        <>
                            {/* Lock Status Banner */}
                            <LockStatusBanner fixture={fixture!} />

                            {/* Current Roles Card */}
                            <CurrentRolesCard
                                currentCaptainId={team?.captainId!}
                                currentViceCaptainId={team?.viceCaptainId!}
                                players={team?.players || []}
                                fixtureId={selectedFixtureId}
                            />

                            {/* Player Selection Grid */}
                            <div className="space-y-3">
                                <h2 className="text-sm font-semibold text-slate-900">Select New Roles</h2>
                                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                                    {team?.players.map((player: Player) => (
                                        <PlayerRoleCard
                                            key={player.id}
                                            player={player}
                                            selectedCaptainId={selectedCaptainId}
                                            selectedViceCaptainId={selectedViceCaptainId}
                                            isLocked={isLocked}
                                            onRoleChange={handlePlayerRoleChange}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Sticky Footer */}
            {selectedFixtureId && (
                <RoleActionFooter
                    isLocked={isLocked}
                    isSubmitting={isSubmitting}
                    isFormValid={!!isFormValid}
                    submitError={submitError}
                    onUpdate={handleUpdateRoles}
                    onReset={handleResetRoles}
                />
            )}
        </div>
    )
}
