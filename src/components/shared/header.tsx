import { useClerk, useUser } from '@clerk/clerk-react'
import { List, LogOut, Settings } from 'lucide-react'
import { useNavigate } from 'react-router'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import MobileSidebar from './mobile-sidebar'

const Header = () => {
    const { user, isLoaded } = useUser()
    const { signOut } = useClerk()
    const navigate = useNavigate()
    if (!isLoaded) return null

    const handleLogout = async () => {
        if (!isLoaded) return
        await signOut()
        navigate('/')
    }
    return (
        <header className="fixed top-0 bg-white w-full h-20 shadow-sm flex items-center justify-between px-9 z-50">
            <div className="flex items-center gap-4">
                <MobileSidebar>
                    <List className="lg:hidden" />
                </MobileSidebar>

                <h1 className="text-sm font-bold font-body">Welcome back, {user?.firstName}!</h1>
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Avatar>
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback>
                            {user?.firstName?.charAt(0)}
                            {user?.lastName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </PopoverTrigger>
                <PopoverContent
                    align="end"
                    className="w-48 p-0 bg-card">
                    <div className="flex flex-col items-center w-full py-6">
                        {/* User Image */}
                        <div className="mb-3">
                            <img
                                src={user?.imageUrl || '/default-avatar.png'}
                                alt="User Avatar"
                                className="w-16 h-16 rounded-full border-4 border-primary object-cover mx-auto"
                            />
                        </div>
                        {/* Full Name */}
                        <div className="text-center mb-4">
                            <span className="font-semibold text-sm">
                                {user?.firstName} {user?.lastName}
                            </span>
                        </div>
                        {/* Buttons */}
                        <div className="flex flex-col gap-2 w-full px-4">
                            <Button
                                variant="ghost"
                                className="w-full flex justify-start"
                                onClick={() => navigate('/profile')}>
                                <Settings /> Setting
                            </Button>
                            <Button
                                className="w-full justify-start bg-transparent hover:bg-red-600 text-red-400 hover:text-white border border-red-400"
                                onClick={handleLogout}>
                                <LogOut /> Logout
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </header>
    )
}

export default Header
