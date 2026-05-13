import { ShieldCheck, ShieldUser, Store } from 'lucide-react'
import React, { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useCreateFranchise } from '../../api/create-franchise'
import { LOGO_OPTIONS } from '@/shared/lib/team-logos'

interface CreateFranchiseDialogProps {
    children: ReactNode
}

export const CreateFranchiseDialog: React.FC<CreateFranchiseDialogProps> = ({ children }) => {
    const navigate = useNavigate()
    const [open, setOpen] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const { mutateAsync: createFranchise, isPending } = useCreateFranchise()

    const [teamName, setTeamName] = useState('')
    const [teamLogo, setTeamLogo] = useState(LOGO_OPTIONS[0])

    const handleCreate = async () => {
        if (!teamName.trim()) {
            setError('Team name is required')
            return
        }

        if (teamName.trim().length < 3) {
            setError('Team name must be at least 3 characters long')
            return
        }

        try {
            await createFranchise({
                teamName: teamName.trim(),
                teamLogo
            })
            toast.success('Franchise created successfully!')
            setOpen(false)
            navigate('/franchise')
        } catch {
            toast.error('Failed to create franchise. Please try again.')
            setOpen(false)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="text-start">
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                        <span className="bg-primary/10 text-primary rounded-full p-2">
                            <ShieldUser />
                        </span>
                        Create Your Franchise
                    </DialogTitle>
                    <DialogDescription>Give your franchise a unique identity. You can change this later.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label
                            htmlFor="name"
                            className="flex items-center gap-2">
                            <Store size={15} /> Franchise Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="e.g. Titans Blaster"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            onInput={() => setError(error)}
                            onBlur={() => setError(null)}
                            disabled={isPending}
                            className="rounded-[5px]"
                        />
                        {error && <p className="text-xs text-red-500">{error}</p>}
                        <p className="text-xs text-muted-foreground ml-1">
                            Choose a memorable name that represents your franchise's identity and spirit.
                        </p>
                    </div>
                    <div className="grid gap-4">
                        <Label className="flex items-center gap-2">
                            <ShieldCheck size={15} />
                            Select Logo
                        </Label>
                        <div className="flex flex-wrap gap-3">
                            {LOGO_OPTIONS.map((logo: string) => (
                                <button
                                    key={logo}
                                    type="button"
                                    onClick={() => setTeamLogo(logo)}
                                    className={`rounded-md border p-1 transition-all ${
                                        teamLogo === logo ? 'border-primary ring-2 ring-primary/20' : 'border-border grayscale hover:grayscale-0'
                                    }`}
                                    disabled={isPending}>
                                    <img
                                        src={logo}
                                        alt="Team logo option"
                                        className="w-20 object-cover rounded-full"
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground ml-1">
                            Select a logo that best represents your franchise. You can change this later, so pick the one that resonates with your
                            team's spirit!
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleCreate}
                        disabled={isPending}
                        className="w-full">
                        {isPending ? 'Creating...' : 'Create & Build Squad'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
