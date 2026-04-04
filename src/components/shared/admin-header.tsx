import { Menu, Search, Bell, LogOut } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { cn } from '@/shared/lib/utils'

interface HeaderProps {
    sidebarOpen: boolean
    onSidebarToggle: () => void
}

export function AdminHeader({ sidebarOpen = true, onSidebarToggle }: HeaderProps) {
    return (
        <header className={cn('border-b border-border bg-card', sidebarOpen ? 'lg:pl-64' : '')}>
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                {/* Left side - Menu button and search */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Mobile menu button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onSidebarToggle}
                        className="lg:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Search bar - hidden on mobile, visible on tablet and up */}
                    <div className="hidden sm:flex items-center gap-2 flex-1 max-w-sm">
                        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <Input
                            placeholder="Search..."
                            className="h-9 border-0 bg-accent/50 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
                        />
                    </div>
                </div>

                {/* Right side - Notifications and profile */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Notifications - hidden on small mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden sm:flex relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                    </Button>

                    {/* Profile dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src="https://avatar.vercel.sh/admin"
                                        alt="Admin"
                                    />
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-48">
                            <DropdownMenuLabel className="font-medium">Admin User</DropdownMenuLabel>
                            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">admin@example.com</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                            <DropdownMenuItem>Preferences</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Mobile search - visible only on small screens */}
            <div className="flex sm:hidden px-4 pb-4">
                <div className="flex items-center gap-2 w-full flex-1 bg-accent/50 rounded-lg px-3 py-2">
                    <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <input
                        placeholder="Search..."
                        className="h-6 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                </div>
            </div>
        </header>
    )
}
