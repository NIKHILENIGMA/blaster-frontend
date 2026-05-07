import { queryOptions, useQuery } from '@tanstack/react-query'

import { FRANCHISE_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { fixturesKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { GetFixtureLineupResponse } from '../types/fixtures'

export const getLineup = async (fixtureId: string): Promise<GetFixtureLineupResponse> => {
    const response = await client.get<GetFixtureLineupResponse>(`${FRANCHISE_API_BASE}/lineups/${fixtureId}`)

    return response.data
}

export const getLineupQueryOptions = (fixtureId: string) => {
    return queryOptions({
        queryKey: fixturesKeys.details(fixtureId),
        queryFn: () => getLineup(fixtureId)
    })
}

export type UseGetLineupOptions = {
    queryConfig?: QueryConfig<typeof getLineupQueryOptions>
}

export const useGetLineup = ({ queryConfig, fixtureId }: UseGetLineupOptions & { fixtureId: string }) => {
    return useQuery({
        ...getLineupQueryOptions(fixtureId),
        ...queryConfig,
        enabled: true
    })
}
