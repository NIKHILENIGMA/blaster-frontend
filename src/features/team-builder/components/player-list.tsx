import { Plus, Search } from 'lucide-react'
import { BiSolidCricketBall } from 'react-icons/bi'
import { FaHandsHoldingCircle } from 'react-icons/fa6'
import { MdOutlineSportsHandball } from 'react-icons/md'
import { MdSportsCricket } from 'react-icons/md'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { Player } from '../types/players'

interface PlayerListProps {
    players: Player[]
    selectedCount: number
    searchTerm: string
    onSearchChange: (value: string) => void
    filterTeam: string
    onFilterTeamChange: (value: string) => void
    filterRole: string
    onFilterRoleChange: (value: string) => void
    filterOverseas: boolean
    onFilterOverseasChange: (value: boolean) => void
    filterIndiansOnly: boolean
    onFilterIndiansOnlyChange: (value: boolean) => void
    onAddPlayer: (player: Player) => void
    canAddMore: boolean
}

const IPL_TEAMS = [
    {
        id: 'MI',
        icon: 'https://static.vecteezy.com/system/resources/previews/059/494/375/non_2x/mumbai-indians-original-ipl-team-official-logo-premium-design-for-digital-download-free-vector.jpg',
        value: 'MI',
        label: 'Mumbai Indians'
    },
    {
        id: 'CSK',
        icon: 'https://cdn.vectorstock.com/i/1000v/55/49/chennai-super-kings-original-ipl-team-official-vector-56095549.jpg',
        value: 'CSK',
        label: 'Chennai Super Kings'
    },
    {
        id: 'RCB',
        icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrLdnD5UP22d8Zzzki9WxcxrF8xTjcoUQLuA&s',
        value: 'RCB',
        label: 'Royal Challengers Bangalore'
    },
    {
        id: 'KKR',
        icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnxX0CbLZRSx5Bds9NRiMzVERcUc6reslLKw&s',
        value: 'KKR',
        label: 'Kolkata Knight Riders'
    },
    {
        id: 'DC',
        icon: 'https://cdn.vectorstock.com/i/1000v/55/51/delhi-capitals-original-ipl-team-official-logo-vector-56095551.jpg',
        value: 'DC',
        label: 'Delhi Capitals'
    },
    {
        id: 'RR',
        icon: 'https://static.vecteezy.com/system/resources/previews/059/494/376/non_2x/rajasthan-royals-original-ipl-team-official-logo-premium-design-for-digital-download-free-vector.jpg',
        value: 'RR',
        label: 'Rajasthan Royals'
    },
    {
        id: 'PBKS',
        icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcSy0BYsizL1g0v18HJVENprnTxsKYF_x4fQ&s',
        value: 'PBKS',
        label: 'Punjab Kings'
    },
    {
        id: 'GT',
        icon: 'https://www.fomostore.in/cdn/shop/files/Fomo_Store-Stickers-Sports-Gujarat_Titans_Logo-Image-1_fe87d827-f450-4fce-a28c-0a8a51b77982.jpg?v=1743854555&width=1920',
        value: 'GT',
        label: 'Gujarat Titans'
    },
    {
        id: 'LSG',
        icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu-wxn4bs7tsVvJE_G-DQNKY-kkyD-iwn9kw&s',
        value: 'LSG',
        label: 'Lucknow Super Giants'
    },
    {
        id: 'SRH',
        icon: 'https://cdn.vectorstock.com/i/1000v/55/71/sunrisers-hyderabad-original-ipl-team-official-vector-56095571.jpg',
        value: 'SRH',
        label: 'Sunrisers Hyderabad'
    }
]
const ROLES = [
    {
        label: 'Batsman',
        icon: <MdSportsCricket />,
        value: 'Batsman'
    },
    {
        label: 'Bowler',
        icon: <BiSolidCricketBall />,
        value: 'Bowler'
    },
    {
        label: 'All Rounder',
        icon: <MdOutlineSportsHandball />,
        value: 'All-Rounder'
    },
    {
        label: 'Wicketkeeper',
        icon: <FaHandsHoldingCircle />,
        value: 'Wicket-Keeper'
    }
]

const ROLE_COLORS: Record<string, string> = {
    Batsman: 'bg-blue-600',
    Bowler: 'bg-red-600',
    'All-Rounder': 'bg-purple-600',
    'All-rounder': 'bg-purple-600',
    'Wicket-Keeper': 'bg-yellow-600',
    Wicketkeeper: 'bg-yellow-600'
}

