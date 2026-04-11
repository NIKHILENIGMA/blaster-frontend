import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate, useParams } from 'react-router'
import { Toaster } from 'sonner'

import Footer from '@/components/shared/footer'
import Header from '@/components/shared/header'
import { Button } from '@/components/ui/button'
import { useGetActiveSession } from '@/features/team-builder/api/get-active-session'
import { useGetPlayers } from '@/features/team-builder/api/get-players'
import { useGetCurrentTeam } from '@/features/team-builder/api/get-team'
import { TeamBuilder } from '@/features/team-builder/components/team-builder'

// import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SelectPlayers() {
    const { teamId } = useParams<{ teamId: string }>()
    const { data: playersData } = useGetPlayers({})
    const { data: activeSessionData } = useGetActiveSession({})
    
    const { data: currentTeamData } = useGetCurrentTeam({
        sessionId: activeSessionData && activeSessionData.session ? activeSessionData.session.id : '' 
    })
    const isEditMode = Boolean(teamId)
    const activeSessionId = currentTeamData?.session?.id ?? activeSessionData?.session?.id ?? null

    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-neutral-background">
            <Header />
            <main className="flex flex-col items-center py-5 relative">
                <Button
                    onClick={() => navigate(-1)}
                    variant="outline"
                    className="hidden md:flex absolute left-4 top-5 md:top-2 shadow-none">
                    <FaArrowLeftLong />
                </Button>
                <TeamBuilder
                    players={playersData || []}
                    matchId={activeSessionId}
                    mode={isEditMode ? 'edit' : 'create'}
                    teamId={teamId}
                    initialTeam={currentTeamData?.team ?? null}
                />
            </main>
            <Footer />
            <Toaster />
        </div>
    )
}
