import type { FC } from 'react'

import { Loader } from '@/components'
// import { CountdownBanner } from '@/features/franchise/components/banner/countdown-banner'
import { MobileActionBar } from '@/features/franchise/components/mobile/mobile-action-bar'
import { MobileDrawer } from '@/features/franchise/components/mobile/mobile-drawer'
import { PlayerSidebar } from '@/features/franchise/components/sidebar/player-sidebar'
import { CategorySection } from '@/features/franchise/create/category-section'
// import { StickyHeader } from '@/features/franchise/create/sticky-header'
import { useBuildFranchise } from '@/features/franchise/hook/use-build-franchise'

const BuildFranchisePage: FC = () => {
    const {
        isDrawerOpen,
        setIsDrawerOpen,
        playersData,
        isPlayersLoading,
        budgetRemaining,
        selectedPlayers,
        saveStatus,
        lastSavedAt,
        handleAddPlayer,
        handleRemovePlayer,
        handleSubmit,
        ...filteredPlayers
    } = useBuildFranchise()

    if (isPlayersLoading) {
        return (
            <Loader
                size="xl"
                color="border-primary"
            />
        )
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <div className="flex-1">
                <div className="flex flex-1 overflow-hidden">
                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-scroll lg:max-h-[90vh]">
                        <h2 className="pb-1 text-center text-2xl font-bold uppercase tracking-tight py-4">Your Franchise</h2>
                        <div className="mx-auto max-w-7xl px-4 py-8">
                            <CategorySection
                                title="Batsmen"
                                role="Batsman"
                                players={filteredPlayers.batsmen}
                                onAddPlayer={handleAddPlayer}
                                onRemovePlayer={handleRemovePlayer}
                                selectedPlayers={selectedPlayers}
                                showRemoveBtn={true}
                            />

                            <CategorySection
                                title="All-Rounders"
                                role="All-Rounder"
                                players={filteredPlayers.allRounders}
                                onAddPlayer={handleAddPlayer}
                                onRemovePlayer={handleRemovePlayer}
                                selectedPlayers={selectedPlayers}
                                showRemoveBtn={true}
                            />

                            <CategorySection
                                title="Wicket-Keepers"
                                role="Wicket-Keeper"
                                players={filteredPlayers.wicketKeepers}
                                onAddPlayer={handleAddPlayer}
                                onRemovePlayer={handleRemovePlayer}
                                selectedPlayers={selectedPlayers}
                                showRemoveBtn={true}
                            />

                            <CategorySection
                                title="Bowlers"
                                role="Bowler"
                                players={filteredPlayers.bowlers}
                                onAddPlayer={handleAddPlayer}
                                onRemovePlayer={handleRemovePlayer}
                                selectedPlayers={selectedPlayers}
                                showRemoveBtn={true}
                            />
                        </div>
                    </main>

                    {/* Desktop Sidebar */}
                    <aside className="hidden w-[30%] flex-shrink-0 md:flex md:flex-col">
                        <PlayerSidebar
                            allPlayers={playersData || []}
                            onAddPlayer={handleAddPlayer}
                            onRemovePlayer={handleRemovePlayer}
                            selectedPlayers={selectedPlayers}
                            onSubmit={handleSubmit}
                            isSubmitDisabled={selectedPlayers.size !== 25}
                            budgetRemaining={budgetRemaining}
                            selectedCount={selectedPlayers.size}
                        />
                    </aside>
                </div>

                {/* Mobile Action Bar and Drawer */}
                <MobileActionBar
                    onOpenDrawer={() => setIsDrawerOpen(true)}
                    selectedCount={selectedPlayers.size}
                />

                <MobileDrawer
                    isOpen={isDrawerOpen}
                    onOpenChange={setIsDrawerOpen}
                    allPlayers={playersData || []}
                    onAddPlayer={handleAddPlayer}
                    onRemovePlayer={handleRemovePlayer}
                    selectedPlayers={selectedPlayers}
                    onSubmit={handleSubmit}
                    isSubmitDisabled={selectedPlayers.size !== 25}
                    budgetRemaining={budgetRemaining}
                    selectedCount={selectedPlayers.size}
                />
            </div>
        </div>
    )
}

export default BuildFranchisePage
