import { Plus, Search, Shield, UserRound } from 'lucide-react'
import { useMemo, useState, type FC } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Player } from '@/features/franchise/types/players'
import { teams, type TeamName } from '@/features/team/constants/team'
import { cn } from '@/shared/lib/utils'

type RoleFilter = 'All' | Player['role']
type TeamFilter = 'All' | Player['iplTeam']

interface BuildTeamPlayerPoolProps {
    players: Player[]
    selectedCount: number
    onAddPlayer: (player: Player) => void
    className?: string
}

const ROLE_FILTERS: RoleFilter[] = ['All', 'Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper']
const TEAM_FILTERS: TeamFilter[] = ['All', 'CSK', 'DC', 'KKR', 'MI', 'PBKS', 'RCB', 'RR', 'GT', 'LSG', 'SRH']
const TEAM_DISPLAY_NAMES: Record<Exclude<TeamFilter, 'All'>, string> = {
    CSK: 'Chennai',
    DC: 'Delhi',
    KKR: 'Kolkata',
    MI: 'Mumbai',
    PBKS: 'Punjab',
    RCB: 'Bengaluru',
    RR: 'Rajasthan',
    GT: 'Gujarat',
    LSG: 'Lucknow',
    SRH: 'Hyderabad'
}

const roleTone: Record<Player['role'], string> = {
    Batsman: 'bg-green-500/10 text-green-700 border-green-500/20',
    Bowler: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    'All-Rounder': 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    'Wicket-Keeper': 'bg-red-500/10 text-red-700 border-red-500/20'
}

const BuildTeamPlayerPool: FC<BuildTeamPlayerPoolProps> = ({ players, selectedCount, onAddPlayer, className }) => {
    const [search, setSearch] = useState('')
    const [teamFilter, setTeamFilter] = useState<TeamFilter>('All')
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('All')

    const canAddMore = selectedCount < 12

    const filteredPlayers = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        return players.filter((player) => {
            const teamDisplayName = TEAM_DISPLAY_NAMES[player.iplTeam as Exclude<TeamFilter, 'All'>]?.toLowerCase() ?? ''
            const matchesSearch =
                normalizedSearch.length === 0 ||
                player.name.toLowerCase().includes(normalizedSearch) ||
                player.iplTeam.toLowerCase().includes(normalizedSearch) ||
                teamDisplayName.includes(normalizedSearch) ||
                player.role.toLowerCase().includes(normalizedSearch)

            const matchesTeam = teamFilter === 'All' || player.iplTeam === teamFilter
            const matchesRole = roleFilter === 'All' || player.role === roleFilter

            return matchesSearch && matchesTeam && matchesRole
        })
    }, [players, roleFilter, search, teamFilter])

    return (
        <div className={cn('flex h-full min-h-0 flex-col bg-card rounded-3xl p-6', className)}>
            <div className="shrink-0 border-b border-border bg-muted/30 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-wider">Franchise Pool</h3>
                        <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {filteredPlayers.length} of {players.length} available
                        </p>
                    </div>
                    <div className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-black">{selectedCount}/12</div>
                </div>

                <div className="mt-4 space-y-3">
                    <Label className="relative block">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search players"
                            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                        />
                        <Button
                            variant={'ghost'}
                            onClick={() => (setSearch(''), setTeamFilter('All'), setRoleFilter('All'))}
                            className="absolute top-[10%] right-1.5">
                            Clear
                        </Button>
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Select
                            value={teamFilter}
                            onValueChange={(event) => setTeamFilter(event as TeamFilter)}>
                            <SelectTrigger className="w-full sm:w-34">
                                <SelectValue placeholder="Filter by team" />
                            </SelectTrigger>
                            <SelectContent>
                                {TEAM_FILTERS.map((team) => (
                                    <SelectItem
                                        key={team}
                                        value={team}>
                                        {team === 'All' ? 'All teams' : TEAM_DISPLAY_NAMES[team]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={roleFilter}
                            onValueChange={(event) => setRoleFilter(event as RoleFilter)}>
                            <SelectTrigger className="w-full sm:w-34">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLE_FILTERS.map((role) => (
                                    <SelectItem
                                        key={role}
                                        value={role}>
                                        {role === 'All' ? 'All roles' : role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
                {filteredPlayers.length > 0 ? (
                    <div className="space-y-2">
                        {filteredPlayers.map((player) => {
                            const teamInfo = teams[player.iplTeam as TeamName]

                            return (
                                <article
                                    key={player.id}
                                    className="group rounded-lg border border-border bg-background p-3 shadow-sm transition-colors hover:border-primary/50">
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                                            {teamInfo?.bgCover ? (
                                                <img
                                                    src={teamInfo.bgCover}
                                                    alt=""
                                                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                                                />
                                            ) : null}
                                            <img
                                                src={player.profileImageUrl}
                                                alt={player.name}
                                                className="relative h-full w-full object-cover object-top"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h4 className="truncate text-sm font-black leading-tight">{player.name}</h4>
                                                    <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                                                        {teamInfo?.teamLogoUrl ? (
                                                            <img
                                                                src={teamInfo.teamLogoUrl}
                                                                alt=""
                                                                className="h-4 w-4 object-contain"
                                                            />
                                                        ) : (
                                                            <Shield className="h-3.5 w-3.5" />
                                                        )}
                                                        <span>
                                                            {TEAM_DISPLAY_NAMES[player.iplTeam as Exclude<TeamFilter, 'All'>] ?? player.iplTeam}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{player.cost} cr</span>
                                                    </div>
                                                </div>

                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    disabled={!canAddMore}
                                                    onClick={() => onAddPlayer(player)}
                                                    className="h-8 shrink-0 gap-1 px-2.5">
                                                    <Plus className="h-3.5 w-3.5" />
                                                    Add
                                                </Button>
                                            </div>

                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                <span className={cn('rounded-md border px-2 py-0.5 text-[11px] font-bold', roleTone[player.role])}>
                                                    {player.role}
                                                </span>
                                                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                                                    <UserRound className="h-3 w-3" />
                                                    {player.isOverseas ? 'Overseas' : 'Domestic'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-4 text-center">
                        <p className="text-sm font-medium text-muted-foreground">No players match the selected filters.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BuildTeamPlayerPool
