import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import { useCreateMatch } from '../api/matches'

interface CreateMatchModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateMatchModal({ open, onOpenChange }: CreateMatchModalProps) {
    const createMatchMutation = useCreateMatch()
    const [formData, setFormData] = useState({
        title: '',
        startTime: '',
        endTime: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        createMatchMutation.mutate(
            {
                title: formData.title,
                startTime: new Date(formData.startTime).toISOString(),
                endTime: new Date(formData.endTime).toISOString()
            },
            {
                onSuccess: () => {
                    toast.success('Match created successfully')
                    onOpenChange(false)
                    setFormData({ title: '', startTime: '', endTime: '' })
                },
                onError: (err) => {
                    toast.error(err.message || 'Failed to create match')
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
                    <DialogTitle>Create New Match</DialogTitle>
                    <DialogDescription>Add a new match to the system</DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4">
                    <Field>
                        <FieldLabel htmlFor="title">Match Title</FieldLabel>
                        <Input
                            id="title"
                            placeholder="e.g., Mumbai Indians vs Delhi Capitals"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </Field>

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
                        <FieldLabel htmlFor="endTime">End Time</FieldLabel>
                        <Input
                            id="endTime"
                            type="datetime-local"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            required
                        />
                    </Field>

                    <DialogFooter className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={createMatchMutation.isPending}
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createMatchMutation.isPending}
                            className="w-full sm:w-auto">
                            {createMatchMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Match'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
