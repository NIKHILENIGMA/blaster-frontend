import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { PLAYERS_API_BASE } from '@/shared/constants'
import api from '@/shared/lib/api-client'
import type { AdminPlayer, CreateAdminPlayerDTO, UpdateAdminPlayerDTO } from '../types/players'

export const getAdminPlayers = async (): Promise<AdminPlayer[]> => {
    const response = await api.get<AdminPlayer[]>(PLAYERS_API_BASE)
    return response.data
}

export const useAdminPlayers = () => {
    return useQuery({
        queryKey: ['admin-players'],
        queryFn: getAdminPlayers
    })
}

export const useCreateAdminPlayer = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateAdminPlayerDTO) => api.post<AdminPlayer, CreateAdminPlayerDTO>(PLAYERS_API_BASE, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-players'] })
        }
    })
}

export const useUpdateAdminPlayer = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ playerId, data }: { playerId: string; data: UpdateAdminPlayerDTO }) =>
            api.patch<AdminPlayer, UpdateAdminPlayerDTO>(`${PLAYERS_API_BASE}/${playerId}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-players'] })
        }
    })
}
