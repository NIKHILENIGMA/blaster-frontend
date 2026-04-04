// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, Calendar, Users, Trophy } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// const chartData = [
//   { name: 'Jan', matches: 4, fixtures: 24 },
//   { name: 'Feb', matches: 3, fixtures: 13 },
//   { name: 'Mar', matches: 2, fixtures: 9 },
//   { name: 'Apr', matches: 5, fixtures: 39 },
//   { name: 'May', matches: 4, fixtures: 22 },
//   { name: 'Jun', matches: 3, fixtures: 29 },
// ]

const stats = [
    {
        title: 'Total Matches',
        value: '24',
        icon: Activity,
        color: 'from-blue-500 to-blue-600'
    },
    {
        title: 'Active Fixtures',
        value: '12',
        icon: Calendar,
        color: 'from-green-500 to-green-600'
    },
    {
        title: 'Total Players',
        value: '248',
        icon: Users,
        color: 'from-purple-500 to-purple-600'
    },
    {
        title: 'Completed',
        value: '18',
        icon: Trophy,
        color: 'from-orange-500 to-orange-600'
    }
]

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Welcome back to the IPL Admin Panel</p>
            </div>

            {/* Stats grid - responsive columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card
                            key={stat.title}
                            className="overflow-hidden hover:shadow-lg transition-shadow">
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

            {/* Charts - responsive layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Main chart - takes full width on mobile */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base sm:text-lg">Activity Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 sm:h-80 w-full">
                            {/* <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="matches" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="fixtures" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer> */}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent activity card */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 text-sm">
                                <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                                <span className="text-muted-foreground truncate">Match {i} updated</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
