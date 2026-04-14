export interface FantasyTeam {
    id: string
    name: string
    team: string
    ownerId: string
    isOverseas: boolean
    cost: number
    profilePicUrl: string
    role: string
}

export interface CurrentTeam {
    hasTeam: boolean
    team: {
        id: string
        ownerId: string
        name?: string
        players: {
            id: string
            name: string
            team: string
            isOverseas: boolean
            cost: number
            profilePicUrl: string
            role: string
        }[]
        captainId: string
        viceCaptainId: string
    } | null
    session: {
        id: string
        startTime: Date
        isLocked: boolean
    } | null
}



export type Player = {
    id: string
    name: string
    team: 'CSK' | 'MI' | 'RCB' | 'KKR' | 'SRH' | 'DC' | 'PBKS' | 'RR' | 'GT' | 'LSG'
    isOverseas: boolean
    profilePicUrl: string
    role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper'
}

export interface Team {
    id: string
    userId: string
    matchId: string
    teamName: string | null
    players: Player[]
    captainId: string
    viceCaptainId: string
    updatedAt: Date
}
