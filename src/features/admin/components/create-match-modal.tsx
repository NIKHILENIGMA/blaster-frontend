import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface CreateMatchModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateMatchModal({ open, onOpenChange }: CreateMatchModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        startTime: '',
        endTime: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onOpenChange(false)
        setFormData({ title: '', startTime: '', endTime: '' })
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
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto">
                            Create Match
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
