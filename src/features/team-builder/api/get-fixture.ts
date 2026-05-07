import { queryOptions, useQuery } from '@tanstack/react-query'

import { TEAMS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { fixturesKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { Fixture } from '../types/fixture'

export const getFixture = async (): Promise<Fixture[]> => {
    const response = await client.get<Fixture[]>(`${TEAMS_API_BASE}/fixtures`)

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
