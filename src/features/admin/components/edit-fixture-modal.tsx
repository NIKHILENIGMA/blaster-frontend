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
    const [lineupLockAt, setLineupLockAt] = useState('')
    const [matchStatus, setMatchStatus] = useState<'scheduled' | 'live' | 'completed'>('scheduled')

    useEffect(() => {
        if (!fixture) return

        setLineupLockAt(toLocalInputValue(fixture.lineupLockAt))
        setMatchStatus(fixture.matchStatus ?? 'scheduled')
    }, [fixture])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!fixture) return

        updateFixtureMutation.mutate(
            {
                fixtureId: fixture.id,
                data: {
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
            <DialogContent className="w-full max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Fixture</DialogTitle>
                    <DialogDescription>
                        Update fixture status and control when lineup changes get locked.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4">
                    <Field>
                        <FieldLabel>Fixture</FieldLabel>
                        <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                            {fixture?.teamA} vs {fixture?.teamB}
                        </div>
                    </Field>

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
