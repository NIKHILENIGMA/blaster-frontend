import { ChartNoAxesColumn, CircleUser, LayoutDashboard, Swords, Users } from 'lucide-react'
import type { ComponentType, FC, ReactNode } from 'react'
import { NavLink } from 'react-router'

interface NavItem {
    to: string
    icon: ComponentType<React.SVGProps<SVGSVGElement>>
    label: string
}

const NAV_LINKS: NavItem[] = [
    {
        to: '/dashboard',
        icon: LayoutDashboard,
        label: 'Dashboard'
    },
    {
        to: '/leaderboard',
        icon: ChartNoAxesColumn,
        label: 'Leaderboard'
    },
    {
        to: '/franchise',
        icon: Users,
        label: 'Franchise'
    },
    {
        to: '/matches',
        icon: Swords,
        label: 'Matches'
    },
    {
        to: '/profile',
        icon: CircleUser,
        label: 'Profile'
    }
]

interface MobileSidebarProps {
    children: ReactNode
}

const MobileSidebar: FC<MobileSidebarProps> = ({ children }) => {
    return (
        <>
            <span className="sr-only">{children}</span>
            <nav
                aria-label="Primary mobile navigation"
                className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-border/70 bg-white/95 px-2 py-2 shadow-2xl shadow-black/20 backdrop-blur-md lg:hidden">
                <ul className="grid grid-cols-5 items-end gap-1">
                    {NAV_LINKS.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                end={link.to === '/dashboard'}
                                className={({ isActive }) =>
                                    [
                                        'flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold transition-colors',
                                        isActive ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    ].join(' ')
                                }>
                                <link.icon className="h-5 w-5 shrink-0" />
                                <span className="max-w-full truncate leading-none">{link.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    )
}

export default MobileSidebar
