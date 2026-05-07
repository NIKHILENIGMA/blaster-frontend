import { useUser } from '@clerk/clerk-react'
import { ChartNoAxesColumn, LayoutDashboard, Users } from 'lucide-react'
import type { FC } from 'react'
import { IoAnalyticsOutline } from 'react-icons/io5'
import { Link, NavLink } from 'react-router'

interface NavItem {
    to: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    label: string
}

const NAV_LINKS: NavItem[] = [
    {
        to: '/admin',
        icon: LayoutDashboard,
        label: 'Admin Dashboard'
    },
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
        icon: Users,
        label: 'Matches'
    },
    {
        to: '/analytics',
        icon: IoAnalyticsOutline,
        label: 'Analytics'
    }
]

const Sidebar: FC = () => {
    const { user } = useUser()
    const isAdmin = user?.publicMetadata?.role === 'admin'
    return (
        <aside className="hidden border-r-1 lg:w-[10%] h-screen bg-white sticky top-0 py-4 md:flex flex-col items-center justify-between z-50">
            <Link to="/">
                <img
                    src="https://res.cloudinary.com/dynbvnhcc/image/upload/v1775299513/logo-fortune_qda5xe.png"
                    alt="logo"
                    className="h-20 w-20 object-cover"
                />
            </Link>
            <nav className="mt-10 flex flex-col items-center space-y-4 h-[80%] w-full px-2">
                {NAV_LINKS.map((link: NavItem, idx: number) =>
                    isAdmin || link.to !== '/admin' ? (
                        <NavLink
                            key={link.to + idx}
                            to={link.to}
                            end={link.to === '/dashboard'}
                            className={({ isActive }: { isActive: boolean }) =>
                                `${isActive ? 'text-primary shadow-lg bg-white rounded-sm' : 'text-foreground/80'} w-full p-3 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer flex items-center gap-3 justify-start text-start`
                            }>
                            {link.icon && <link.icon className="h-5 w-5 shrink-0" />}
                            <span className="leading-none">{link.label}</span>
                        </NavLink>
                    ) : null
                )}
            </nav>
        </aside>
    )
}

export default Sidebar
