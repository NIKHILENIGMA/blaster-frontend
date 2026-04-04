import { queryOptions, useQuery } from '@tanstack/react-query'

import { TEAMS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { teamKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

type ActiveSession = {
    isActive: boolean
    session: {
        id: string
        startTime: Date
        isLocked: boolean
    } | null
}

export const getActiveSession = async (): Promise<ActiveSession> => {
    const response = await client.get<ActiveSession>(`${TEAMS_API_BASE}/session/active`)
    return response.data
}

export const getActiveSessionQueryOptions = () => {
    return queryOptions({
        queryKey: teamKeys.activeSession(),
        queryFn: () => getActiveSession()
    })
}

export type UseGetActiveSessionOptions = {
    queryConfig?: QueryConfig<typeof getActiveSessionQueryOptions>
}

export const useGetActiveSession = ({ queryConfig }: UseGetActiveSessionOptions) => {
    return useQuery({
        ...getActiveSessionQueryOptions(),
        ...queryConfig,
        enabled: true
    })
}
