import { LayoutDashboard, Activity, Calendar, Shield, MoveLeft, SlidersHorizontal, Trophy } from 'lucide-react'
import { GiPlayerBase } from 'react-icons/gi'
import { NavLink, useNavigate } from 'react-router'

import { cn } from '@/shared/lib/utils'

import { Button } from '../ui/button'

const navItems = [
    { id: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { id: '/admin/matches', label: 'Game Cycle', icon: Activity },
    { id: '/admin/fixtures', label: 'IPL Fixtures', icon: Calendar },
    { id: '/admin/leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: '/admin/teams', label: 'Teams', icon: Shield },
    { id: '/admin/player-stats', label: 'Player Management', icon: GiPlayerBase },
    { id: '/admin/rulesets', label: 'Rulesets', icon: SlidersHorizontal }
]

export function AdminSidebar() {
    const navigate = useNavigate()
    return (
        <div className="flex h-full flex-col border-r border-border bg-card justify-evenly space-y-2">
            {/* Logo */}
            <div className="flex items-center gap-2 border-b border-border px-6 py-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-600">
                    <span className="text-sm font-bold text-white">IPL</span>
                </div>
                <h1 className="text-lg font-bold text-foreground">Admin</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-3 py-6">
                {navItems.map((item, index) => {
                    const Icon = item.icon

                    return (
                        <NavLink
                            key={index}
                            to={item.id}
                            className={({ isActive }) =>
                                cn(
                                    isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground',
                                    'w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors'
                                )
                            }>
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </NavLink>
                    )
                })}
            </nav>
            {/* Back to Home Button */}
            <div className="px-6 py-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/')}>
                    <MoveLeft /> Back to Home
                </Button>
            </div>
        </div>
    )
}