export function PlayerList({
    players,
    selectedCount,
    searchTerm,
    onSearchChange,
    filterTeam,
    onFilterTeamChange,
    filterRole,
    onFilterRoleChange,
    filterOverseas,
    onFilterOverseasChange,
    onAddPlayer,
    canAddMore,
    filterIndiansOnly,
    onFilterIndiansOnlyChange
}: PlayerListProps) {
    return (
        <Card className="bg-card flex flex-col h-screen md:h-[80vh] overflow-hidden">
            <div className="p-4 space-y-4 border-b border-secondary">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start gap-2">
                        <h2 className="text-lg font-semibold">Select Players</h2>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <span>Choose from the list of available players for your team.</span>
                        </p>
                    </div>
                    <p className="text-sm text-muted-foreground font-body font-bold uppercase">
                        {selectedCount < 11 ? (
                            <span className="text-secondary">{selectedCount}</span>
                        ) : (
                            <span className="text-[#2E7D32]">{selectedCount}</span>
                        )}
                        /11 selected
                    </p>
                </div>

                {/* Search */}
                <div className="relative font-body">
                    <Input
                        placeholder="Search players..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10"
                    />
                    <Search
                        className="absolute left-3 top-3"
                        size={16}
                    />
                </div>

                {/* Filters - Mobile Responsive */}
                {/* Team Filter */}
                <div className="space-y-3 space-x-1.5 flex">
                    <Select
                        value={filterTeam}
                        onValueChange={(value) => onFilterTeamChange(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Teams" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {IPL_TEAMS.map((team) => (
                                    <SelectItem
                                        key={team.value}
                                        value={team.value}>
                                        <img
                                            src={team.icon}
                                            alt={team.label}
                                            className="w-4 h-4 mr-2 inline-block"
                                        />
                                        {team.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* Role Filter */}
                    <Select
                        value={filterRole}
                        onValueChange={(value) => onFilterRoleChange(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {ROLES.map((role) => (
                                    <SelectItem
                                        key={role.value}
                                        value={role.value}>
                                        {role.icon}
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* Overseas Toggle */}
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md transition">
                        <Checkbox
                            checked={filterOverseas}
                            onCheckedChange={(value) => onFilterOverseasChange(!!value)}
                            className="w-4 h-4"
                        />
                        <span className="text-md font-medium font-body">Overseas only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md transition">
                        <Checkbox
                            checked={filterIndiansOnly}
                            onCheckedChange={(value) => onFilterIndiansOnlyChange(!!value)}
                            className="w-4 h-4"
                        />
                        <span className="text-md font-medium font-body">Indians only</span>
                    </label>
                </div>
            </div>

            {/* Player Cards */}
            <ScrollArea className="flex-1 overflow-auto">
                <div className="p-4 space-y-2">
                    {players.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-secondary-foreground/45">No players available</p>
                        </div>
                    ) : (
                        players.map((player) => (
                            <div
                                key={player.id}
                                className="flex items-center gap-3 p-3 bg-card rounded-lg hover:bg-muted transition">
                                {/* Avatar */}
                                <Avatar className="w-10 h-10 flex-shrink-0">
                                    {player.profileImageUrl || (player as Player & { playerImageUrl?: string }).playerImageUrl ? (
                                        <AvatarImage
                                            src={player.profileImageUrl || (player as Player & { playerImageUrl?: string }).playerImageUrl}
                                            alt={player.name}
                                        />
                                    ) : null}
                                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500">{player.name.charAt(0)}</AvatarFallback>
                                </Avatar>

                                {/* Player Info */}
                                <div className="flex-1 min-w-0">
                                    <p className=" font-semibold truncate">{player.name}</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge
                                            variant="secondary"
                                            className="text-xs">
                                            {(player as Player & { team?: string }).team || player.iplTeam}
                                        </Badge>
                                        <Badge className={`text-xs ${ROLE_COLORS[player.role] || 'bg-gray-600'}`}>{player.role}</Badge>
                                        {player.isOverseas && <Badge className="text-xs bg-orange-600 ">Overseas</Badge>}
                                    </div>
                                </div>

                                {/* Credits and Add Button */}
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <span className=" font-bold text-sm">{(player as Player & { credits?: number }).credits ?? player.cost} Pts</span>
                                    <Button
                                        size="sm"
                                        onClick={() => onAddPlayer(player)}
                                        disabled={!canAddMore}
                                        className="bg-primary hover:bg-primary/80 disabled:opacity-50">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </Card>
    )
}
