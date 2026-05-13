import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import api from '@/shared/lib/api-client'

import type { Fixture, PointsPreview } from '../types/fixtures'
import type { AdminFixtureTeamsResponse } from '../types/teams'

export interface CreateFixtureDTO {
    id: string
    matchId: string
    teamA: string
    teamB: string
    startTime: string
    lineupLockAt?: string
    matchNumber?: string
    venueId?: string
    matchStatus?: 'scheduled' | 'live' | 'completed'
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

export const useUpdateFixture = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            fixtureId,
            data
        }: {
            fixtureId: string
            data: {
                teamA?: string
                teamB?: string
                startTime?: string
                matchNumber?: string | null
                venueId?: string | null
                matchStatus?: 'scheduled' | 'live' | 'completed'
                lineupLockAt?: string | null
            }
        }) => api.patch(`/admin/fixtures/${fixtureId}`, data),
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
            queryClient.invalidateQueries({ queryKey: ['admin-fixture-teams'] })
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
            queryClient.invalidateQueries({ queryKey: ['points-preview'] })
            queryClient.invalidateQueries({ queryKey: ['admin-fixture-teams'] })
        }
    })
}

export const getFixtureTeams = async (fixtureId: string): Promise<AdminFixtureTeamsResponse> => {
    const response = await api.get<AdminFixtureTeamsResponse>(`/admin/fixtures/${fixtureId}/teams`)
    return response.data
}

export const useFixtureTeams = (fixtureId: string) => {
    return useQuery({
        queryKey: ['admin-fixture-teams', fixtureId],
        queryFn: () => getFixtureTeams(fixtureId),
        enabled: Boolean(fixtureId)
    })
}
