import { Calendar, History } from 'lucide-react'
import { type FC, useMemo } from 'react'

import Header from '@/components/shared/header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetFixture } from '@/features/team/api/get-fixtures'
import PastMatchCard from '@/features/team/components/card/past-match-card'
import UpcomingMatchCard from '@/features/team/components/card/upcoming-match-card'
import { useNavigate } from 'react-router'

const FixturesPage: FC = () => {
    const navigate = useNavigate()
    const { data: fixtureData, isPending } = useGetFixture({})

    const { upcomingFixtures, pastFixtures } = useMemo(() => {
        if (!fixtureData?.fixtures) return { upcomingFixtures: [], pastFixtures: [] }

        return {
            upcomingFixtures: fixtureData.fixtures.filter(
                (f) => f.matchStatus === 'scheduled' || f.matchStatus === 'live' || !f.matchStatus
            ),
            pastFixtures: fixtureData.fixtures.filter((f) => f.matchStatus === 'completed')
        }
    }, [fixtureData])

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
                            <Calendar className="mr-2 h-4 w-4" />
                            Fixtures
                        </TabsTrigger>
                        <TabsTrigger value="history">
                            <History className="mr-2 h-4 w-4" />
                            History
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent
                        value="fixtures"
                        className="w-full">
                        <h2 className="mt-6 mb-2 text-lg font-semibold">Upcoming Matches</h2>

                        {upcomingFixtures.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                {upcomingFixtures.map((fixture, idx) => (
                                    <UpcomingMatchCard
                                        key={fixture.id || idx}
                                        fixtureId={fixture.id}
                                        match={{
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
                        ) : (
                            <div className="py-12 text-center text-gray-500">No upcoming matches in this cycle.</div>
                        )}
                    </TabsContent>
                    <TabsContent value="history">
                        <h2 className="mt-6 mb-2 text-lg font-semibold">Past Matches</h2>

                        {pastFixtures.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {pastFixtures.map((fixture, idx) => (
                                    <div 
                                        key={fixture.id || idx}
                                        onClick={() => navigate(`/matches/${fixture.id}/summary`)}
                                        className="cursor-pointer"
                                    >
                                        <PastMatchCard
                                            match={{
                                                matchNo: Number(fixture.matchNumber) || idx + 1,
                                                teamA: fixture.teamA,
                                                teamB: fixture.teamB,
                                                scoreA: 0, // Not available in basic fixture data
                                                scoreB: 0, // Not available in basic fixture data
                                                result: fixture.matchResult || 'Completed',
                                                date: String(new Date(fixture.startTime).toLocaleDateString())
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-gray-500">No past matches in this cycle yet.</div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default FixturesPage
