import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { FRANCHISE_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { fixturesKeys, franchiseKeys } from '@/shared/lib/query-keys'
import type { MutationConfig, QueryConfig } from '@/shared/lib/react-query'

import type { CurrentRosterCycleResponse, FixtureLineupResponse, FranchiseOverview, UpcomingFixturesResponse } from '../types/franchise'

export type CreateFranchisePayload = {
    teamName: string
    teamLogo: string
}

export type SaveSquadPayload = {
    playerIds: string[]
}

export type SaveLineupPayload = {
    playingPlayerIds: string[]
    substitutePlayerIds: string[]
    captainId: string
    viceCaptainId: string
    impactPlayerId: string
}

export const getFranchiseOverview = async (): Promise<FranchiseOverview> => {
    const response = await client.get<FranchiseOverview>(`${FRANCHISE_API_BASE}/me`)
    return response.data
}

export const getCurrentRosterCycle = async (): Promise<CurrentRosterCycleResponse> => {
    const response = await client.get<CurrentRosterCycleResponse>(`${FRANCHISE_API_BASE}/roster-cycles/current`)
    return response.data
}

export const getUpcomingFixtures = async (): Promise<UpcomingFixturesResponse> => {
    const response = await client.get<UpcomingFixturesResponse>(`${FRANCHISE_API_BASE}/fixtures/upcoming`)
    return response.data
}

export const getFixtureLineup = async (fixtureId: string): Promise<FixtureLineupResponse> => {
    const response = await client.get<FixtureLineupResponse>(`${FRANCHISE_API_BASE}/lineups/${fixtureId}`)
    return response.data
}

export const createFranchise = async (payload: CreateFranchisePayload) => {
    return client.post<null, CreateFranchisePayload>(`${FRANCHISE_API_BASE}`, payload)
}

export const saveSquad = async ({ matchId, payload }: { matchId: string; payload: SaveSquadPayload }) => {
    return client.put<null, SaveSquadPayload>(`${FRANCHISE_API_BASE}/roster-cycles/${matchId}/squad`, payload)
}

export const saveLineup = async ({ fixtureId, payload }: { fixtureId: string; payload: SaveLineupPayload }) => {
    return client.put<null, SaveLineupPayload>(`${FRANCHISE_API_BASE}/lineups/${fixtureId}`, payload)
}

export const getFranchiseOverviewQueryOptions = () =>
    queryOptions({
        queryKey: franchiseKeys.overview(),
        queryFn: getFranchiseOverview
    })

export const getCurrentRosterCycleQueryOptions = () =>
    queryOptions({
        queryKey: franchiseKeys.currentCycle(),
        queryFn: getCurrentRosterCycle
    })

export const getUpcomingFixturesQueryOptions = () =>
    queryOptions({
        queryKey: franchiseKeys.upcomingFixtures(),
        queryFn: getUpcomingFixtures
    })

export const getFixtureLineupQueryOptions = (fixtureId: string) =>
    queryOptions({
        queryKey: franchiseKeys.lineup(fixtureId),
        queryFn: () => getFixtureLineup(fixtureId),
        enabled: Boolean(fixtureId)
    })

export const useGetFranchiseOverview = ({
    queryConfig
}: {
    queryConfig?: QueryConfig<typeof getFranchiseOverviewQueryOptions>
} = {}) =>
    useQuery({
        ...getFranchiseOverviewQueryOptions(),
        ...queryConfig
    })

export const useGetCurrentRosterCycle = ({
    queryConfig
}: {
    queryConfig?: QueryConfig<typeof getCurrentRosterCycleQueryOptions>
} = {}) =>
    useQuery({
        ...getCurrentRosterCycleQueryOptions(),
        ...queryConfig
    })

export const useGetUpcomingFixtures = ({
    queryConfig
}: {
    queryConfig?: QueryConfig<typeof getUpcomingFixturesQueryOptions>
} = {}) =>
    useQuery({
        ...getUpcomingFixturesQueryOptions(),
        ...queryConfig
    })

export const useGetFixtureLineup = ({
    fixtureId,
    queryConfig
}: {
    fixtureId: string
    queryConfig?: QueryConfig<typeof getFixtureLineupQueryOptions>
}) =>
    useQuery({
        ...getFixtureLineupQueryOptions(fixtureId),
        ...queryConfig,
        enabled: Boolean(fixtureId) && (queryConfig?.enabled ?? true)
    })

export const useCreateFranchise = ({
    mutationConfig
}: {
    mutationConfig?: MutationConfig<typeof createFranchise>
} = {}) => {
    const queryClient = useQueryClient()

    return useMutation({
        ...mutationConfig,
        mutationFn: createFranchise,
        onSuccess: async (...args) => {
            await queryClient.invalidateQueries({ queryKey: franchiseKeys.overview() })
            await queryClient.invalidateQueries({ queryKey: franchiseKeys.currentCycle() })
            await mutationConfig?.onSuccess?.(...args)
        }
    })
}

export const useSaveSquad = ({
    mutationConfig
}: {
    mutationConfig?: MutationConfig<typeof saveSquad>
} = {}) => {
    const queryClient = useQueryClient()

    return useMutation({
        ...mutationConfig,
        mutationFn: saveSquad,
        onSuccess: async (...args) => {
            await queryClient.invalidateQueries({ queryKey: franchiseKeys.overview() })
            await queryClient.invalidateQueries({ queryKey: franchiseKeys.currentCycle() })
            await queryClient.invalidateQueries({ queryKey: franchiseKeys.upcomingFixtures() })
            await queryClient.invalidateQueries({ queryKey: ['franchise', 'lineup'] })
            await queryClient.invalidateQueries({ queryKey: fixturesKeys.list() })
            await mutationConfig?.onSuccess?.(...args)
        }
    })
}

export const useSaveLineup = ({
    mutationConfig
}: {
    mutationConfig?: MutationConfig<typeof saveLineup>
} = {}) => {
    const queryClient = useQueryClient()

    return useMutation({
        ...mutationConfig,
        mutationFn: saveLineup,
        onSuccess: async (...args) => {
            const variables = args[1]
            await queryClient.invalidateQueries({
                queryKey: franchiseKeys.lineup(variables.fixtureId)
            })
            await queryClient.invalidateQueries({ queryKey: franchiseKeys.upcomingFixtures() })
            await mutationConfig?.onSuccess?.(...args)
        }
    })
}
