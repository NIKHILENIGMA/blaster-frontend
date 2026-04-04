import { X, Star, Zap } from 'lucide-react'
import { toast } from 'sonner'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useTeamStore } from '@/shared/store/use-team-store'

export default function SquadCanvas() {
    const { selectedPlayers, budget, overseasCount, removePlayer, setRole, captainId, viceCaptainId, impactPlayerId } = useTeamStore()

    const handleRoleAssign = (role: 'captain' | 'viceCaptain' | 'impactPlayer', playerId: number) => {
        const result = setRole(role, playerId)
        if (!result.success) {
            toast.error(result.message || 'Failed to assign role')
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* HUD / Telemetry */}
            <div className="bg-slate-950/80 backdrop-blur text-white p-4 border-b border-slate-800 flex justify-between items-center shrink-0 z-10">
                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Remaining Budget</p>
                    <p className={`text-2xl font-black ${budget < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {budget} <span className="text-sm font-medium text-slate-500">pts</span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Overseas</p>
                    <p className={`text-lg font-bold ${overseasCount > 4 ? 'text-red-400' : 'text-white'}`}>
                        {overseasCount} <span className="text-sm text-slate-500">/ 4</span>
                    </p>
                </div>
            </div>

            {/* The Pitch (Scrollable if needed) */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-emerald-900 to-slate-900">
                {selectedPlayers.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-emerald-700 font-black text-2xl uppercase tracking-widest text-center opacity-50">
                        Awaiting Draft
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-max">
                        {selectedPlayers.map((player) => (
                            <div
                                key={player.id}
                                className="relative group">
                                {/* Remove Button */}
                                <button
                                    onClick={() => removePlayer(player.id)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                    <X className="h-3 w-3" />
                                </button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm rounded-xl p-3 cursor-pointer transition-all border-b-4 hover:-translate-y-1">
                                            {/* Role Badges */}
                                            <div className="absolute -top-3 -left-2 flex gap-1 z-10">
                                                {captainId === player.id && (
                                                    <div className="bg-amber-400 text-amber-950 text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-lg border-2 border-slate-900">
                                                        C
                                                    </div>
                                                )}
                                                {viceCaptainId === player.id && (
                                                    <div className="bg-slate-300 text-slate-900 text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-lg border-2 border-slate-900">
                                                        VC
                                                    </div>
                                                )}
                                                {impactPlayerId === player.id && (
                                                    <div className="bg-purple-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-lg border-2 border-slate-900">
                                                        <Zap className="h-3 w-3" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-center mt-2">
                                                <p className="font-bold text-white text-sm truncate">{player.name}</p>
                                                <p className="text-emerald-400 text-xs font-medium">{player.role}</p>
                                            </div>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="center"
                                        className="w-48">
                                        <DropdownMenuLabel>Assign Role</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleRoleAssign('captain', player.id)}>
                                            <Star className="mr-2 h-4 w-4 text-amber-500" /> Make Captain (2x)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleRoleAssign('viceCaptain', player.id)}>
                                            <Star className="mr-2 h-4 w-4 text-slate-400" /> Make Vice-Captain (1.5x)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleRoleAssign('impactPlayer', player.id)}>
                                            <Zap className="mr-2 h-4 w-4 text-purple-500" /> Assign Impact Player
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
