export interface Player {
    id: string
    name: string
    iplTeam: 'RCB' | 'CSK' | 'MI' | 'KKR' | 'SRH' | 'DC' | 'PBKS' | 'RR' | 'GT' | 'LSG'
    role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper'
    profileImageUrl: string
    isOverseas: boolean
    cost: number
}
