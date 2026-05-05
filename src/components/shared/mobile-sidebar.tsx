import { ChartNoAxesColumn, LayoutDashboard, Users } from 'lucide-react'
import type { ComponentType, FC, ReactNode } from 'react'
import { IoAnalyticsOutline } from 'react-icons/io5'
import { Link } from 'react-router'

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'

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
        icon: Users,
        label: 'Match Hub'
    },
    {
        to: '/analytics',
        icon: IoAnalyticsOutline,
        label: 'Analytics'
    }
]

interface MobileSidebarProps {
    children: ReactNode
}

const MobileSidebar: FC<MobileSidebarProps> = ({ children }) => {
    return (
        <Drawer direction="left">
            <DrawerTrigger>{children}</DrawerTrigger>
            <DrawerContent className="max-w-[50vw]">
                <DrawerHeader>
                    <DrawerTitle>
                        <img
                            src="./fortune-logo-2.png"
                            alt="Logo"
                            className="w-28 h-auto mx-auto object-cover"
                        />
                    </DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 p-4">
                    <nav className="flex flex-col gap-4 items-center">
                        <ul className="flex flex-col gap-2">
                            {NAV_LINKS.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                                        <link.icon className="w-5 h-5" />
                                        <span>{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default MobileSidebar
