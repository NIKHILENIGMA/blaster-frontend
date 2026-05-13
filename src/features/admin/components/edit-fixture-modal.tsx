import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateFixture } from '../api/fixtures'
import type { Fixture } from '../types/fixtures'

interface EditFixtureModalProps {
    fixture: Fixture | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

const toLocalInputValue = (value: Date | string | null | undefined) => {
    if (!value) return ''

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''

    const year = date.getFullYear()
    const month = `${date.getMonth() + 1}`.padStart(2, '0')
    const day = `${date.getDate()}`.padStart(2, '0')
    const hours = `${date.getHours()}`.padStart(2, '0')
    const minutes = `${date.getMinutes()}`.padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function EditFixtureModal({ fixture, open, onOpenChange }: EditFixtureModalProps) {
    const updateFixtureMutation = useUpdateFixture()
    const [teamA, setTeamA] = useState('')
    const [teamB, setTeamB] = useState('')
    const [startTime, setStartTime] = useState('')
    const [lineupLockAt, setLineupLockAt] = useState('')
    const [matchNumber, setMatchNumber] = useState('')
    const [venueId, setVenueId] = useState('')
    const [matchStatus, setMatchStatus] = useState<'scheduled' | 'live' | 'completed'>('scheduled')

    useEffect(() => {
        if (!fixture) return

        setTeamA(fixture.teamA)
        setTeamB(fixture.teamB)
        setStartTime(toLocalInputValue(fixture.startTime))
        setLineupLockAt(toLocalInputValue(fixture.lineupLockAt))
        setMatchNumber(fixture.matchNumber ?? '')
        setVenueId(fixture.venueId ?? '')
        setMatchStatus(fixture.matchStatus ?? 'scheduled')
    }, [fixture])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!fixture) return

        updateFixtureMutation.mutate(
            {
                fixtureId: fixture.id,
                data: {
                    teamA: teamA.trim(),
                    teamB: teamB.trim(),
                    startTime: new Date(startTime).toISOString(),
                    matchNumber: matchNumber.trim() || null,
                    venueId: venueId.trim() || null,
                    matchStatus,
                    lineupLockAt: lineupLockAt ? new Date(lineupLockAt).toISOString() : null
                }
            },
            {
                onSuccess: () => {
                    toast.success('Fixture updated successfully')
                    onOpenChange(false)
                },
                onError: (err) => {
                    toast.error(err.message || 'Failed to update fixture')
                }
            }
        )
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Fixture</DialogTitle>
                    <DialogDescription>
                        Update teams, schedule, venue, status, and lineup lock timing.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4">
                    <Field>
                        <FieldLabel>Fixture</FieldLabel>
                        <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                            <p className="font-medium">{fixture?.id}</p>
                            <p className="mt-1 text-xs text-muted-foreground">Match ID: {fixture?.matchId}</p>
                        </div>
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="teamA">Team A</FieldLabel>
                            <Input
                                id="teamA"
                                value={teamA}
                                onChange={(e) => setTeamA(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="teamB">Team B</FieldLabel>
                            <Input
                                id="teamB"
                                value={teamB}
                                onChange={(e) => setTeamB(e.target.value)}
                            />
                        </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="matchNumber">Match Number</FieldLabel>
                            <Input
                                id="matchNumber"
                                placeholder="Match 1"
                                value={matchNumber}
                                onChange={(e) => setMatchNumber(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="venueId">Venue</FieldLabel>
                            <Input
                                id="venueId"
                                placeholder="Wankhede Stadium"
                                value={venueId}
                                onChange={(e) => setVenueId(e.target.value)}
                            />
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel>Status</FieldLabel>
                        <Select
                            value={matchStatus}
                            onValueChange={(value: 'scheduled' | 'live' | 'completed') => setMatchStatus(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="live">Live</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="startTime">Start Time</FieldLabel>
                        <Input
                            id="startTime"
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="lineupLockAt">Lineup Lock Time</FieldLabel>
                        <Input
                            id="lineupLockAt"
                            type="datetime-local"
                            value={lineupLockAt}
                            onChange={(e) => setLineupLockAt(e.target.value)}
                        />
                    </Field>

                    <DialogFooter className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={updateFixtureMutation.isPending}
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateFixtureMutation.isPending}
                            className="w-full sm:w-auto">
                            {updateFixtureMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
