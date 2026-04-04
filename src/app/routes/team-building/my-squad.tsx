import Footer from '@/components/shared/footer'
import Header from '@/components/shared/header'
import { useGetCurrentTeam } from '@/features/team-builder/api/get-team'
import CreateTeam from '@/features/team-builder/components/create-team'
import MyTeam from '@/features/team-builder/components/my-team'

const MySquad = () => {
    const { data: currentTeam, isPending } = useGetCurrentTeam({})

    return (
        <div className="min-h-screen bg-neutral-background">
            <Header />
            {isPending ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading current team...</p>
                </div>
            ) : currentTeam && currentTeam.hasTeam ? (
                <MyTeam team={currentTeam} />
            ) : (
                <CreateTeam />
            )}
            <Footer />
        </div>
    )
}

export default MySquad
