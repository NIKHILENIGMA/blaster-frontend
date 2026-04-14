import { useMutation, useQueryClient } from '@tanstack/react-query'
import z from 'zod'

import { TEAMS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { teamKeys } from '@/shared/lib/query-keys'
import type { MutationConfig } from '@/shared/lib/react-query'
// import { teamKeys } from '@/shared/lib/query-keys'

// Schema for updating a role
export const UpdateRoleSchema = z.object({
    fixtureId: z.string().min(1, 'Fixture ID is required'),
    newCaptainId: z.string().min(1, 'Captain ID is required'),
    newViceCaptainId: z.string().min(1, 'Vice-Captain ID is required')
})

export type UpdateRole = z.infer<typeof UpdateRoleSchema>

// Function to update a role by its ID
export const updateRole = async ({ teamId, data }: { teamId: string; data: UpdateRole }) => {
    return await client.patch<null, UpdateRole>(`${TEAMS_API_BASE}/${teamId}/roles`, data)
}

type UseUpdateRoleOptions = {
    mutationConfig?: MutationConfig<typeof updateRole>
}

export const useUpdateRole = ({ mutationConfig }: UseUpdateRoleOptions = {}) => {
    const queryClient = useQueryClient()

    const { ...restConfig } = mutationConfig || {}
    return useMutation({
        ...restConfig,
        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({
                queryKey: teamKeys.details(variables.teamId)
            })

            await queryClient.invalidateQueries({
                queryKey: ['team', 'current']
            })
        },
        mutationFn: updateRole
    })
}
