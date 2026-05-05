import type { FC } from 'react'
import { useNavigate } from 'react-router'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { FranchiseIdentity } from '@/features/team-builder/types/franchise'

import type { Player } from '../../types/players'
import SquadPlayerCard from '../cards/squad-player-card'

interface FranchiseSquadProps {
    franchise: FranchiseIdentity
    isSessionLock: boolean
    selectedPlayers: Player[]
}

const FranchiseSquad: FC<FranchiseSquadProps> = ({ franchise, isSessionLock, selectedPlayers }) => {
    const ROLE_ORDER = ['Wicket-Keeper', 'Batsman', 'All-Rounder', 'Bowler'] as const
    const navigate = useNavigate()

    // Group players by role
    const playersByRole = selectedPlayers.reduce<Record<string, Player[]>>((acc, player) => {
        if (!acc[player.role]) {
            acc[player.role] = []
        }
        acc[player.role].push(player)
        return acc
    }, {})
    return (
        <section className="w-full min-h-screen flex flex-col bg-background">
            {/* Header */}
            <div className="w-full px-4 md:px-6 py-8">
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                    {/* Team Logo */}
                    <div className="flex-shrink-0">
                        <Avatar className="w-24 h-24 md:w-32 md:h-32">
                            <AvatarImage src={franchise.teamLogo} />
                            <AvatarFallback>{franchise.teamName}</AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Team Info */}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{franchise.teamName}</h1>

                        {isSessionLock ? (
                            <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md w-76">
                                <p className="font-semibold">Session Locked</p>
                                <p className="text-sm">You cannot modify your squad at this time.</p>
                            </div>
                        ) : (
                            <Button
                                onClick={() => navigate('/franchise/build')}
                                variant="default"
                                className="px-4 py-2 cursor-pointer">
                                Modify Squad
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <Separator
                orientation="horizontal"
                className="my-4"
            />

            {/* Squad Section */}
            <div className="flex-1 w-full px-4 md:px-6 py-8 overflow-hidden">
                <div className="space-y-8 h-full overflow-y-auto custom-scrollbar">
                    {ROLE_ORDER.map((role) => {
                        const players = playersByRole[role] || []
                        if (players.length === 0) return null

                        return (
                            <div
                                key={role}
                                className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                                    <h3 className="font-black text-sm uppercase tracking-[0.2em] text-muted-foreground px-4 py-1 bg-muted rounded-full border border-border whitespace-nowrap">
                                        {role}s ({players.length})
                                    </h3>
                                    <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 pb-6">
                                    {players.map((player: Player) => (
                                        <SquadPlayerCard
                                            key={player.id}
                                            player={player}
                                            onRemovePlayer={() => {}}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default FranchiseSquad
