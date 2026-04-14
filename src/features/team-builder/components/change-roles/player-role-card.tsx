import { Check } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

import type { Player } from '../../types/team'

interface PlayerRoleCardProps {
    player: Player
    selectedCaptainId: string | null
    selectedViceCaptainId: string | null
    isLocked: boolean
    onRoleChange: (playerId: string, roleType: 'captain' | 'vice') => void
}

export default function PlayerRoleCard({ player, selectedCaptainId, selectedViceCaptainId, isLocked, onRoleChange }: PlayerRoleCardProps) {
    const isCaptain = selectedCaptainId === player.id
    const isViceCaptain = selectedViceCaptainId === player.id

    const getAvatarColor = () => {
        const hash = player.id.charCodeAt(0) + player.id.charCodeAt(1)
        const colors = [
            'from-red-400 to-red-600',
            'from-blue-400 to-blue-600',
            'from-green-400 to-green-600',
            'from-purple-400 to-purple-600',
            'from-pink-400 to-pink-600',
            'from-indigo-400 to-indigo-600'
        ]
        return colors[hash % colors.length]
    }

    return (
        <Card
            className={`border-2 p-3 sm:p-4 transition-all duration-200 ${isLocked ? 'opacity-75' : ''} ${
                isCaptain || isViceCaptain ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'
            }`}>
            <div className="space-y-3">
                {/* Player Info */}
                <div className="flex items-start gap-3">
                    {player.profilePicUrl !== '' ? (
                        <img
                            src={player.profilePicUrl}
                            alt={player.name}
                            className="h-18 w-18 rounded-full object-cover"
                        />
                    ) : (
                        <div
                            className={`h-18 w-18 rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                            {player.name.charAt(0)}
                        </div>
                    )}
                    <div className="flex-1 min-w-0 space-x-1.5">
                        <h3 className="font-semibold text-slate-900 text-sm truncate">{player.name}</h3>
                        <Badge
                            variant={'default'}
                            className={'text-xs mt-1'}>
                            {player.role}
                        </Badge>
                        <Badge
                            variant={'secondary'}
                            className={'text-xs mt-1'}>
                            {player.team}
                        </Badge>
                    </div>
                    {(isCaptain || isViceCaptain) && (
                        <div className="flex-shrink-0">
                            <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Role Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onRoleChange(player.id, 'captain')}
                        disabled={isLocked || (isViceCaptain && !isCaptain)}
                        className={`flex-1 py-2 px-3 rounded-md font-medium text-xs sm:text-sm transition-all duration-200 ${
                            isCaptain
                                ? 'bg-blue-600 text-white shadow-md'
                                : isLocked || (isViceCaptain && !isCaptain)
                                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300'
                        }`}>
                        {isCaptain && '✓'} C
                    </button>
                    <button
                        onClick={() => onRoleChange(player.id, 'vice')}
                        disabled={isLocked || (isCaptain && !isViceCaptain)}
                        className={`flex-1 py-2 px-3 rounded-md font-medium text-xs sm:text-sm transition-all duration-200 ${
                            isViceCaptain
                                ? 'bg-amber-600 text-white shadow-md'
                                : isLocked || (isCaptain && !isViceCaptain)
                                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300'
                        }`}>
                        {isViceCaptain && '✓'} VC
                    </button>
                </div>
            </div>
        </Card>
    )
}
