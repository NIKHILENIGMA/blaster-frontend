import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import api from '@/shared/lib/api-client'

import type { Ruleset, UpsertRulesetDTO } from '../types/rulesets'

type UpdateRulesetDTO = Partial<UpsertRulesetDTO>

export const getRulesets = async (): Promise<Ruleset[]> => {
    const response = await api.get<Ruleset[]>('/admin/rulesets')
    return response.data
}

export const useRulesets = () => {
    return useQuery({
        queryKey: ['admin-rulesets'],
        queryFn: getRulesets
    })
}

export const useCreateRuleset = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpsertRulesetDTO) => api.post<Ruleset, UpsertRulesetDTO>('/admin/rulesets', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-rulesets'] })
        }
    })
}

export const useUpdateRuleset = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ rulesetId, data }: { rulesetId: string; data: UpdateRulesetDTO }) =>
            api.patch<Ruleset, UpdateRulesetDTO>(`/admin/rulesets/${rulesetId}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-rulesets'] })
        }
    })
}

export const useDeleteRuleset = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (rulesetId: string) => api.delete<null>(`/admin/rulesets/${rulesetId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-rulesets'] })
        }
    })
}
