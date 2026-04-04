import { LayoutDashboard, Activity, Calendar, Users } from 'lucide-react'
import { NavLink } from 'react-router'

import { cn } from '@/shared/lib/utils'

const navItems = [
    { id: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: '/admin/matches', label: 'Matches', icon: Activity },
    { id: '/admin/fixtures', label: 'Fixtures', icon: Calendar },
    { id: '/admin/player-stats', label: 'Player Stats', icon: Users }
]

export function AdminSidebar() {
    return (
        <div className="flex h-full flex-col border-r border-border bg-card">
            {/* Logo */}
            <div className="flex items-center gap-2 border-b border-border px-6 py-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-600">
                    <span className="text-sm font-bold text-white">IPL</span>
                </div>
                <h1 className="text-lg font-bold text-foreground">Admin</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-3 py-6">
                {navItems.map((item) => {
                    const Icon = item.icon

                    return (
                        <NavLink
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
        </div>
    )
}
