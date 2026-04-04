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
