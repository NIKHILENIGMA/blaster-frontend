import { Activity, Calendar, Eye, Users, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useFixtures } from '@/features/admin/api/fixtures'
import { useMatches } from '@/features/admin/api/matches'
import { ScoreProcessingCard } from '@/features/admin/components/score-processing-card'

export default function DashboardPage() {
    const navigate = useNavigate()
    const { data: fixtures } = useFixtures()
    const { data: matches } = useMatches()

    const stats = [
        {
            title: 'Game Cycles',
            value: matches?.length || '0',
            icon: Activity,
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'IPL Fixtures',
            value: fixtures?.length || '0',
            icon: Calendar,
            color: 'from-green-500 to-green-600'
        },
        {
            title: 'Completed',
            value: fixtures?.filter(f => f.matchStatus === 'completed')?.length || '0',
            icon: Trophy,
            color: 'from-orange-500 to-orange-600'
        },
        {
            title: 'Processed',
            value: fixtures?.filter(f => f.isProcessed)?.length || '0',
            icon: Users,
            color: 'from-purple-500 to-purple-600'
        }
    ]

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Page header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Manage match results and scoring engine</p>
                </div>
                <Button
                    type="button"
                    className="w-full sm:w-auto"
                    onClick={() => navigate('/admin/points-preview')}>
                    <Eye className="mr-2 h-4 w-4" />
                    Points preview
                </Button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground font-medium mb-1">{stat.title}</p>
                                        <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                                    </div>
                                    <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-3 text-white flex-shrink-0`}>
                                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Scoring Engine Section */}
                <div className="lg:col-span-2">
                    <ScoreProcessingCard />
                </div>

                {/* Recent activity card */}
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Match Status Tips</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 text-sm">
                                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                <p className="text-muted-foreground">
                                    Only fixtures marked as <strong>Completed</strong> can be processed by the scoring engine.
                                </p>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                                <p className="text-muted-foreground">
                                    Enter the <strong>Cricbuzz Match ID</strong> (found in the match URL) to fetch real-world stats.
                                </p>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <div className="h-2 w-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                                <p className="text-muted-foreground">
                                    Always <strong>Preview</strong> the calculated points before publishing to ensure accuracy.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
