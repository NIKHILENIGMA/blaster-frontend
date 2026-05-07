import { Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { usePreviewPoints, usePublishPoints } from '../api/fixtures'

interface PointsPreviewModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    fixtureId: string | null
    fixtureName: string
}

export function PointsPreviewModal({ open, onOpenChange, fixtureId, fixtureName }: PointsPreviewModalProps) {
    const { data: preview, isLoading, error } = usePreviewPoints(fixtureId)
    const publishMutation = usePublishPoints()

    const handlePublish = () => {
        if (!fixtureId) return

        publishMutation.mutate(fixtureId, {
            onSuccess: () => {
                toast.success('Points published successfully!')
                onOpenChange(false)
            },
            onError: (err) => {
                toast.error(err.message || 'Failed to publish points')
            }
        })
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Points Preview: {fixtureName}</DialogTitle>
                    <DialogDescription>Review the calculated fantasy points for all user squads before publishing.</DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-auto py-4">
                    {isLoading ? (
                        <div className="flex h-40 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="p-4 text-center text-destructive">Failed to load preview. Please calculate points first.</div>
                    ) : !preview?.entries || preview.entries.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">No user squads found for this fixture.</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>User ID (Cycle)</TableHead>
                                    <TableHead className="text-right">Total Points</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {preview.entries.map((entry, index) => (
                                    <TableRow key={entry.fixtureUserPointsId}>
                                        <TableCell className="font-medium">#{index + 1}</TableCell>
                                        <TableCell className="text-xs font-mono">{entry.rosterCycleId.split('-')[0]}...</TableCell>
                                        <TableCell className="text-right font-bold text-blue-600">{entry.totalPoints}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

                <DialogFooter className="flex gap-2 border-t pt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePublish}
                        disabled={!preview || preview.entries.length === 0 || publishMutation.isPending || preview.isProcessed}
                        className="gap-2">
                        {publishMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        {preview?.isProcessed ? 'Already Published' : 'Publish Points'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
