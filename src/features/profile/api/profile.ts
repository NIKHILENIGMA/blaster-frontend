import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { FRANCHISE_API_BASE, USERS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { dashboardKeys, franchiseKeys, userKeys } from '@/shared/lib/query-keys'
import type { MutationConfig, QueryConfig } from '@/shared/lib/react-query'

export type ProfileResponse = {
    user: {
        id: string
        firstName: string
        lastName: string
        email: string
        username: string
        profileImage: string | null
    }
    franchise: {
        id: string
        teamName: string
        teamLogo: string
    } | null
}

export type SyncProfilePayload = {
    firstName?: string
    lastName?: string
    profileImage?: string | null
}

export type ChangeUsernamePayload = {
    newUsername: string
}

export type UpdateFranchisePayload = {
    teamName: string
    teamLogo: string
}

export const getProfile = async (): Promise<ProfileResponse> => {
    const response = await client.get<ProfileResponse>(`${USERS_API_BASE}/profile`)
    return response.data
}

export const syncProfile = async (payload: SyncProfilePayload) => {
    return client.patch<null, SyncProfilePayload>(`${USERS_API_BASE}/profile`, payload)
}

export const changeUsername = async (payload: ChangeUsernamePayload) => {
    return client.patch<null, ChangeUsernamePayload>(`${USERS_API_BASE}/profile/change-username`, payload)
}

export const updateFranchise = async (payload: UpdateFranchisePayload) => {
    return client.patch<null, UpdateFranchisePayload>(`${FRANCHISE_API_BASE}/me`, payload)
}

export const getProfileQueryOptions = () =>
    queryOptions({
        queryKey: userKeys.profile(),
        queryFn: getProfile
    })

export const useGetProfile = ({ queryConfig }: { queryConfig?: QueryConfig<typeof getProfileQueryOptions> } = {}) =>
    useQuery({
        ...getProfileQueryOptions(),
        ...queryConfig
    })

const useInvalidateProfileData = () => {
    const queryClient = useQueryClient()

    return async () => {
        await queryClient.invalidateQueries({ queryKey: userKeys.profile() })
        await queryClient.invalidateQueries({ queryKey: dashboardKeys.leaderboard() })
        await queryClient.invalidateQueries({ queryKey: dashboardKeys.tableTopper() })
        await queryClient.invalidateQueries({ queryKey: franchiseKeys.overview() })
    }
}

export const useSyncProfile = ({ mutationConfig }: { mutationConfig?: MutationConfig<typeof syncProfile> } = {}) => {
    const invalidateProfileData = useInvalidateProfileData()

    return useMutation({
        ...mutationConfig,
        mutationFn: syncProfile,
        onSuccess: async (...args) => {
            await invalidateProfileData()
            await mutationConfig?.onSuccess?.(...args)
        }
    })
}

export const useChangeUsername = ({ mutationConfig }: { mutationConfig?: MutationConfig<typeof changeUsername> } = {}) => {
    const invalidateProfileData = useInvalidateProfileData()

    return useMutation({
        ...mutationConfig,
        mutationFn: changeUsername,
        onSuccess: async (...args) => {
            await invalidateProfileData()
            await mutationConfig?.onSuccess?.(...args)
        }
    })
}

export const useUpdateFranchise = ({ mutationConfig }: { mutationConfig?: MutationConfig<typeof updateFranchise> } = {}) => {
    const invalidateProfileData = useInvalidateProfileData()

    return useMutation({
        ...mutationConfig,
        mutationFn: updateFranchise,
        onSuccess: async (...args) => {
            await invalidateProfileData()
            await mutationConfig?.onSuccess?.(...args)
        }
    })
}
