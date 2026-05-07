import { type FC } from 'react'
import { useNavigate, useParams } from 'react-router'

import Header from '@/components/shared/header'
import { Button } from '@/components/ui/button'
import { useGetLineup } from '@/features/team/api/get-lineup'
import { FixtureLineupDetails } from '@/features/team/components/fixture-lineup-details'

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

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1 w-full pt-24 pb-12 px-4 lg:px-8 max-w-7xl mx-auto flex flex-col space-y-8">
                <h2 className="text-2xl font-bold text-center pb-2 uppercase tracking-tight">Current Match</h2>

                <FixtureLineupDetails
                    lineupResponse={lineupData}
                    description={`Your selected lineup for the ${lineupData.fixture.teamA} vs ${lineupData.fixture.teamB} clash. Includes Captain, Vice-Captain, and Impact Player.`}
                    action={
                        lineupData.lineupPlayers?.filter((player) => player.selectionType === 'PLAYING').length === 12 ? (
                            <Button
                                onClick={() => navigate('build')}
                                variant="outline"
                                size="sm">
                                Edit Lineup
                            </Button>
                        ) : (
                            <Button onClick={() => navigate('build')}>Build Team</Button>
                        )
                    }
                    emptyStateDescription={`Set your playing XII for the ${lineupData.fixture.teamA} vs ${lineupData.fixture.teamB} fixture to see it here.`}
                />
            </main>
        </div>
    )
}

export default CurrentTeamPage
