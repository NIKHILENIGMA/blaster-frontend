import { useState } from 'react'

import Footer from '@/components/shared/footer'
import Header from '@/components/shared/header'
import { useGetFranchiseOverview, useGetUpcomingFixtures } from '@/features/team-builder/api/franchise'
import { CreateFranchiseDialog } from '@/features/team-builder/components/create-franchise-dialog'
import CreateTeam from '@/features/team-builder/components/create-team'
import MyTeam from '@/features/team-builder/components/my-team'

const MySquad = () => {
    const { data: franchiseOverview, isPending: isFranchisePending } = useGetFranchiseOverview({})
    const { data: upcomingFixtures, isPending: isFixturesPending } = useGetUpcomingFixtures({})
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    const isPending = isFranchisePending || isFixturesPending
    const hasFranchise = Boolean(franchiseOverview?.franchise)
    const hasSquad = Boolean(franchiseOverview?.rosterCycle?.length)
    const nextFixture = upcomingFixtures?.fixtures?.find((fixture) => !fixture.isProcessed) ?? null

    const handleCreateAction = () => {
        if (!hasFranchise) {
            setIsCreateDialogOpen(true)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-background">
            <Header />
            {isPending ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading franchise squad...</p>
                </div>
            ) : hasFranchise && hasSquad && franchiseOverview ? (
                <MyTeam
                    overview={franchiseOverview}
                    nextFixture={nextFixture}
                />
            ) : (
                <>
                    <CreateTeam
                        title={hasFranchise ? 'Build Your Active Cycle Squad' : 'Create Your Dream Franchise'}
                        description={
                            hasFranchise
                                ? 'Your franchise identity is ready, but the active cycle still needs a 25-player squad before you can manage daily lineups.'
                                : 'Create your franchise identity and build a 25-player roster for the active cycle.'
                        }
                        buttonLabel={hasFranchise ? 'Build 25-Player Squad' : 'Create Franchise'}
                        actionPath={hasFranchise ? '/my-squad/create' : undefined}
                        onActionClick={hasFranchise ? undefined : handleCreateAction}
                    />
                    {!hasFranchise && (
                        <CreateFranchiseDialog
                            open={isCreateDialogOpen}
                            onOpenChange={setIsCreateDialogOpen}
                        />
                    )}
                </>
            )}
            <Footer />
        </div>
    )
}

export default MySquad
