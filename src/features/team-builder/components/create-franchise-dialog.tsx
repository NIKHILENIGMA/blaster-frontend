import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useCreateFranchise } from '../api/franchise'

const LOGO_OPTIONS = [
    '/fortune-logo.png',
    '/fortune-logo-2.png',
    '/brand-logo.png',
    '/dummylogo.jpg'
]

interface CreateFranchiseDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const CreateFranchiseDialog: React.FC<CreateFranchiseDialogProps> = ({
    open,
    onOpenChange
}) => {
    const navigate = useNavigate()
    const { mutateAsync: createFranchise, isPending } = useCreateFranchise()

    const [teamName, setTeamName] = useState('')
    const [teamLogo, setTeamLogo] = useState(LOGO_OPTIONS[0])

    const handleCreate = async () => {
        if (!teamName.trim()) {
            toast.error('Please enter a team name')
            return
        }

        if (teamName.trim().length < 3) {
            toast.error('Team name must be at least 3 characters long')
            return
        }

        try {
            await createFranchise({
                teamName: teamName.trim(),
                teamLogo
            })
            toast.success('Franchise created successfully!')
            onOpenChange(false)
            navigate('/my-squad/create')
        } catch {
            toast.error('Failed to create franchise. Please try again.')
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Your Franchise</DialogTitle>
                    <DialogDescription>
                        Give your franchise a unique identity. You can change this later.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Franchise Name</Label>
                        <Input
                            id="name"
                            placeholder="Titans Blaster"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            disabled={isPending}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Select Logo</Label>
                        <div className="flex flex-wrap gap-3">
                            {LOGO_OPTIONS.map((logo) => (
                                <button
                                    key={logo}
                                    type="button"
                                    onClick={() => setTeamLogo(logo)}
                                    className={`rounded-xl border p-1 transition-all ${
                                        teamLogo === logo
                                            ? 'border-primary ring-2 ring-primary/20'
                                            : 'border-border grayscale hover:grayscale-0'
                                    }`}
                                    disabled={isPending}
                                >
                                    <img
                                        src={logo}
                                        alt="Team logo option"
                                        className="h-12 w-12 rounded-lg object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreate} disabled={isPending} className="w-full">
                        {isPending ? 'Creating...' : 'Create & Build Squad'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
