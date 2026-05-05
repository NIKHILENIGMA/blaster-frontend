import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CreateFranchisePayload } from '@/features/team-builder/api/franchise'
import { FRANCHISE_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { franchiseKeys } from '@/shared/lib/query-keys'
import type { MutationConfig } from '@/shared/lib/react-query'

export const createFranchise = async (payload: CreateFranchisePayload) => {
    return client.post<null, CreateFranchisePayload>(`${FRANCHISE_API_BASE}`, payload)
}

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
