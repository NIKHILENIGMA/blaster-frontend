export const dashboardKeys = {
    stats: () => ['dashboard', 'stats'] as const,
    leaderboard: () => ['dashboard', 'leaderboard'] as const,
    lists: () => [...dashboardKeys.stats(), 'lists'] as const,
    tableTopper: () => [...dashboardKeys.stats(), 'table-topper'] as const
}

export const teamKeys = {
    currentTeam: (sessionId: string) => ['team', 'current', sessionId] as const,
    activeSession: () => ['team', 'active-session'] as const,
    details: (teamId: string) => ['team', 'details', teamId] as const
}

export const franchiseKeys = {
    overview: () => ['franchise', 'overview'] as const,
    currentCycle: () => ['franchise', 'current-cycle'] as const,
    upcomingFixtures: () => ['franchise', 'upcoming-fixtures'] as const,
    lineup: (fixtureId: string) => ['franchise', 'lineup', fixtureId] as const
}

export const userKeys = {
    profile: () => ['users', 'profile'] as const
}

export const playersKeys = {
    list: () => ['players', 'list'] as const,
    details: (playerId: number) => [...playersKeys.list(), playerId] as const
}

export const fixturesKeys = {
    list: () => ['fixtures', 'list'] as const,
    details: (fixtureId: string) => [...fixturesKeys.list(), fixtureId] as const
}
