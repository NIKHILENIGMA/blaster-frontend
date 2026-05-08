import { useStats } from '@/features/dashboard/api/get-stats'
import { useTableTopper } from '@/features/dashboard/api/get-table-topper'
import StatsSection from '@/features/dashboard/components/stats-section'

export default function Dashboard() {
    const { data: stats, isPending: isStatsPending } = useStats({})
    const { data: tableTopper, isPending: isTableTopperPending } = useTableTopper({})

    return (
        <div className="min-h-screen bg-neutral-background text-foreground">
            {/* Main Content */}
            <main className="w-full">
                {/* Hero Carousel Section */}
                {/* <section className=" pb-8">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-6">
                        <HeroCarousel />
                    </div>
                </section> */}
                {/* Stats Section */}
                <StatsSection
                    stats={stats}
                    isPending={isStatsPending}
                    leaderboardEntries={tableTopper}
                    isLeaderboardPending={isTableTopperPending}
                />
            </main>
        </div>
    )
}
