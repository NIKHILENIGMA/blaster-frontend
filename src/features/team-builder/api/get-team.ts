import { queryOptions, useQuery } from '@tanstack/react-query'

import { TEAMS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { teamKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { CurrentTeam } from '../types/team'

export const getCurrentTeam = async (): Promise<CurrentTeam> => {
    const response = await client.get<CurrentTeam>(`${TEAMS_API_BASE}/current`)
    return response.data
}

export const getCurrentTeamQueryOptions = () => {
    return queryOptions({
        queryKey: teamKeys.currentTeam(),
        queryFn: () => getCurrentTeam()
    })
}

export type UseGetCurrentTeamOptions = {
    queryConfig?: QueryConfig<typeof getCurrentTeamQueryOptions>
}

export const useGetCurrentTeam = ({ queryConfig }: UseGetCurrentTeamOptions) => {
    return useQuery({
        ...getCurrentTeamQueryOptions(),
        ...queryConfig,
        enabled: true
    })
}
