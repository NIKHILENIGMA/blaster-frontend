import { type FC } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'

type BreakdownSection = Record<string, number>

interface PlayerBreakdown {
    batting?: BreakdownSection
    bowling?: BreakdownSection
    fielding?: BreakdownSection
}

interface PointBreakdownDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    player: {
        name: string
        basePoints?: number | null
        multiplier?: number | null
        finalPoints?: number | null
        breakdown?: PlayerBreakdown | null
    } | null
}

const PointBreakdownDialog: FC<PointBreakdownDialogProps> = ({ open, onOpenChange, player }) => {
    if (!player) return null

    const breakdown = player.breakdown || {}
    const getOrderedEntries = (section?: BreakdownSection) => {
        if (!section) return [] as Array<[string, number]>

        return Object.entries(section).sort(([a], [b]) => {
            if (a === 'total') return 1
            if (b === 'total') return -1
            return 0
        })
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] sm:max-w-[520px] p-4 sm:p-6 max-h-[90vh] overflow-hidden">
                <DialogHeader className="flex flex-row items-start justify-between gap-3">
                    <DialogTitle className="text-base sm:text-xl font-bold leading-tight break-words pr-2">
                        {player.name} - Points Breakdown
                    </DialogTitle>
                    <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogHeader>

                <div className="space-y-5 py-3 sm:py-4 overflow-y-auto pr-1 max-h-[calc(90vh-5.5rem)]">
                    {/* Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-muted p-3 sm:p-4 rounded-lg">
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground uppercase font-bold">Base Points</p>
                            <p className="text-xl sm:text-2xl font-black">{player.basePoints || 0}</p>
                        </div>
                        <div className="text-center border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0">
                            <p className="text-xs text-muted-foreground uppercase font-bold">Total (x{player.multiplier || 1})</p>
                            <p className="text-xl sm:text-2xl font-black text-primary">{player.finalPoints || 0}</p>
                        </div>
                    </div>

                    {/* Breakdown Sections */}
                    <div className="space-y-4">
                        {/* Batting */}
                        {breakdown.batting && Object.keys(breakdown.batting).length > 0 && (
                            <div>
                                <h4 className="text-xs sm:text-sm font-bold border-b pb-1 mb-2 uppercase tracking-wider text-primary">Batting</h4>
                                <div className="space-y-1">
                                    {getOrderedEntries(breakdown.batting).map(([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex items-start justify-between gap-3 text-xs sm:text-sm">
                                            <span className="capitalize break-words">{key.replace(/([A-Z])/g, ' $1')}</span>
                                            <span className="font-medium shrink-0">+{value as number}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bowling */}
                        {breakdown.bowling && Object.keys(breakdown.bowling).length > 0 && (
                            <div>
                                <h4 className="text-xs sm:text-sm font-bold border-b pb-1 mb-2 uppercase tracking-wider text-primary">Bowling</h4>
                                <div className="space-y-1">
                                    {getOrderedEntries(breakdown.bowling).map(([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex items-start justify-between gap-3 text-xs sm:text-sm">
                                            <span className="capitalize break-words">{key.replace(/([A-Z])/g, ' $1')}</span>
                                            <span className="font-medium shrink-0">+{value as number}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Fielding */}
                        {breakdown.fielding && Object.keys(breakdown.fielding).length > 0 && (
                            <div>
                                <h4 className="text-xs sm:text-sm font-bold border-b pb-1 mb-2 uppercase tracking-wider text-primary">Fielding</h4>
                                <div className="space-y-1">
                                    {getOrderedEntries(breakdown.fielding).map(([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex items-start justify-between gap-3 text-xs sm:text-sm">
                                            <span className="capitalize break-words">{key.replace(/([A-Z])/g, ' $1')}</span>
                                            <span className="font-medium shrink-0">+{value as number}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PointBreakdownDialog
