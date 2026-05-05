import { useState, type FC, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { REWARDS } from '../../constants/franchise-constants'

interface FranchiseInformationProps {
    children: ReactNode
}

const FranchiseInformation: FC<FranchiseInformationProps> = ({ children }) => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>How It Works</DialogTitle>
                    <DialogDescription>
                        Build your franchise by picking 25 players, balancing your squad, and then competing weekly to earn points and rewards.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-4">
                    {REWARDS.map((reward, idx) => (
                        <div
                            key={idx + reward.title}
                            className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/40 p-4">
                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                                <reward.icon size={18} />
                            </div>
                            <div className="min-w-0 space-y-1">
                                <h3 className="text-sm font-semibold text-foreground">{reward.title}</h3>
                                <p className="text-sm leading-5 text-muted-foreground">{reward.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button
                        variant={'default'}
                        onClick={() => setOpen(false)}
                        className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md px-6 font-medium text-neutral-200">
                        <span>Close</span>
                        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                            <div className="relative h-full w-8 bg-white/20"></div>
                        </div>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default FranchiseInformation
