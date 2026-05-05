interface StickyHeaderProps {
    budgetRemaining: number
    selectedCount: number
}

export function StickyHeader({ budgetRemaining, selectedCount }: StickyHeaderProps) {
    return (
        <div className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <div className="flex gap-8">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs font-medium text-muted-foreground">Budget Remaining</p>
                        <p className="text-xl font-bold text-primary">{budgetRemaining.toLocaleString()} Points</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-xs font-medium text-muted-foreground">Squad Size</p>
                        <p className="text-xl font-bold text-foreground">{selectedCount}/25</p>
                    </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                    <p>Cricket Fantasy League</p>
                    <p>Team Builder</p>
                </div>
            </div>
        </div>
    )
}
