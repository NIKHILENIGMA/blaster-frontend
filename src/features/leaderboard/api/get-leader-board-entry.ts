import { queryOptions, useQuery } from '@tanstack/react-query'

import { LEADERBOARD_API_BASE, USERS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { dashboardKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { LeaderboardEntry } from '../../dashboard/types/dashboard'

export const getLeaderboardEntries = async (): Promise<LeaderboardEntry[]> => {
    const response = await client.get<LeaderboardEntry[]>(`${USERS_API_BASE}${LEADERBOARD_API_BASE}`)
    return response.data
}

export const getLeaderboardEntriesQueryOptions = () => {
    return queryOptions({
        queryKey: dashboardKeys.leaderboard(),
        queryFn: () => getLeaderboardEntries()
    })
}

export type UseLeaderboardEntriesOptions = {
    queryConfig?: QueryConfig<typeof getLeaderboardEntriesQueryOptions>
}

export const useLeaderboardEntries = ({ queryConfig }: UseLeaderboardEntriesOptions) => {
    return useQuery({
        ...getLeaderboardEntriesQueryOptions(),
        ...queryConfig,
        enabled: true
    })
}
