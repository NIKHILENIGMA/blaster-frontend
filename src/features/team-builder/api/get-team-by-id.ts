import { queryOptions, useQuery } from '@tanstack/react-query'

import { TEAMS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { teamKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { Team } from '../types/team'

export const getTeamById = async (teamId: string): Promise<Team> => {
    const response = await client.get<Team>(`${TEAMS_API_BASE}/${teamId}`)
    return response.data
}

export const getTeamQueryOptions = (id: string) => {
    return queryOptions({
        queryKey: teamKeys.details(id),
        queryFn: () => getTeamById(id)
    })
}

export type UseGetTeamOptions = {
    queryConfig?: QueryConfig<typeof getTeamQueryOptions>
}

export const useGetTeamById = ({ queryConfig, teamId }: UseGetTeamOptions & { teamId: string }) => {
    return useQuery({
        ...getTeamQueryOptions(teamId),
        ...queryConfig,
        enabled: true
    })
}
