import { ArrowLeft, Eye, Loader2 } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFixtures } from '@/features/admin/api/fixtures'
import { PointsPreviewContent } from '@/features/admin/components/points-preview-content'

export default function AdminPointsPreviewPage() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const fixtureId = searchParams.get('fixtureId') ?? ''
    const { data: fixtures, isLoading, error } = useFixtures()

    const sortedFixtures = useMemo(
        () =>
            [...(fixtures ?? [])].sort(
                (left, right) =>
                    new Date(right.startTime).getTime() - new Date(left.startTime).getTime()
            ),
        [fixtures]
    )

    const selectedFixture = sortedFixtures.find((fixture) => fixture.id === fixtureId) ?? null

    const handleFixtureChange = (nextFixtureId: string) => {
        const nextParams = new URLSearchParams(searchParams)
        nextParams.set('fixtureId', nextFixtureId)
        setSearchParams(nextParams)
    }

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 sm:p-6">
                <Card>
                    <CardContent className="py-12 text-center text-destructive">
                        Failed to load fixtures for points preview.
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-5 p-4 sm:space-y-6 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        className="h-auto px-0 text-muted-foreground"
                        onClick={() => navigate('/admin')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to dashboard
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Points Preview</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">
                            Review full scoring output, user totals, and player-level breakdown before publishing.
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-[26rem]">
                    <Select
                        value={fixtureId}
                        onValueChange={handleFixtureChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a fixture to preview" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortedFixtures.map((fixture) => (
                                <SelectItem
                                    key={fixture.id}
                                    value={fixture.id}>
                                    {fixture.teamA} vs {fixture.teamB} ({fixture.id})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {!fixtureId || !selectedFixture ? (
                <Card>
                    <CardContent className="py-14 text-center">
                        <Eye className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                        <p className="text-lg font-semibold">Choose a fixture</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Select a completed fixture from the dropdown to inspect the full scoring preview.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <PointsPreviewContent
                    fixtureId={fixtureId}
                    fixtureName={`${selectedFixture.teamA} vs ${selectedFixture.teamB}`}
                />
            )}
        </div>
    )
}
