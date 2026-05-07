import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useCreateFixture } from '../api/fixtures'
import { useMatches } from '../api/matches'

const IPL_TEAMS = ['CSK', 'MI', 'RCB', 'KKR', 'SRH', 'DC', 'PBKS', 'RR', 'GT', 'LSG'] as const

interface CreateFixtureModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateFixtureModal({ open, onOpenChange }: CreateFixtureModalProps) {
    const createFixtureMutation = useCreateFixture()
    const { data: matches } = useMatches()

    const [formData, setFormData] = useState({
        id: '',
        matchId: '',
        teamA: '',
        teamB: '',
        startTime: '',
        lineupLockAt: '',
        matchNumber: '',
        venueId: '',
        matchStatus: 'scheduled' as 'scheduled' | 'live' | 'completed'
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        createFixtureMutation.mutate(
            {
                id: formData.id.trim(),
                matchId: formData.matchId,
                teamA: formData.teamA,
                teamB: formData.teamB,
                startTime: new Date(formData.startTime).toISOString(),
                lineupLockAt: formData.lineupLockAt ? new Date(formData.lineupLockAt).toISOString() : undefined,
                matchNumber: formData.matchNumber.trim() || undefined,
                venueId: formData.venueId.trim() || undefined,
                matchStatus: formData.matchStatus
            },
            {
                onSuccess: () => {
                    toast.success('Fixture created successfully')
                    onOpenChange(false)
                    setFormData({
                        id: '',
                        matchId: '',
                        teamA: '',
                        teamB: '',
                        startTime: '',
                        lineupLockAt: '',
                        matchNumber: '',
                        venueId: '',
                        matchStatus: 'scheduled'
                    })
                },
                onError: (err) => {
                    toast.error(err.message || 'Failed to create fixture')
                }
            }
        )
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Fixture</DialogTitle>
                    <DialogDescription>Add a new match fixture to a game cycle</DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4">
                    <Field>
                        <FieldLabel htmlFor="fixtureId">Fixture ID</FieldLabel>
                        <Input
                            id="fixtureId"
                            placeholder="e.g., MI_vs_DD_2026_05_10"
                            value={formData.id}
                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                            required
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Game Cycle (Match)</FieldLabel>
                        <Select
                            value={formData.matchId}
                            onValueChange={(val) => setFormData({ ...formData, matchId: val })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a match" />
                            </SelectTrigger>
                            <SelectContent>
                                {matches?.map((m) => (
                                    <SelectItem
                                        key={m.id}
                                        value={m.id}>
                                        {m.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="teamA">Team A</FieldLabel>
                            <Select
                                value={formData.teamA}
                                onValueChange={(val) => setFormData({ ...formData, teamA: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select team A" />
                                </SelectTrigger>
                                <SelectContent>
                                    {IPL_TEAMS.map((team) => (
                                        <SelectItem
                                            key={team}
                                            value={team}>
                                            {team}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="teamB">Team B</FieldLabel>
                            <Select
                                value={formData.teamB}
                                onValueChange={(val) => setFormData({ ...formData, teamB: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select team B" />
                                </SelectTrigger>
                                <SelectContent>
                                    {IPL_TEAMS.filter((team) => team !== formData.teamA).map((team) => (
                                        <SelectItem
                                            key={team}
                                            value={team}>
                                            {team}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="startTime">Start Time</FieldLabel>
                        <Input
                            id="startTime"
                            type="datetime-local"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            required
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="lineupLockAt">Lineup Lock Time</FieldLabel>
                        <Input
                            id="lineupLockAt"
                            type="datetime-local"
                            value={formData.lineupLockAt}
                            onChange={(e) => setFormData({ ...formData, lineupLockAt: e.target.value })}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="matchNumber">Match Number</FieldLabel>
                            <Input
                                id="matchNumber"
                                placeholder="e.g., 21"
                                value={formData.matchNumber}
                                onChange={(e) => setFormData({ ...formData, matchNumber: e.target.value })}
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Status</FieldLabel>
                            <Select
                                value={formData.matchStatus}
                                onValueChange={(val: 'scheduled' | 'live' | 'completed') => setFormData({ ...formData, matchStatus: val })}>
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
                    </div>

                    <Field>
                        <FieldLabel htmlFor="venueId">Venue</FieldLabel>
                        <Input
                            id="venueId"
                            placeholder="e.g., Wankhede Stadium"
                            value={formData.venueId}
                            onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
                        />
                    </Field>

                    <DialogFooter className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={createFixtureMutation.isPending}
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createFixtureMutation.isPending}
                            className="w-full sm:w-auto">
                            {createFixtureMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Fixture'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
