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

interface CreateFixtureModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateFixtureModal({ open, onOpenChange }: CreateFixtureModalProps) {
    const createFixtureMutation = useCreateFixture()
    const { data: matches } = useMatches()

    const [formData, setFormData] = useState({
        matchId: '',
        teamA: '',
        teamB: '',
        startTime: '',
        cricbuzzMatchId: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        createFixtureMutation.mutate(
            {
                matchId: formData.matchId,
                teamA: formData.teamA,
                teamB: formData.teamB,
                startTime: new Date(formData.startTime).toISOString(),
                cricbuzzMatchId: formData.cricbuzzMatchId
            },
            {
                onSuccess: () => {
                    toast.success('Fixture created successfully')
                    onOpenChange(false)
                    setFormData({ matchId: '', teamA: '', teamB: '', startTime: '', cricbuzzMatchId: '' })
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
                            <Input
                                id="teamA"
                                placeholder="e.g., MI"
                                value={formData.teamA}
                                onChange={(e) => setFormData({ ...formData, teamA: e.target.value })}
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="teamB">Team B</FieldLabel>
                            <Input
                                id="teamB"
                                placeholder="e.g., DC"
                                value={formData.teamB}
                                onChange={(e) => setFormData({ ...formData, teamB: e.target.value })}
                                required
                            />
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
                        <FieldLabel htmlFor="cricbuzzId">Cricbuzz Match ID</FieldLabel>
                        <Input
                            id="cricbuzzId"
                            placeholder="e.g., 89654"
                            value={formData.cricbuzzMatchId}
                            onChange={(e) => setFormData({ ...formData, cricbuzzMatchId: e.target.value })}
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
