import { useUser } from '@clerk/clerk-react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'

import ContainLoader from '../loader/contain-loader'

interface ProtectedRouteProps {
    children: ReactNode
}

const AdminProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isLoaded, user } = useUser()
    const location = useLocation()
    if (!isLoaded) return <div>Loading...</div> // Prevent flash of content
    if (!isLoaded) {
        return <ContainLoader /> // You can replace with a proper loading component
    }

    if (!user) {
        // Redirect to login with the current location so user can be redirected back after login
        return (
            <Navigate
                to="/auth/login"
                state={{ from: location }}
                replace
            />
        )
    }

    const isAdmin = user.publicMetadata?.role === 'admin'

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <p className="text-gray-600">You do not have permission to access this page.</p>
            </div>
        )
    }

    return <>{children}</>
}

export default AdminProtectedRoute
