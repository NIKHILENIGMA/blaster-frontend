import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface MobileActionBarProps {
    onOpenDrawer: () => void
    selectedCount: number
}

export function MobileActionBar({ onOpenDrawer, selectedCount }: MobileActionBarProps) {
    return (
        <div className="fixed inset-x-4 bottom-24 z-40 rounded-2xl border border-border/70 bg-card/95 p-3 shadow-xl shadow-black/15 backdrop-blur-md md:hidden">
            <Button
                variant="default"
                size="lg"
                onClick={onOpenDrawer}
                className="w-full">
                <Plus className="mr-2" />
                {selectedCount > 0 ? 'Edit Squad' : 'Build Your Squad'}
            </Button>
        </div>
    )
}
