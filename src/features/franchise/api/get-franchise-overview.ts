import { queryOptions, useQuery } from '@tanstack/react-query'

import type { FranchiseOverview } from '@/features/team-builder/types/franchise'
import { FRANCHISE_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { franchiseKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

export const getFranchiseOverview = async (): Promise<FranchiseOverview> => {
    const response = await client.get<FranchiseOverview>(`${FRANCHISE_API_BASE}/me`)
    return response.data
}

export const getFranchiseOverviewQueryOptions = () =>
    queryOptions({
        queryKey: franchiseKeys.overview(),
        queryFn: getFranchiseOverview
    })

export const useGetFranchiseOverview = ({
    queryConfig
}: {
    queryConfig?: QueryConfig<typeof getFranchiseOverviewQueryOptions>
} = {}) =>
    useQuery({
        ...getFranchiseOverviewQueryOptions(),
        ...queryConfig
    })
