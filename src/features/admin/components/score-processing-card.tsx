import { Calculator, Eye, Loader2, Info } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useFixtures, useCalculatePoints } from '../api/fixtures'

import { PointsPreviewModal } from './points-preview-modal'

export function ScoreProcessingCard() {
    const [selectedFixtureId, setSelectedFixtureId] = useState<string>('')
    const [cricbuzzId, setCricbuzzId] = useState<string>('')
    const [previewOpen, setPreviewOpen] = useState(false)

    const { data: fixtures, isLoading: isLoadingFixtures } = useFixtures()
    const calculateMutation = useCalculatePoints()

    // Filter for fixtures that are completed but not yet fully processed/published
    const pendingFixtures = fixtures?.filter(f => f.matchStatus === 'completed' && !f.isProcessed) || []
    const selectedFixture = fixtures?.find(f => f.id === selectedFixtureId)

    const handleCalculate = () => {
        if (!selectedFixtureId || !cricbuzzId) {
            toast.error('Please select a fixture and enter a Cricbuzz Match ID')
            return
        }

        calculateMutation.mutate(
            { fixtureId: selectedFixtureId, cricbuzzMatchId: cricbuzzId },
            {
                onSuccess: () => {
                    toast.success('Points calculated successfully. You can now preview them.')
                },
                onError: (err) => {
                    toast.error(err.message || 'Calculation failed')
                }
            }
        )
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Scoring Engine
                </CardTitle>
                <CardDescription>
                    Process match results and calculate fantasy points.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Select Completed Fixture</label>
                    <Select value={selectedFixtureId} onValueChange={setSelectedFixtureId}>
                        <SelectTrigger>
                            <SelectValue placeholder={isLoadingFixtures ? "Loading..." : "Select a fixture"} />
                        </SelectTrigger>
                        <SelectContent>
                            {pendingFixtures.length === 0 ? (
                                <div className="p-2 text-sm text-muted-foreground text-center">
                                    No pending completed fixtures
                                </div>
                            ) : (pendingFixtures.map(f => (
                                    <SelectItem key={f.id} value={f.id}>
                                        {f.teamA} vs {f.teamB} ({new Date(f.startTime).toLocaleDateString()})
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Cricbuzz Match ID</label>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="e.g. 89654" 
                            value={cricbuzzId} 
                            onChange={(e) => setCricbuzzId(e.target.value)}
                        />
                        <Button 
                            variant="secondary" 
                            size="icon" 
                            type="button"
                            title="The ID found in the Cricbuzz match URL"
                        >
                            <Info className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button 
                        onClick={handleCalculate} 
                        disabled={calculateMutation.isPending || !selectedFixtureId || !cricbuzzId}
                        className="w-full"
                    >
                        {calculateMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Calculator className="mr-2 h-4 w-4" />
                        )}
                        Calculate
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={() => setPreviewOpen(true)}
                        disabled={!selectedFixtureId}
                        className="w-full"
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                    </Button>
                </div>

                {selectedFixture && (
                    <PointsPreviewModal 
                        open={previewOpen}
                        onOpenChange={setPreviewOpen}
                        fixtureId={selectedFixtureId}
                        fixtureName={`${selectedFixture.teamA} vs ${selectedFixture.teamB}`}
                    />
                )}
            </CardContent>
        </Card>
    )
}
