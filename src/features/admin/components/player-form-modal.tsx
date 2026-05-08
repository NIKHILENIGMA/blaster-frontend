import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateAdminPlayer, useUpdateAdminPlayer } from '../api/players'
import type { AdminPlayer } from '../types/players'

const IPL_TEAMS = ['CSK', 'MI', 'RCB', 'KKR', 'SRH', 'DC', 'PBKS', 'RR', 'GT', 'LSG'] as const
const PLAYER_ROLES = ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'] as const

interface PlayerFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    player?: AdminPlayer | null
}

const initialFormState = {
    name: '',
    iplTeam: '' as '' | AdminPlayer['iplTeam'],
    role: '' as '' | AdminPlayer['role'],
    profileImageUrl: '',
    isOverseas: false,
    cost: '',
    cricbuzzPlayerId: ''
}

export function PlayerFormModal({ open, onOpenChange, player }: PlayerFormModalProps) {
    const createPlayerMutation = useCreateAdminPlayer()
    const updatePlayerMutation = useUpdateAdminPlayer()
    const [formData, setFormData] = useState(initialFormState)

    useEffect(() => {
        if (!open) return

        if (player) {
            setFormData({
                name: player.name,
                iplTeam: player.iplTeam,
                role: player.role,
                profileImageUrl: player.profileImageUrl,
                isOverseas: player.isOverseas,
                cost: `${player.cost}`,
                cricbuzzPlayerId: player.cricbuzzPlayerId ?? ''
            })
            return
        }

        setFormData(initialFormState)
    }, [open, player])

    const isPending = createPlayerMutation.isPending || updatePlayerMutation.isPending

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()

        if (!formData.iplTeam || !formData.role) {
            toast.error('Please choose both IPL team and role')
            return
        }

        const payload = {
            name: formData.name.trim(),
            iplTeam: formData.iplTeam,
            role: formData.role,
            profileImageUrl: formData.profileImageUrl.trim(),
            isOverseas: formData.isOverseas,
            cost: Number(formData.cost),
            cricbuzzPlayerId: formData.cricbuzzPlayerId.trim() || null
        }

        const mutationOptions = {
            onSuccess: () => {
                toast.success(player ? 'Player updated successfully' : 'Player created successfully')
                onOpenChange(false)
            },
            onError: (error: Error) => {
                toast.error(error.message || `Failed to ${player ? 'update' : 'create'} player`)
            }
        }

        if (player) {
            updatePlayerMutation.mutate(
                {
                    playerId: player.id,
                    data: payload
                },
                mutationOptions
            )
            return
        }

        createPlayerMutation.mutate(payload, mutationOptions)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{player ? 'Edit Player' : 'Create Player'}</DialogTitle>
                    <DialogDescription>
                        {player ? 'Update player details and sync them across the app.' : 'Add a new player to the central player pool.'}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4">
                    <Field>
                        <FieldLabel htmlFor="playerName">Player Name</FieldLabel>
                        <Input
                            id="playerName"
                            value={formData.name}
                            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                            placeholder="e.g., Virat Kohli"
                            required
                        />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                            <FieldLabel>IPL Team</FieldLabel>
                            <Select
                                value={formData.iplTeam}
                                onValueChange={(value: AdminPlayer['iplTeam']) => setFormData({ ...formData, iplTeam: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select team" />
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
                            <FieldLabel>Role</FieldLabel>
                            <Select
                                value={formData.role}
                                onValueChange={(value: AdminPlayer['role']) => setFormData({ ...formData, role: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PLAYER_ROLES.map((role) => (
                                        <SelectItem
                                            key={role}
                                            value={role}>
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="profileImageUrl">Profile Image URL</FieldLabel>
                        <Input
                            id="profileImageUrl"
                            value={formData.profileImageUrl}
                            onChange={(event) => setFormData({ ...formData, profileImageUrl: event.target.value })}
                            placeholder="https://..."
                            required
                        />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="playerCost">Cost</FieldLabel>
                            <Input
                                id="playerCost"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.cost}
                                onChange={(event) => setFormData({ ...formData, cost: event.target.value })}
                                placeholder="e.g., 120"
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="cricbuzzPlayerId">Cricbuzz Player ID</FieldLabel>
                            <Input
                                id="cricbuzzPlayerId"
                                value={formData.cricbuzzPlayerId}
                                onChange={(event) => setFormData({ ...formData, cricbuzzPlayerId: event.target.value })}
                                placeholder="e.g., 8733"
                            />
                        </Field>
                    </div>

                    <Field>
                        <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-3">
                            <Checkbox
                                id="isOverseas"
                                checked={formData.isOverseas}
                                onCheckedChange={(checked) => setFormData({ ...formData, isOverseas: Boolean(checked) })}
                            />
                            <div>
                                <FieldLabel htmlFor="isOverseas">Overseas Player</FieldLabel>
                                <p className="text-xs text-muted-foreground">Leave unchecked for Indian/domestic players.</p>
                            </div>
                        </div>
                    </Field>

                    <DialogFooter className="flex gap-2 flex-col-reverse sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isPending}
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full sm:w-auto">
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {player ? 'Saving...' : 'Creating...'}
                                </>
                            ) : player ? (
                                'Save Changes'
                            ) : (
                                'Create Player'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
