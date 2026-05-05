import { create } from 'zustand'

import type { Nationality, Roles, Teams } from '../types/teams'

interface FilterState {
    searchQuery: string
    roleFilter: Roles
    teamFilter: Teams
    nationalityFilter: Nationality

    // Actions
    setSearchQuery: (query: string) => void
    setRoleFilter: (role: Roles) => void
    setTeamFilter: (team: Teams) => void
    setNationalityFilter: (nationality: Nationality) => void

    // Reset filters
    resetFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
    searchQuery: '',
    roleFilter: 'All',
    teamFilter: 'All',
    nationalityFilter: 'All',

    setSearchQuery: (query) => set({ searchQuery: query }),
    setRoleFilter: (role) => set({ roleFilter: role }),
    setTeamFilter: (team) => set({ teamFilter: team }),
    setNationalityFilter: (nationality) => set({ nationalityFilter: nationality }),

    resetFilters: () =>
        set({
            searchQuery: '',
            roleFilter: 'All',
            teamFilter: 'All',
            nationalityFilter: 'All'
        })
}))
