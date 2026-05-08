import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NATIONALITY, ROLES, TEAMS } from '@/features/franchise/constants/filter-constants'
import type { Nationality, Roles, Teams } from '@/features/franchise/types/teams'

type PlayerManagementFiltersProps = {
    searchQuery: string
    onSearchQueryChange: (value: string) => void
    teamFilter: Teams
    onTeamFilterChange: (value: Teams) => void
    roleFilter: Roles
    onRoleFilterChange: (value: Roles) => void
    nationalityFilter: Nationality
    onNationalityFilterChange: (value: Nationality) => void
    onReset: () => void
}

export function PlayerManagementFilters({
    searchQuery,
    onSearchQueryChange,
    teamFilter,
    onTeamFilterChange,
    roleFilter,
    onRoleFilterChange,
    nationalityFilter,
    onNationalityFilterChange,
    onReset
}: PlayerManagementFiltersProps) {
    return (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                <div className="flex-1 space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Search</label>
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(event) => onSearchQueryChange(event.target.value)}
                            placeholder="Search by player name or Cricbuzz ID"
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 lg:w-[32rem]">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Team</label>
                        <Select
                            value={teamFilter}
                            onValueChange={(value: Teams) => onTeamFilterChange(value)}>
                            <SelectTrigger>
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
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Role</label>
                        <Select
                            value={roleFilter}
                            onValueChange={(value: Roles) => onRoleFilterChange(value)}>
                            <SelectTrigger>
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
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Overseas</label>
                        <Select
                            value={nationalityFilter}
                            onValueChange={(value: Nationality) => onNationalityFilterChange(value)}>
                            <SelectTrigger>
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

                <Button
                    variant="outline"
                    onClick={onReset}
                    className="w-full lg:w-auto">
                    Clear Filters
                </Button>
            </div>
        </div>
    )
}
