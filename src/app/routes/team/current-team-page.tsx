import { type FC } from 'react'
import { useNavigate, useParams } from 'react-router'

import AppBreadcrumb from '@/components/shared/app-breadcrumb'
import { Button } from '@/components/ui/button'
import { useGetLineup } from '@/features/team/api/get-lineup'
import { FixtureLineupDetails } from '@/features/team/components/fixture-lineup-details'
import { getFixtureLockTime, getTimeState } from '@/features/team-builder/utils/time'

const CurrentTeamPage: FC = () => {
    const { fixtureId } = useParams<{ fixtureId: string }>()
    const navigate = useNavigate()

    const { data: lineupData } = useGetLineup({
        fixtureId: fixtureId || ''
    })

    if (!lineupData?.fixture) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    const lockTime = getFixtureLockTime(lineupData.fixture.startTime, lineupData.fixture.lineupLockAt)
    const timeState = getTimeState(lockTime)

    const playingPlayerCount = lineupData.lineupPlayers?.filter((player) => player.selectionType === 'PLAYING').length ?? 0
    
    const isLineupComplete = playingPlayerCount === 12
    const fixtureLabel = `${lineupData.fixture.teamA} vs ${lineupData.fixture.teamB}`

    const action = timeState.isLocked ? (
        <div className="max-w-sm rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-center">
            <p className="text-sm font-bold text-primary">Lineups are locked</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">Please wait for the scores to reveal.</p>
        </div>
    ) : isLineupComplete ? (
        <Button
            onClick={() => navigate('build')}
            variant="outline"
            size="sm">
            Edit Lineup
        </Button>
    ) : (
        <Button onClick={() => navigate('build')}>Build Team</Button>
    )

    return (
        <div className="min-h-screen w-full bg-background">
            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-6 pb-12 sm:px-6 lg:px-8">
                <AppBreadcrumb
                    items={[
                        { label: 'Matches', to: '/matches' },
                        { label: fixtureLabel }
                    ]}
                />
                <h2 className="pb-1 text-center text-2xl font-bold uppercase tracking-tight">Current Match</h2>

                <FixtureLineupDetails
                    lineupResponse={lineupData}
                    description={`Your selected lineup for the ${lineupData.fixture.teamA} vs ${lineupData.fixture.teamB} clash. Includes Captain, Vice-Captain, and Impact Player.`}
                    action={action}
                    emptyStateDescription={`Set your playing XII for the ${lineupData.fixture.teamA} vs ${lineupData.fixture.teamB} fixture to see it here.`}
                />
            </main>
        </div>
    )
}

export default CurrentTeamPage
