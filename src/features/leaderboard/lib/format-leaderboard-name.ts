import type { LeaderboardEntry } from '@/features/dashboard/types/dashboard'

const capitalizeInitial = (value: string) => {
    const trimmed = value.trim()

    if (!trimmed) return ''

    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

export const formatLeaderboardName = (entry: Pick<LeaderboardEntry, 'firstName' | 'lastName' | 'username'>) => {
    const fullName = [capitalizeInitial(entry.firstName), capitalizeInitial(entry.lastName)].filter(Boolean).join(' ')

    return fullName || entry.username
}
