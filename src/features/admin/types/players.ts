export type AdminPlayer = {
    id: string
    name: string
    iplTeam: 'CSK' | 'MI' | 'RCB' | 'KKR' | 'SRH' | 'DC' | 'PBKS' | 'RR' | 'GT' | 'LSG'
    role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper'
    profileImageUrl: string
    isOverseas: boolean
    cost: number
    cricbuzzPlayerId: string | null
}

export type CreateAdminPlayerDTO = {
    name: string
    iplTeam: AdminPlayer['iplTeam']
    role: AdminPlayer['role']
    profileImageUrl: string
    isOverseas: boolean
    cost: number
    cricbuzzPlayerId?: string | null
}

export type UpdateAdminPlayerDTO = Partial<CreateAdminPlayerDTO>
