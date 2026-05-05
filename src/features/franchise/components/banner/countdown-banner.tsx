import { AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

export function CountdownBanner() {
    const [timeLeft, setTimeLeft] = useState('00:01:00')

    useEffect(() => {
        let totalSeconds = 0 * 3600 + 1 * 60 + 0 // 0:01:00

        const interval = setInterval(() => {
            totalSeconds--

            if (totalSeconds < 0) {
                clearInterval(interval)
                return
            }

            const hours = Math.floor(totalSeconds / 3600)
            const minutes = Math.floor((totalSeconds % 3600) / 60)
            const seconds = totalSeconds % 60

            setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="w-full bg-gradient-to-r from-red-600 to-red-700  py-3">
            <div className="mx-auto flex max-w-7xl items-center gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-white" />
                <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                        Deadline closes in <span className="font-mono text-base tracking-wider">{timeLeft}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
