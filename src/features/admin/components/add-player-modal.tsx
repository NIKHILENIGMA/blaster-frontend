import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AddPlayerModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAdd: (player: unknown) => void
}

const teams = [
    'Mumbai Indians',
    'Chennai Super Kings',
    'Rajasthan Royals',
    'Delhi Capitals',
    'Kolkata Knight Riders',
    'Punjab Kings',
    'Sunrisers Hyderabad',
    'Royal Challengers Bangalore'
]

export function AddPlayerModal({ open, onOpenChange, onAdd }: AddPlayerModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        team: '',
        runs: '',
        wickets: '',
        catches: '',
        fantasyPoints: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAdd({
            name: formData.name,
            team: formData.team,
            runs: parseInt(formData.runs) || 0,
            wickets: parseInt(formData.wickets) || 0,
            catches: parseInt(formData.catches) || 0,
            fantasyPoints: parseInt(formData.fantasyPoints) || 0
        })
        setFormData({ name: '', team: '', runs: '', wickets: '', catches: '', fantasyPoints: '' })
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Player</DialogTitle>
                    <DialogDescription>Add a new player and their statistics</DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4">
                    <Field>
                        <FieldLabel htmlFor="name">Player Name</FieldLabel>
                        <Input
                            id="name"
                            placeholder="e.g., Virat Kohli"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="team">Team</FieldLabel>
                        <Select
                            value={formData.team}
                            onValueChange={(value) => setFormData({ ...formData, team: value })}>
                            <SelectTrigger id="team">
                                <SelectValue placeholder="Select team" />
                            </SelectTrigger>
                            <SelectContent>
                                {teams.map((team) => (
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
                        <FieldLabel htmlFor="runs">Runs</FieldLabel>
                        <Input
                            id="runs"
                            type="number"
                            placeholder="0"
                            value={formData.runs}
                            onChange={(e) => setFormData({ ...formData, runs: e.target.value })}
                            required
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="wickets">Wickets</FieldLabel>
                        <Input
                            id="wickets"
                            type="number"
                            placeholder="0"
                            value={formData.wickets}
                            onChange={(e) => setFormData({ ...formData, wickets: e.target.value })}
                            required
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="catches">Catches</FieldLabel>
                        <Input
                            id="catches"
                            type="number"
                            placeholder="0"
                            value={formData.catches}
                            onChange={(e) => setFormData({ ...formData, catches: e.target.value })}
                            required
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fantasyPoints">Fantasy Points</FieldLabel>
                        <Input
                            id="fantasyPoints"
                            type="number"
                            placeholder="0"
                            value={formData.fantasyPoints}
                            onChange={(e) => setFormData({ ...formData, fantasyPoints: e.target.value })}
                            required
                        />
                    </Field>

                    <DialogFooter className="flex gap-2 flex-col-reverse sm:flex-row">
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
                            Add Player
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
