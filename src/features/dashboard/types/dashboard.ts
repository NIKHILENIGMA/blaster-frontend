import type { ReactNode } from 'react'

export type DashboardStats = {
    totalScore: number
    matchPlayed: number
    availablePoints: number
    rank: number
}

export interface StatCard {
    label: string
    value: number
    icon: ReactNode
    cover: string
    color: string
}

export interface LeaderboardEntry {
    userId: string
    firstName: string
    lastName: string
    username: string
    profileImage: string | null
    teamName?: string | null
    teamLogo?: string | null
    totalScore: number
    rank: number
}

export interface LeaderboardDTO {
    firstName: string
    lastName: string
    username: string
    totalScore: number
    rank: number
    avatar: string | null
    color: string
}
