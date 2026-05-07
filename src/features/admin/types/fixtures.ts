export type Fixture = {
    matchStatus: "scheduled" | "live" | "completed" | null;
    matchId: string;
    id: string;
    startTime: Date;
    teamA: string;
    teamB: string;
    lineupLockAt: Date | null;
    isProcessed: boolean;
    matchNumber: string | null;
    venueId: string | null;
    matchResult: string | null;
    cricbuzzMatchId: string | null;
}

export type PointsPreview = {
    fixtureId: string;
    isProcessed: boolean;
    entries: Array<{
        fixtureUserPointsId: string;
        rosterCycleId: string;
        lineupId: string;
        totalPoints: number;
        rankSnapshot: number | null;
    }>;
}