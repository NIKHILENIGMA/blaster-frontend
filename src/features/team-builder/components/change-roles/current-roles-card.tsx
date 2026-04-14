import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import type { Player } from '../../types/team'
// import { Badge } from '@/components/ui/badge';

interface CurrentRolesCardProps {
    currentCaptainId: string
    currentViceCaptainId: string
    players: Player[]
    fixtureId: string
}

export default function CurrentRolesCard({ currentCaptainId, currentViceCaptainId, players, fixtureId }: CurrentRolesCardProps) {
    const currentCaptain = players.find((p) => p.id === currentCaptainId)
    const currentViceCaptain = players.find((p) => p.id === currentViceCaptainId)

    function modifyName(name: string) {
        // CSK_v_KKR_April15
        if (name.length <= 15) return name
        const parts = name.split('_')
        // ['CSK', 'v', 'KKR', 'April15']
        const firstName = parts[0]
        const lastNameInitial = parts[2]
        return `${firstName} vs ${lastNameInitial}.`
    }

    return (
        <Card className="border border-slate-200 p-4 sm:p-5 bg-secondary/90 text-white font-body">
            <div className="flex justify-between items-center px-4 py-2">
                <h2 className="text-md font-heading">
                    Your Current <strong>Captain</strong> & <strong>Vice Captain</strong>
                </h2>
                <Badge variant={'default'}>{modifyName(fixtureId)}</Badge>
            </div>
            <Separator />

            <div className="space-y-4 sm:space-y-5">
                {/* Captain */}
                <div className="flex items-start gap-3 p-2">
                    <div className="flex-shrink-0">
                        {currentCaptain?.profilePicUrl !== '' ? (
                            <img
                                src={currentCaptain?.profilePicUrl}
                                alt={currentCaptain?.name}
                                className="h-24 w-24 rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-24 w-24 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                <span className="text-white font-bold text-xs sm:text-sm">C</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <Badge className="text-xs text-white/80 font-medium mb-0.5">Captain</Badge>
                        <p className="font-semibold text-lg sm:text-2xl truncate">{currentCaptain?.name}</p>
                        <p className="text-sm text-white/80 text-md">Captain can give you a 4x point boost!</p>
                    </div>
                </div>

                {/* Vice Captain */}
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        {currentViceCaptain?.profilePicUrl !== '' ? (
                            <img
                                src={currentViceCaptain?.profilePicUrl}
                                alt={currentViceCaptain?.name}
                                className="h-24 w-24 rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-24 w-24 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                <span className="text-white font-bold text-xs sm:text-sm">VC</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <Badge className="text-xs text-white/80 font-medium mb-0.5">Vice Captain</Badge>
                        <p className="font-semibold text-lg sm:text-2xl truncate">{currentViceCaptain?.name}</p>
                        <p className="text-sm text-white/80 text-md">Vice Captain can give you a 3x point boost!</p>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-white/80">
                    <span className="font-semibold">Pro tip:</span> Choose your captain wisely for maximum points
                </p>
            </div>
        </Card>
    )
}
