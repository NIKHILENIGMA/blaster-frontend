import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { FRANCHISE_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { fixturesKeys } from '@/shared/lib/query-keys'
import type { MutationConfig } from '@/shared/lib/react-query'

export type SaveLineupDTO = {
    playingPlayerIds: string[]
    substitutePlayerIds: string[]
    captainId: string
    viceCaptainId: string
    impactPlayerId: string
}

export const saveLineup = ({
    fixtureId,
    data
}: {
    fixtureId: string
    data: SaveLineupDTO
}) => {
    return client.put(`${FRANCHISE_API_BASE}/lineups/${fixtureId}`, data)
}

type UseSaveLineupOptions = {
    mutationConfig?: MutationConfig<typeof saveLineup>
}

export const useSaveLineup = ({ mutationConfig }: UseSaveLineupOptions = {}) => {
    const queryClient = useQueryClient()

    const { onSuccess, ...restConfig } = mutationConfig || {}

    return useMutation({
        onSuccess: (...args) => {
            queryClient.invalidateQueries({
                queryKey: fixturesKeys.list()
            })
            onSuccess?.(...args)
            toast.success('Lineup saved successfully')
        },
        mutationFn: saveLineup,
        ...restConfig
    })
}
