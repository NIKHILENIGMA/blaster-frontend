import { type FC } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { NATIONALITY, ROLES, TEAMS } from '../../constants/filter-constants'
import { useFilterStore } from '../../store/use-filter-store'
import type { Player } from '../../types/players'
import type { Nationality, Roles, Teams } from '../../types/teams'

interface FiltersProps {
    availablePlayers: Player[]
    selectedPlayers: Map<string, Player>
    classes?: string
}

const Filters: FC<FiltersProps> = ({ availablePlayers, selectedPlayers, classes }) => {
    const {
        searchQuery,
        setSearchQuery,
        roleFilter,
        setRoleFilter,
        teamFilter,
        setTeamFilter,
        nationalityFilter,
        setNationalityFilter,
        resetFilters
    } = useFilterStore()

    return (
        <div className={`space-y-4 border-b border-border p-4 ${classes}`}>
            <div className="flex flex-col gap-2">
                <label className="block text-xs font-semibold text-sidebar-foreground">Search Players</label>
                <Input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                />
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-sidebar-foreground">Filters</label>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            resetFilters()
                        }}>
                        Clear
                    </Button>
                </div>

                <div className="flex space-x-1.5 flex-wrap">
                    <Select
                        value={roleFilter}
                        onValueChange={(val: Roles) => setRoleFilter(val)}>
                        <SelectTrigger className="text-sm rounded-md border px-2 py-1 bg-background">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            {ROLES.map((role) => (
                                <SelectItem
                                    key={role.value}
                                    value={role.value}>
                                    {role.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={teamFilter}
                        onValueChange={(val: Teams) => setTeamFilter(val)}>
                        <SelectTrigger className="text-sm rounded-md border px-2 py-1 bg-background">
                            <SelectValue placeholder="All Teams" />
                        </SelectTrigger>
                        <SelectContent>
                            {TEAMS.map((team) => (
                                <SelectItem
                                    key={team.value}
                                    value={team.value}>
                                    {team.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={nationalityFilter}
                        onValueChange={(val: Nationality) => setNationalityFilter(val)}>
                        <SelectTrigger className="text-sm rounded-md border px-2 py-1 bg-background">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            {NATIONALITY.map((nation) => (
                                <SelectItem
                                    key={nation.value}
                                    value={nation.value}>
                                    {nation.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-background/50 px-3 py-2 text-xs font-medium">
                <span className="text-muted-foreground">Available: {availablePlayers.length}</span>
                <span className="text-primary">Selected: {selectedPlayers.size}</span>
            </div>
        </div>
    )
}

export default Filters
