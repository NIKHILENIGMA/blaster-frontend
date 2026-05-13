const HOUR_IN_MS = 60 * 60 * 1000

export function getFixtureLockTime(startTime: string | Date, lineupLockAt?: string | Date | null) {
    if (lineupLockAt) return lineupLockAt

    const start = new Date(startTime).getTime()
    if (Number.isNaN(start)) return startTime

    return new Date(start - HOUR_IN_MS)
}

export function getTimeState(lockTime: string | Date) {
    const now = Date.now()
    const lock = new Date(lockTime).getTime()

    if (Number.isNaN(lock)) {
        return {
            diff: 0,
            minutes: 0,
            hasPassed: true,
            hasStarted: true,
            isWarning: false,
            isLocked: true,
            canEdit: false
        }
    }

    const diff = lock - now
    const minutes = Math.floor(diff / 60000)

    const warningWindowMs = 2 * 60 * 60 * 1000

    return {
        diff,
        minutes,
        hasPassed: diff <= 0,
        hasStarted: diff <= 0,
        isWarning: diff > 0 && diff <= warningWindowMs,
        isLocked: diff <= 0,
        canEdit: diff > 0
    }
}

export function formatTimeRemaining(diff: number) {
    if (diff <= 0) return 'Closed'

    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'Starting soon'

    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60)
        return `${hours}h left`
    }

    return `${minutes}m left`
}
