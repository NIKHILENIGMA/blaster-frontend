import { Calendar, History } from 'lucide-react'
import { type FC } from 'react'

import Header from '@/components/shared/header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetFixture } from '@/features/team/api/get-fixtures'
import UpcomingMatchCard from '@/features/team/components/card/upcoming-match-card'

const FixturesPage: FC = () => {
    const { data: fixtureData, isPending } = useGetFixture({})

    if (isPending) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg">Loading fixtures...</p>
            </div>
        )
    }

    if (!fixtureData) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg">No fixtures available.</p>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen bg-background">
            {/* Header */}
            <Header />
            <div className=" mx-auto px-12 py-6 mt-20 w-full">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Match Fixtures</h1>
                    <p className="text-gray-600 mt-1">Stay updated with the latest match schedules and results.</p>
                </div>
                <Tabs
                    defaultValue="fixtures"
                    className="w-full">
                    <TabsList>
                        <TabsTrigger value="fixtures">
                            <Calendar />
                        </TabsTrigger>
                        <TabsTrigger value="history">
                            <History />
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent
                        value="fixtures"
                        className="w-full">
                        <h2 className="mt-6 mb-2 text-lg font-semibold">Upcoming Matches</h2>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {fixtureData.fixtures.map((fixture, idx) => (
                                <UpcomingMatchCard
                                    key={fixture.id || idx}
                                    fixtureId={fixture.id}
                                    match={{
                                        // id: match.id,
                                        matchNo: Number(fixture.matchNumber) || idx + 1,
                                        teamA: fixture.teamA,
                                        teamB: fixture.teamB,
                                        teamAGradient: 'from-cyan-500',
                                        teamBGradient: 'to-red-600',
                                        date: String(new Date(fixture.startTime).toLocaleDateString()),
                                        time: String(new Date(fixture.startTime).toLocaleTimeString()),
                                        venue: fixture.venueId || 'TBD'
                                    }}
                                />
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="history">
                        <h2 className="mt-6 mb-2 text-lg font-semibold">Past Matches</h2>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {/* {pastMatches.map((match) => (
                                <PastMatchCard
                                    key={match.id}
                                    match={match}
                                />
                            ))} */}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default FixturesPage
