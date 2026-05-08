export type Match = {
    id: string
    title: string
    isLocked: boolean
    buyWindowOpenAt: string | null
    buyWindowCloseAt: string | null
    squadLockAt: string | null
    startTime: string
    endTime: string
    createdAt: string
    updatedAt: string
}

export type UpsertMatchDTO = {
    title: string
    startTime: string
    endTime: string
    buyWindowOpenAt?: string
    buyWindowCloseAt?: string
    squadLockAt?: string
}
