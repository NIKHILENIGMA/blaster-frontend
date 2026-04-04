export const dashboardKeys = {
    stats: () => ['dashboard', 'stats'] as const,
    leaderboard: () => ['dashboard', 'leaderboard'] as const,
    lists: () => [...dashboardKeys.stats(), 'lists'] as const,
    tableTopper: () => [...dashboardKeys.stats(), 'table-topper'] as const
}

export const teamKeys = {
    currentTeam: () => ['team', 'current'] as const,
    activeSession: () => ['team', 'active-session'] as const
}

export const playersKeys = {
    list: () => ['players', 'list'] as const,
    details: (playerId: number) => [...playersKeys.list(), playerId] as const
}
