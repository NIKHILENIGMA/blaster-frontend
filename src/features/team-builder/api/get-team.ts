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

export const getCurrentTeamQueryOptions = (sessionId: string) => {
    return queryOptions({
        queryKey: teamKeys.currentTeam(sessionId),
        queryFn: () => getCurrentTeam(),
        enabled: Boolean(sessionId)
    })
}

export type UseGetCurrentTeamOptions = {
    queryConfig?: QueryConfig<typeof getCurrentTeamQueryOptions>
}

export const useGetCurrentTeam = ({ queryConfig, sessionId }: UseGetCurrentTeamOptions & { sessionId: string }) => {
    return useQuery({
        ...getCurrentTeamQueryOptions(sessionId),
        ...queryConfig,
        enabled: true
    })
}
