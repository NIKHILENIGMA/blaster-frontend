import { useUser } from '@clerk/clerk-react'
import { ArrowLeft } from 'lucide-react'
import type { FC } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'


const Profile: FC = () => {
    const { user, isLoaded, isSignedIn } = useUser()
    const navigate = useNavigate()

    if (!isLoaded) {
        return <div>Loading profile...</div>
    }

    if (!isSignedIn || !user) {
        return <div>Please sign in to view your profile.</div>
    }

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.fullName || 'N/A'
    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || 'N/A'
    const username = user.username || 'N/A'

    return (
        <div className="min-h-screen w-full mx-auto max-w-2xl px-4 py-6">
            <Button
                variant="outline"
                className="mb-4 inline-flex items-center gap-2"
                onClick={() => navigate('/dashboard')}>
                <ArrowLeft /> Back to Dashboard
            </Button>
            <h1 className="mb-6 text-center text-3xl font-bold">Profile</h1>

            <div className="mb-6 flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                <img
                    src={user.imageUrl}
                    alt={fullName}
                    width={88}
                    height={88}
                    className="h-[88px] w-[88px] rounded-full object-cover"
                />
                <div className="space-y-1 text-center sm:text-left">
                    <p>
                        <strong>Name:</strong> {fullName}
                    </p>
                    <p>
                        <strong>Email:</strong> {email}
                    </p>
                    <p>
                        <strong>Username:</strong> {username}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                <button
                    type="button"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Edit Profile
                </button>
                <button
                    type="button"
                    className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200">
                    Change Password
                </button>
                <button
                    type="button"
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                    Sign Out
                </button>
            </div>
        </div>
    )
}

export default Profile
