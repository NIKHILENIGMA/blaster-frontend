export type Fixture = {
    id: string
    teamA: string
    teamB: string
    startTime: string
    isProcessed: boolean
}

export interface GetUpcomingFixturesResponse {
    fixtures: Array<{
        id: string
        startTime: Date
        matchId: string
        teamA: string
        teamB: string
        lineupLockAt: Date | null
        isProcessed: boolean
        matchNumber: string | null
        venueId: string | null
        matchResult: string | null
        matchStatus: 'scheduled' | 'live' | 'completed' | null
    }>
}

export interface GetFixtureLineupResponse {
    fixture: {
        id: string
        startTime: Date
        matchId: string
        teamA: string
        teamB: string
        lineupLockAt: Date | null
        isProcessed: boolean
        matchNumber: string | null
        venueId: string | null
        matchResult: string | null
        matchStatus: 'scheduled' | 'live' | 'completed' | null
    }
    lineup: {
        id: string
        createdAt: Date
        updatedAt: Date
        lineupLockAt: Date | null
        rosterCycleId: string
        fixtureId: string
        rulesetId: string | null
        status: 'draft' | 'locked' | 'scored'
        captainId: string
        viceCaptainId: string
        impactPlayerId: string
        submittedAt: Date
        lockedAt: Date | null
        autoAppliedFromLineupId: string | null
    } | null
    lineupPlayers: {
        id: string
        name: string
        role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper'
        iplTeam: string
        isOverseas: boolean
        cost: number
        profileImageUrl: string
        selectionType: 'PLAYING' | 'SUBSTITUTE'
    }[]
}
