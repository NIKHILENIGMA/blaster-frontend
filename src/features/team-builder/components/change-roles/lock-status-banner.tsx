import { AlertCircle, Lock, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { Fixture } from '../../types/fixture'
import { formatTimeRemaining, getTimeState } from '../../utils/time'

interface LockStatusBannerProps {
    fixture: Fixture
}

export default function LockStatusBanner({ fixture }: LockStatusBannerProps) {
    const [timeRemaining, setTimeRemaining] = useState<string>('')

    useEffect(() => {
        const updateTimer = () => {
            const { diff } = getTimeState(fixture.startTime)
            setTimeRemaining(formatTimeRemaining(diff))
        }

        updateTimer()
        const interval = setInterval(updateTimer, 10000)

        return () => clearInterval(interval)
    }, [fixture.startTime])
    const { hasStarted, isLocked, isWarning } = getTimeState(fixture.startTime)

    if (hasStarted) {
        return (
            <div className="flex items-start gap-3 rounded-lg border-l-4 border-red-500 bg-red-50 p-3 sm:p-4">
                <Lock className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-red-900 text-sm sm:text-base">Match already started</h3>
                    <p className="text-xs sm:text-sm text-red-800 mt-0.5">Role changes are closed for this fixture</p>
                </div>
            </div>
        )
    }

    if (isLocked) {
        return (
            <div className="flex items-start gap-3 rounded-lg border-l-4 border-red-500 bg-red-50 p-3 sm:p-4">
                <Lock className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-red-900 text-sm sm:text-base">Roles are locked</h3>
                    <p className="text-xs sm:text-sm text-red-800 mt-0.5">Cannot change roles within 60 minutes of match start</p>
                </div>
            </div>
        )
    }

    if (isWarning) {
        return (
            <div className="flex items-start gap-3 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-3 sm:p-4">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-amber-900 text-sm sm:text-base">Locks in {timeRemaining}</h3>
                    <p className="text-xs sm:text-sm text-amber-800 mt-0.5">Roles will lock 60 minutes before match start. Make your changes soon!</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-start gap-3 rounded-lg border-l-4 border-green-500 bg-green-50 p-3 sm:p-4">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-green-900 text-sm sm:text-base">You can change roles</h3>
                <p className="text-xs sm:text-sm text-green-800 mt-0.5">Roles will lock {timeRemaining}</p>
            </div>
        </div>
    )
}
