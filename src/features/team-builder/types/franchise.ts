import type { Player as CatalogPlayer } from './players'

export type FranchiseIdentity = {
    id: string
    userId: string
    teamName: string
    teamLogo: string
    createdAt: string | Date
    updatedAt: string | Date
}

export type MatchCycle = {
    id: string
    title: string
    isLocked: boolean
    buyWindowOpenAt: string | Date | null
    buyWindowCloseAt: string | Date | null
    squadLockAt: string | Date | null
    startTime: string | Date
    endTime: string | Date
    createdAt: string | Date
    updatedAt: string | Date
}

export type RosterCyclePlayer = CatalogPlayer & {
    purchasePrice: number
}

export type RosterCycle = {
    id: string
    createdAt: string | Date
    updatedAt: string | Date
    franchiseId: string
    matchId: string
    budgetTotal: number
    budgetUsed: number
    walletResetAmount: number
}

export type FranchiseOverview = {
    franchise: FranchiseIdentity | null
    activeCycle: MatchCycle | null
    rosterCycle: RosterCyclePlayer[] | null
}

export type CurrentRosterCycleResponse = {
    cycle: RosterCycle | null
    players: RosterCyclePlayer[] | null
    match?: MatchCycle
}

export type FranchiseFixture = {
    id: string
    startTime: string | Date
    matchId: string
    teamA: string
    teamB: string
    lineupLockAt: string | Date | null
    isProcessed: boolean
    matchNumber: string | null
    venueId: string | null
    matchResult: string | null
    matchStatus: 'scheduled' | 'live' | 'completed' | null
}

export type UpcomingFixturesResponse = {
    fixtures: FranchiseFixture[]
}

export type FixtureLineup = {
    id: string
    createdAt: string | Date
    updatedAt: string | Date
    lineupLockAt: string | Date | null
    rosterCycleId: string
    fixtureId: string
    rulesetId: string | null
    status: 'draft' | 'locked' | 'scored'
    captainId: string
    viceCaptainId: string
    impactPlayerId: string
    submittedAt: string | Date
    lockedAt: string | Date | null
    autoAppliedFromLineupId: string | null
}

export type LineupPlayer = CatalogPlayer & {
    selectionType: 'PLAYING' | 'SUBSTITUTE'
}

export type FixtureLineupResponse = {
    fixture: FranchiseFixture
    rosterCycle: RosterCycle
    squadPlayers: RosterCyclePlayer[]
    lineup: FixtureLineup | null
    lineupPlayers: LineupPlayer[]
}
