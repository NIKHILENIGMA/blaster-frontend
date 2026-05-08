// import { ActionBar } from '@/features/franchise/action-bar'
import { type FC } from 'react'

import ContainLoader from '@/components/loader/contain-loader'
import { useGetFranchiseOverview } from '@/features/franchise/api/get-franchise-overview'
import FranchiseBanner from '@/features/franchise/components/create-franchise/franchise-banner'
import FranchiseSquad from '@/features/franchise/components/create-franchise/franchise-squad'
import NoFranchise from '@/features/franchise/create/no-franchise'

const FranchisePage: FC = () => {
    const { data, isPending } = useGetFranchiseOverview()

    if (isPending) return <ContainLoader />

    // If we don't have data or the franchise is null, it means the user doesn't have a franchise
    if (!data || data.franchise === null) return <NoFranchise />

    // If we have data, we can assume that the franchise is not null
    const { franchise, rosterCycle, activeCycle } = data

    const isSessionLock = activeCycle?.isLocked ?? false

    // If the active cycle is locked, it means the team building window is open
    // const isWindowOpen: boolean = Boolean(activeCycle && activeCycle.isLocked)
    const isRosterAvailable: boolean = Boolean(data.rosterCycle && data.rosterCycle.length > 0)

    return (
        <div className="w-full min-h-screen bg-background">
            {isRosterAvailable ? (
                <FranchiseSquad
                    franchise={franchise}
                    isSessionLock={isSessionLock}
                    selectedPlayers={rosterCycle || []}
                />
            ) : (
                <FranchiseBanner />
            )}
        </div>
    )
}

export default FranchisePage
