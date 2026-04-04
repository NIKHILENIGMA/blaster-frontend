import { queryOptions, useQuery } from '@tanstack/react-query'

import { LEADERBOARD_API_BASE, USERS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { dashboardKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { LeaderboardEntry } from '../types/dashboard'

export const getTableTopper = async (): Promise<LeaderboardEntry[]> => {
    const response = await client.get<LeaderboardEntry[]>(`${USERS_API_BASE}${LEADERBOARD_API_BASE}/toppers`)
    return response.data
}

export const getTableTopperQueryOptions = () => {
    return queryOptions({
        queryKey: dashboardKeys.tableTopper(),
        queryFn: () => getTableTopper()
    })
}

export type UseLeaderboardEntriesOptions = {
    queryConfig?: QueryConfig<typeof getTableTopperQueryOptions>
}

export const useTableTopper = ({ queryConfig }: UseLeaderboardEntriesOptions) => {
    return useQuery({
        ...getTableTopperQueryOptions(),
        ...queryConfig,
        enabled: true
    })
}
