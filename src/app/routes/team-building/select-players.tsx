import { useMemo } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate } from 'react-router'
import { Toaster, toast } from 'sonner'

import Footer from '@/components/shared/footer'
import Header from '@/components/shared/header'
import { Button } from '@/components/ui/button'
import { useGetCurrentRosterCycle, useGetFranchiseOverview, useSaveSquad } from '@/features/team-builder/api/franchise'
import { useGetPlayers } from '@/features/team-builder/api/get-players'
import { TeamBuilder } from '@/features/team-builder/components/team-builder'

export default function SelectPlayers() {
    const navigate = useNavigate()
    const { data: playersData = [] } = useGetPlayers({})
    const { data: franchiseOverview, isPending: isOverviewPending } = useGetFranchiseOverview({})
    const { data: currentCycleData, isPending: isCyclePending } = useGetCurrentRosterCycle({})
    const { mutateAsync: saveSquad, isPending: isSavingSquad } = useSaveSquad()

    const isPending = isOverviewPending || isCyclePending
    const activeMatchId = currentCycleData?.match?.id ?? franchiseOverview?.activeCycle?.id ?? null
    const initialPlayers = useMemo(() => currentCycleData?.players ?? [], [currentCycleData?.players])

    const handleSaveSquad = async (selectedPlayers: typeof playersData) => {
        if (!activeMatchId) {
            toast.error('No active roster cycle is available right now')
            return
        }

        try {
            await saveSquad({
                matchId: activeMatchId,
                payload: {
                    playerIds: selectedPlayers.map((player) => player.id)
                }
            })

            toast.success('Franchise squad saved successfully!')
            navigate('/my-squad')
        } catch {
            toast.error('Failed to save squad. Please try again.')
        }
    }

    return (
        <div className="min-h-screen bg-neutral-background">
            <Header />
            <main className="flex flex-col items-center py-5 relative">
                <Button
                    onClick={() => navigate(-1)}
                    variant="outline"
                    className="hidden md:flex absolute left-4 top-5 md:top-2 shadow-none">
                    <FaArrowLeftLong />
                </Button>

                {isPending ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500">Loading franchise builder...</p>
                    </div>
                ) : (
                    <div className="w-full mx-auto space-y-6">
                        <TeamBuilder
                            players={playersData}
                            initialSelectedPlayers={initialPlayers}
                            selectionLimit={25}
                            budgetTotal={2000}
                            saveLabel={isSavingSquad ? 'Saving...' : 'Save 25-Player Squad'}
                            onSave={handleSaveSquad}
                        />
                    </div>
                )}
            </main>
            <Footer />
            <Toaster />
        </div>
    )
}
