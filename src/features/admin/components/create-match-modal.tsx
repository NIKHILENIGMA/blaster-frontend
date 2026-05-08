import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import { useCreateMatch, useUpdateMatch } from '../api/matches'
import type { Match, UpsertMatchDTO } from '../types/match'

interface CreateMatchModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    match?: Match | null
}

type MatchFormData = {
    title: string
    startTime: string
    endTime: string
    buyWindowOpenAt: string
    buyWindowCloseAt: string
    squadLockAt: string
}

const emptyForm: MatchFormData = {
    title: '',
    startTime: '',
    endTime: '',
    buyWindowOpenAt: '',
    buyWindowCloseAt: '',
    squadLockAt: ''
}

const toDateTimeLocal = (value?: string | null) => {
    if (!value) return ''

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''

    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    return offsetDate.toISOString().slice(0, 16)
}

const toIsoOrUndefined = (value: string) => (value ? new Date(value).toISOString() : undefined)

const toFormData = (match?: Match | null): MatchFormData => {
    if (!match) return emptyForm

    return {
        title: match.title,
        startTime: toDateTimeLocal(match.startTime),
        endTime: toDateTimeLocal(match.endTime),
        buyWindowOpenAt: toDateTimeLocal(match.buyWindowOpenAt),
        buyWindowCloseAt: toDateTimeLocal(match.buyWindowCloseAt),
        squadLockAt: toDateTimeLocal(match.squadLockAt)
    }
}

export function CreateMatchModal({ open, onOpenChange, match }: CreateMatchModalProps) {
    const createMatchMutation = useCreateMatch()
    const updateMatchMutation = useUpdateMatch()
    const [formData, setFormData] = useState<MatchFormData>(emptyForm)
    const isEditing = Boolean(match)
    const isSaving = createMatchMutation.isPending || updateMatchMutation.isPending

    useEffect(() => {
        if (open) {
            setFormData(toFormData(match))
        }
    }, [match, open])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const payload: UpsertMatchDTO = {
            title: formData.title.trim(),
            startTime: new Date(formData.startTime).toISOString(),
            endTime: new Date(formData.endTime).toISOString(),
            buyWindowOpenAt: toIsoOrUndefined(formData.buyWindowOpenAt),
            buyWindowCloseAt: toIsoOrUndefined(formData.buyWindowCloseAt),
            squadLockAt: toIsoOrUndefined(formData.squadLockAt)
        }

        const mutationOptions = {
            onSuccess: () => {
                toast.success(isEditing ? 'Match session updated successfully' : 'Match session created successfully')
                onOpenChange(false)
                setFormData(emptyForm)
            },
            onError: (err: Error) => {
                toast.error(err.message || `Failed to ${isEditing ? 'update' : 'create'} match session`)
            }
        }

        if (match) {
            updateMatchMutation.mutate({ matchId: match.id, data: payload }, mutationOptions)
            return
        }

        createMatchMutation.mutate(payload, mutationOptions)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Match Session' : 'Create Match Session'}</DialogTitle>
                    <DialogDescription>Set the game cycle dates, squad purchase window, and squad lock deadline.</DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5">
                    <Field>
                        <FieldLabel htmlFor="title">Session Title</FieldLabel>
                        <Input
                            id="title"
                            placeholder="e.g., Session 1: Monday to Friday"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="startTime">Session Start</FieldLabel>
                            <Input
                                id="startTime"
                                type="datetime-local"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="endTime">Session End</FieldLabel>
                            <Input
                                id="endTime"
                                type="datetime-local"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                required
                            />
                        </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="buyWindowOpenAt">Squad Buy Window Opens</FieldLabel>
                            <Input
                                id="buyWindowOpenAt"
                                type="datetime-local"
                                value={formData.buyWindowOpenAt}
                                onChange={(e) => setFormData({ ...formData, buyWindowOpenAt: e.target.value })}
                            />
                            <FieldDescription>Leave empty to use the session start time.</FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="buyWindowCloseAt">Squad Buy Window Closes</FieldLabel>
                            <Input
                                id="buyWindowCloseAt"
                                type="datetime-local"
                                value={formData.buyWindowCloseAt}
                                onChange={(e) => setFormData({ ...formData, buyWindowCloseAt: e.target.value })}
                            />
                            <FieldDescription>Leave empty to use the session end time.</FieldDescription>
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="squadLockAt">Squad Lock Deadline</FieldLabel>
                        <Input
                            id="squadLockAt"
                            type="datetime-local"
                            value={formData.squadLockAt}
                            onChange={(e) => setFormData({ ...formData, squadLockAt: e.target.value })}
                        />
                        <FieldDescription>After this time, users cannot change their 25-player squad for this cycle.</FieldDescription>
                    </Field>

                    <DialogFooter className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isSaving}
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="w-full sm:w-auto">
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : isEditing ? (
                                'Update Session'
                            ) : (
                                'Create Session'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
