import { AlertTriangle, CheckCircle2, Clock3, TimerReset } from 'lucide-react'
import { useEffect, useMemo, useState, type ComponentType, type FC } from 'react'

import { cn } from '@/shared/lib/utils'

type CountdownTimerProps = {
    windowClosesAt: Date | string | number
    className?: string
    title?: string
}

type CountdownState = 'safe' | 'warning' | 'danger' | 'closed'

type StateConfig = {
    icon: ComponentType<{ className?: string }>
    label: string
    message: string
    className: string
    iconClassName: string
}

const HOUR_IN_MS = 60 * 60 * 1000

const stateConfig: Record<CountdownState, StateConfig> = {
    safe: {
        icon: CheckCircle2,
        label: 'Window open',
        message: 'You have enough time to make your changes.',
        className: 'border-green-200 bg-green-50 text-green-950',
        iconClassName: 'bg-green-100 text-green-700'
    },
    warning: {
        icon: Clock3,
        label: 'Closing soon',
        message: 'Only 2 hours left. Review your picks soon.',
        className: 'border-yellow-300 bg-yellow-50 text-yellow-950',
        iconClassName: 'bg-yellow-100 text-yellow-700'
    },
    danger: {
        icon: AlertTriangle,
        label: 'Hurry up',
        message: 'Hurry up, time is ticking fast.',
        className: 'border-red-300 bg-red-50 text-red-950',
        iconClassName: 'bg-red-100 text-red-700'
    },
    closed: {
        icon: TimerReset,
        label: 'Window closed',
        message: 'The selection window has closed.',
        className: 'border-gray-300 bg-gray-100 text-gray-950',
        iconClassName: 'bg-gray-200 text-gray-700'
    }
}

const getCountdownState = (remainingMs: number): CountdownState => {
    if (remainingMs <= 0) return 'closed'
    if (remainingMs <= HOUR_IN_MS) return 'danger'
    if (remainingMs <= 2 * HOUR_IN_MS) return 'warning'
    return 'safe'
}

const formatRemainingTime = (remainingMs: number) => {
    if (remainingMs <= 0) return '00h 00m 00s'

    const totalSeconds = Math.floor(remainingMs / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const time = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`

    return days > 0 ? `${days}d ${time}` : time
}

const CountdownTimer: FC<CountdownTimerProps> = ({ windowClosesAt, className, title = 'Time left before window closes' }) => {
    const closesAtTime = useMemo(() => new Date(windowClosesAt).getTime(), [windowClosesAt])
    const [remainingMs, setRemainingMs] = useState(() => closesAtTime - Date.now())

    useEffect(() => {
        setRemainingMs(closesAtTime - Date.now())

        const intervalId = window.setInterval(() => {
            setRemainingMs(closesAtTime - Date.now())
        }, 1000)

        return () => window.clearInterval(intervalId)
    }, [closesAtTime])

    const state = Number.isNaN(closesAtTime) ? 'closed' : getCountdownState(remainingMs)
    const config = stateConfig[state]
    const Icon = config.icon

    return (
        <section
            aria-live="polite"
            className={cn('rounded-xl border px-4 py-3 shadow-sm', config.className, className)}>
            <div className="flex items-center gap-3">
                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-full', config.iconClassName)}>
                    <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-normal opacity-80">{config.label}</p>
                            <h2 className="truncate font-heading text-sm font-bold sm:text-base">{title}</h2>
                        </div>

                        <p className="shrink-0 font-heading text-xl font-bold tabular-nums sm:text-2xl">{formatRemainingTime(remainingMs)}</p>
                    </div>

                    <p className="mt-1 text-sm font-medium opacity-90">{config.message}</p>
                </div>
            </div>
        </section>
    )
}

export default CountdownTimer
