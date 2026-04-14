import { Clock, MapPin } from 'lucide-react'

import { Card } from '@/components/ui/card'

interface Fixture {
    id: string
    matchLabel: string
    startTime: Date
    venue: string
    isProcessed: boolean
    timeUntilStartMinutes: number
    canEditRoles: boolean
}

interface FixtureSelectorProps {
    fixtures: Fixture[]
    selectedFixtureId: string | null
    onSelectFixture: (fixtureId: string) => void
}

export default function FixtureSelector({ fixtures, selectedFixtureId, onSelectFixture }: FixtureSelectorProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900">Select Fixture</label>
            <div className="space-y-2">
                {fixtures.map((fixture) => (
                    <button
                        key={fixture.id}
                        onClick={() => onSelectFixture(fixture.id)}
                        className={`w-full text-left transition-all duration-200 ${
                            selectedFixtureId === fixture.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                        }`}>
                        <Card
                            className={`p-3 sm:p-4 border-2 cursor-pointer transition-colors ${
                                selectedFixtureId === fixture.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                            } ${fixture.isProcessed ? 'opacity-60' : ''}`}>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{fixture.matchLabel}</h3>
                                    {fixture.isProcessed ? (
                                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium">Locked</span>
                                    ) : fixture.timeUntilStartMinutes < 30 ? (
                                        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">Closing Soon</span>
                                    ) : (
                                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">Open</span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1 text-xs text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span>{formatTime(fixture.startTime)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span>{fixture.venue}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </button>
                ))}
            </div>
        </div>
    )
}
