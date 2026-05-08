export type RulesetScope = 'global' | 'cycle' | 'fixture'

export type RulesetConfig = {
    totalPlayers: number
    roles: {
        batsman: { min: number }
        bowler: { min: number }
        wicketKeeper: { min: number }
        allRounder: { min: number }
    }
    overseas: { max: number }
    multipliers: {
        captain: number
        viceCaptain: number
        impactPlayer: number
        overseas?: number
    }
    scoring?: {
        batsman?: {
            runs?: number
            ballsFaced?: number
            fours?: number
            sixes?: number
            strikeRate?: Array<{ min: number; points: number }>
            mileStones?: Array<{ runs: number; points: number }>
            duckPenalty?: {
                points: number
                applicableRoles: 'Batsman'
            }
        }
        bowler?: {
            wickets?: number
            dotBall?: number
            overBonus?: Array<{ minOvers: number; points: number }>
            economyRate?: Array<{ max: number; points: number }>
            mileStones?: Array<{ wickets: number; points: number }>
            maiden?: number
            lbwBowled?: number
        }
        fielder?: {
            catch?: number
            runOut?: number
            stumping?: number
            numberOfCatchesForBonus?: Array<{ minCatches: number; points: number }>
            numberOfRunOutsForBonus?: Array<{ minRunOuts: number; points: number }>
            stumpingBonus?: Array<{ minStumpings: number; points: number }>
        }
    }
}

export type Ruleset = {
    id: string
    name: string
    scope: RulesetScope
    config: RulesetConfig
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export type UpsertRulesetDTO = {
    name: string
    scope: RulesetScope
    isActive?: boolean
    config: RulesetConfig
}
