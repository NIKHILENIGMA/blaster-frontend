export function getTimeState(startTime: string | Date) {
    const now = Date.now()
    const start = new Date(startTime).getTime()

    if (Number.isNaN(start)) {
        return {
            diff: 0,
            minutes: 0,
            hasStarted: true,
            isWarning: false,
            isLocked: true,
            canEdit: false
        }
    }

    const diff = start - now
    const minutes = Math.floor(diff / 60000)

    const warningWindowMs = 2 * 60 * 60 * 1000
    const lockWindowMs = 1 * 60 * 60 * 1000

    return {
        diff,
        minutes,
        hasStarted: diff <= 0,
        isWarning: diff > lockWindowMs && diff <= warningWindowMs,
        isLocked: diff <= lockWindowMs,
        canEdit: diff > lockWindowMs
    }
}

export function formatTimeRemaining(diff: number) {
    if (diff <= 0) return 'Match started'

    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'Starting soon'

    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60)
        return `${hours}h left`
    }

    return `${minutes}m left`
}