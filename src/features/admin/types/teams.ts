import type { GetFixtureLineupResponse } from '@/features/team/types/fixtures'

export type AdminFixtureTeamsResponse = {
    fixture: GetFixtureLineupResponse['fixture']
    entries: Array<{
        rosterCycleId: string
        franchise: {
            id: string
            userId: string
            teamName: string
            teamLogo: string
        }
        user: {
            id: string
            username: string
            firstName: string
            lastName: string
            email: string
            profileImage: string | null
        }
        lineup: GetFixtureLineupResponse['lineup']
        lineupPlayers: GetFixtureLineupResponse['lineupPlayers']
        matchPoints: GetFixtureLineupResponse['matchPoints']
    }>
}
