import { queryOptions, useQuery } from '@tanstack/react-query'

import { PLAYERS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { playersKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { Player } from '../types/players'

export const getPlayers = async (): Promise<Player[]> => {
    const response = await client.get<Player[]>(`${PLAYERS_API_BASE}`)
    return response.data
}

export const getPlayersQueryOptions = () => {
    return queryOptions({
        queryKey: playersKeys.list(),
        queryFn: () => getPlayers()
    })
}

export type UseGetPlayersOptions = {
    queryConfig?: QueryConfig<typeof getPlayersQueryOptions>
}

export const useGetPlayers = ({ queryConfig }: UseGetPlayersOptions) => {
    return useQuery({
        ...getPlayersQueryOptions(),
        ...queryConfig,
        enabled: true
    })
}
