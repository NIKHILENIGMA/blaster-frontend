import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import api from '@/shared/lib/api-client'

import type { Match } from '../types/match'

export const getMatches = async (): Promise<Match[]> => {
    const response = await api.get<Match[]>('/admin/matches')
    return response.data
}

export const useMatches = () => {
    return useQuery({
        queryKey: ['admin-matches'],
        queryFn: getMatches
    })
}

export const useCreateMatch = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: { title: string; startTime: string; endTime: string }) => api.post('/admin/matches', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-matches'] })
        }
    })
}

export const useToggleMatchLock = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ matchId, isLocked }: { matchId: string; isLocked: boolean }) =>
            api.patch(`/admin/matches/${matchId}/toggle-lock`, { isLocked }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-matches'] })
        }
    })
}
