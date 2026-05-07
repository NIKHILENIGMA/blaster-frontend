import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import api from '@/shared/lib/api-client'

import type { Fixture, PointsPreview } from '../types/fixtures'

export interface CreateFixtureDTO {
    matchId: string
    teamA: string
    teamB: string
    startTime: string
    cricbuzzMatchId: string
}

export const getFixtures = async (): Promise<Fixture[]> => {
    const response = await api.get<Fixture[]>('/admin/fixtures')
    return response.data
}

export const useFixtures = () => {
    return useQuery({
        queryKey: ['admin-fixtures'],
        queryFn: getFixtures
    })
}

export const useCreateFixture = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateFixtureDTO) => api.post('/admin/fixtures', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-fixtures'] })
        }
    })
}

export const useUpdateFixtureStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ fixtureId, status }: { fixtureId: string; status: string }) =>
            api.patch(`/admin/fixtures/${fixtureId}`, { matchStatus: status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-fixtures'] })
        }
    })
}

export const useCalculatePoints = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ fixtureId, cricbuzzMatchId }: { fixtureId: string; cricbuzzMatchId: string }) =>
            api.post(`/admin/fixtures/${fixtureId}/calculate`, { cricbuzzMatchId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-fixtures'] })
            queryClient.invalidateQueries({ queryKey: ['points-preview'] })
        }
    })
}

export const usePreviewPoints = (fixtureId: string | null) => {
    return useQuery({
        queryKey: ['points-preview', fixtureId],
        queryFn: async () => {
            if (!fixtureId) return null
            const response = await api.get<PointsPreview>(`/admin/fixtures/${fixtureId}/preview`)
            return response.data
        },
        enabled: !!fixtureId
    })
}

export const usePublishPoints = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (fixtureId: string) => api.post(`/admin/fixtures/${fixtureId}/publish`, {}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-fixtures'] })
        }
    })
}
