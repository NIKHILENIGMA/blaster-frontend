import { queryOptions, useQuery } from '@tanstack/react-query'

import { FRANCHISE_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { fixturesKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { GetUpcomingFixturesResponse } from '../types/fixtures'

export const getFixture = async (): Promise<GetUpcomingFixturesResponse> => {
    const response = await client.get<GetUpcomingFixturesResponse>(`${FRANCHISE_API_BASE}/fixtures/upcoming`)

    return response.data
}

export const getFixtureQueryOptions = () => {
    return queryOptions({
        queryKey: fixturesKeys.list(),
        queryFn: () => getFixture()
    })
}

export type UseGetFixtureOptions = {
    queryConfig?: QueryConfig<typeof getFixtureQueryOptions>
}

export const useGetFixture = ({ queryConfig }: UseGetFixtureOptions) => {
    return useQuery({
        ...getFixtureQueryOptions(),
        ...queryConfig,
        enabled: true
    })
}
