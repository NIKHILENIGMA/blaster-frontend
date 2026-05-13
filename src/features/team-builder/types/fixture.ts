export type Fixture = {
    id: string
    teamA: string
    teamB: string
    startTime: string
    lineupLockAt?: string | Date | null
    isProcessed: boolean
}
