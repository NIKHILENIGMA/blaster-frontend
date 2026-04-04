import { queryOptions, useQuery } from '@tanstack/react-query'

import { DASHBOARD_API_BASE, USERS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { dashboardKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { DashboardStats } from '../types/dashboard'


export const getStats = async (): Promise<DashboardStats> => {
    const response = await client.get<DashboardStats>(`${USERS_API_BASE}${DASHBOARD_API_BASE}`)
    return response.data
}

export const getStatsQueryOptions = () => {
    return queryOptions({
        queryKey: dashboardKeys.stats(),
        queryFn: () => getStats()
    })
}

export type UseStatsOptions = {
    queryConfig?: QueryConfig<typeof getStatsQueryOptions>
}

export const useStats = ({ queryConfig }: UseStatsOptions) => {
    return useQuery({
        ...getStatsQueryOptions(),
        ...queryConfig,
        enabled: true
    })
}
