import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import z from 'zod'

import { FRANCHISE_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { franchiseKeys } from '@/shared/lib/query-keys'
import type { MutationConfig } from '@/shared/lib/react-query'

import { useFranchiseStore } from '../store/use-franchise-store'
// import { teamKeys } from '@/shared/lib/query-keys'

// Schema for updating a role
export const UpdateFranchiseSchema = z.object({
    playerIds: z.array(z.string().min(1, 'Player ID is required'))
})

export type UpdateFranchise = z.infer<typeof UpdateFranchiseSchema>

// Function to update a Franchise by its ID
export const updateFranchise = async ({ matchId, isDraft, data }: { matchId: string; isDraft: boolean; data: UpdateFranchise }) => {
    return await client.put<null, UpdateFranchise>(`${FRANCHISE_API_BASE}/roster-cycles/${matchId}/squad?isDraft=${isDraft}`, data)
}

type UseUpdateFranchiseOptions = {
    mutationConfig?: MutationConfig<typeof updateFranchise>
}

export const useUpdateFranchise = ({ mutationConfig }: UseUpdateFranchiseOptions = {}) => {
    const queryClient = useQueryClient()
    const setSaveStatus = useFranchiseStore((state) => state.setSaveStatus)
    const { ...restConfig } = mutationConfig || {}
    return useMutation({
        onMutate: async () => {
            setSaveStatus('saving')
        },
        onSuccess: async () => {
            setSaveStatus('saved')
            await queryClient.invalidateQueries({
                queryKey: franchiseKeys.overview()
            })
            setTimeout(() => {
                setSaveStatus('idle')
            }, 1000) // Reset save status to 'idle' after 1 second to allow for quick subsequent saves without the status getting stuck on 'saved'
        },
        onError: (err) => {
            setSaveStatus('error')
            setTimeout(() => {
                setSaveStatus('idle')
            }, 3000) // Reset save status to 'idle' after 3 seconds to allow user to attempt saving again without the status getting stuck on 'error'
            queryClient.invalidateQueries({
                queryKey: franchiseKeys.overview()
            })
            toast.error(
                err instanceof AxiosError ? err.response?.data?.message || err.message : 'An error occurred while saving the squad. Please try again.'
            )
        },
        mutationFn: updateFranchise,
        ...restConfig
    })
}
