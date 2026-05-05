import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface MobileActionBarProps {
    onOpenDrawer: () => void
    selectedCount: number
}

export function MobileActionBar({ onOpenDrawer, selectedCount }: MobileActionBarProps) {
    return (
        <div className="fixed bottom-0 w-full border-t border-border bg-card p-4 md:hidden z-50">
            <Button
                onClick={onOpenDrawer}
                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-5 w-5" />
                Add Players ({selectedCount}/25)
            </Button>
        </div>
    )
}
