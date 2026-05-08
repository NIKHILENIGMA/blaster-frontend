import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface MobileActionBarProps {
    onOpenDrawer: () => void
    selectedCount: number
}

export function MobileActionBar({ onOpenDrawer, selectedCount }: MobileActionBarProps) {
    return (
        <div className="sticky bottom-0 w-full border-t border-border bg-card p-4 md:hidden z-50">
            <Button
                variant="default"
                size="lg"
                onClick={onOpenDrawer}
                className="w-full max-w-md">
                <Plus className="mr-2" />
                {selectedCount > 0 ? 'Edit Squad' : 'Build Your Squad'}
            </Button>
        </div>
    )
}
