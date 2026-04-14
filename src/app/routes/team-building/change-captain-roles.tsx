import { useState, useMemo } from 'react'
import { BiSolidLeftArrowCircle } from 'react-icons/bi'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useGetFixture } from '@/features/team-builder/api/get-fixture'
import { useGetTeamById } from '@/features/team-builder/api/get-team-by-id'
import { useUpdateRole } from '@/features/team-builder/api/update-role'

import CurrentRolesCard from '@/features/team-builder/components/change-roles/current-roles-card'
import LockStatusBanner from '@/features/team-builder/components/change-roles/lock-status-banner'
import PlayerRoleCard from '@/features/team-builder/components/change-roles/player-role-card'
import RoleActionFooter from '@/features/team-builder/components/change-roles/role-action-footer'

import type { Player } from '@/features/team-builder/types/team'
import { getTimeState } from '@/features/team-builder/utils/time'

type RoleState = {
    captainId: string | null
    viceCaptainId: string | null
}

export default function ChangeCaptainRoles() {
    const { teamId } = useParams<{ teamId: string }>()
    const navigate = useNavigate()

    const { data: team } = useGetTeamById({ teamId: teamId! })
    const { data: fixture } = useGetFixture({})
    const { mutateAsync: updateRole } = useUpdateRole()

    // 🔑 Single controlled state
    const [roles, setRoles] = useState<RoleState>({
        captainId: null,
        viceCaptainId: null
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    // ✅ Initialize roles lazily (no useEffect)
    useMemo(() => {
        if (team && !roles.captainId && !roles.viceCaptainId) {
            setRoles({
                captainId: team.captainId,
                viceCaptainId: team.viceCaptainId
            })
        }
    }, [team])

    const isLocked = fixture ? getTimeState(fixture.startTime).isLocked : true

    // ✅ Derived validation
    const isFormValid = useMemo(() => {
        if (!team || !fixture) return false

        const { captainId, viceCaptainId } = roles

        return (
            !!captainId &&
            !!viceCaptainId &&
            captainId !== viceCaptainId &&
            (captainId !== team.captainId || viceCaptainId !== team.viceCaptainId)
        ) as boolean
    }, [roles, team, fixture])

    // ✅ Generic role updater
    const updateRoleSelection = (playerId: string, type: 'captain' | 'vice') => {
        if (isLocked) return

        setRoles(prev => {
            const current = type === 'captain' ? prev.captainId : prev.viceCaptainId
            const updatedValue = current === playerId ? null : playerId

            return {
                ...prev,
                [type === 'captain' ? 'captainId' : 'viceCaptainId']: updatedValue
            }
        })

        setSubmitError(null)
    }

    const handleReset = () => {
        if (!team) return

        setRoles({
            captainId: team.captainId,
            viceCaptainId: team.viceCaptainId
        })

        setSubmitError(null)
    }

    const handleSubmit = async () => {
        if (!isFormValid || isLocked || !team || !fixture) return

        setIsSubmitting(true)
        setSubmitError(null)

        try {
            await updateRole({
                teamId: team.id,
                data: {
                    fixtureId: fixture.id,
                    newCaptainId: roles.captainId!,
                    newViceCaptainId: roles.viceCaptainId!
                }
            })

            toast('Roles updated successfully!')
            navigate('/my-squad')
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!team || !fixture) {
        return (
            <div className="min-h-screen bg-neutral-background">
                <main className="max-w-2xl mx-auto px-4 py-6">
                    <Button onClick={() => navigate('/my-squad')}>
                        <BiSolidLeftArrowCircle />
                        Go back
                    </Button>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-background">
            <main className="max-w-2xl mx-auto px-4 py-6 pb-32 space-y-6">
                <Button onClick={() => navigate('/my-squad')}>
                    <BiSolidLeftArrowCircle />
                    Go back
                </Button>

                <LockStatusBanner fixture={fixture} />

                <CurrentRolesCard
                    currentCaptainId={team.captainId}
                    currentViceCaptainId={team.viceCaptainId}
                    players={team.players || []}
                    fixtureId={fixture.id}
                />

                <div className="space-y-3">
                    <h2 className="text-sm font-semibold">Select New Roles</h2>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {team.players.map((player: Player) => (
                            <PlayerRoleCard
                                key={player.id}
                                player={player}
                                selectedCaptainId={roles.captainId}
                                selectedViceCaptainId={roles.viceCaptainId}
                                isLocked={isLocked}
                                onRoleChange={updateRoleSelection}
                            />
                        ))}
                    </div>
                </div>
            </main>

            <RoleActionFooter
                isLocked={isLocked}
                isSubmitting={isSubmitting}
                isFormValid={isFormValid}
                submitError={submitError}
                onUpdate={handleSubmit}
                onReset={handleReset}
            />
        </div>
    )
}