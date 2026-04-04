import { type FC } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'

import { MainLayout, DashboardLayout } from '@/components'
import { AdminLayout } from '@/components/layout/admin-layout'
import AdminProtectedRoute from '@/components/shared/admin-protected-route'
import ProtectedRoute from '@/components/shared/protected-route'
import PublicRoute from '@/components/shared/public-route'

const mainRouter = [
    // Protected Routes (Authenticated users only)
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                path: 'dashboard',
                lazy: () => import('./routes/dashboard/dashbord-page').then((module) => ({ Component: module.default }))
            },
            {
                path: 'leaderboard',
                lazy: () => import('./routes/leaderboard/leaderboard').then((module) => ({ Component: module.default }))
            },
            {
                path: 'matches',
                lazy: () => import('./routes/matches/matches').then((module) => ({ Component: module.default }))
            },
            {
                path: 'my-squad',
                lazy: () => import('./routes/team-building/my-squad').then((module) => ({ Component: module.default }))
            },
            {
                path: 'my-squad/create',
                lazy: () => import('./routes/team-building/select-players').then((module) => ({ Component: module.default }))
            },
            {
                path: 'my-squad/:teamId/change',
                lazy: () => import('./routes/team-building/change-players').then((module) => ({ Component: module.default }))
            },
            {
                path: 'analytics',
                lazy: () => import('./routes/analytics/analytics').then((module) => ({ Component: module.default }))
            },
            {
                path: 'profile',
                lazy: () => import('./routes/profile/profile').then((module) => ({ Component: module.default }))
            }
        ]
    },

    // Public Routes (Unauthenticated users only)
    {
        path: '/',
        element: (
            <PublicRoute>
                <MainLayout />
            </PublicRoute>
        ),
        children: [
            {
                index: true,
                lazy: () => import('./routes/home').then((module) => ({ Component: module.default }))
            },
            {
                path: 'about',
                lazy: () => import('./routes/about').then((module) => ({ Component: module.default }))
            }
        ]
    },
    // Authentication Routes
    {
        path: '/auth',
        children: [
            {
                path: 'login',
                lazy: () => import('./routes/auth/login').then((module) => ({ Component: module.default }))
            },
            {
                path: 'signup',
                lazy: () => import('./routes/auth/signup').then((module) => ({ Component: module.default }))
            },
            {
                path: 'sso-callback',
                lazy: () => import('./routes/auth/sso-callback').then((module) => ({ Component: module.default }))
            }
        ]
    },
    {
        path: '*',
        lazy: () => import('./routes/not-found').then((module) => ({ Component: module.default }))
    }
]

const adminRouter = [
    {
        path: '/admin',
        element: (
            <AdminProtectedRoute>
                <AdminLayout />
            </AdminProtectedRoute>
        ),
        children: [
            {
                index: true,
                path: 'dashboard'
            },
            {
                path: 'matches',
                lazy: () => import('./routes/admin/matches').then((module) => ({ Component: module.default }))
            },
            {
                path: 'fixtures',
                lazy: () => import('./routes/admin/fixtures').then((module) => ({ Component: module.default }))
            },
            {
                path: 'player-stats',
                lazy: () => import('./routes/admin/player-stats').then((module) => ({ Component: module.default }))
            }
        ]
    },
    {
        path: '/auth',
        children: [
            {
                path: 'login',
                lazy: () => import('./routes/auth/login').then((module) => ({ Component: module.default }))
            },
            {
                path: 'signup',
                lazy: () => import('./routes/auth/signup').then((module) => ({ Component: module.default }))
            },
            {
                path: 'sso-callback',
                lazy: () => import('./routes/auth/sso-callback').then((module) => ({ Component: module.default }))
            }
        ]
    },
    {
        path: '*',
        lazy: () => import('./routes/not-found').then((module) => ({ Component: module.default }))
    }
]

const AppRouter: FC = () => {
    const hostname = window.location.hostname
    const isAdmin = hostname.startsWith('admin.') // Simple check for admin subdomain
    const router = createBrowserRouter(isAdmin ? adminRouter : mainRouter)

    return <RouterProvider router={router} />
}

export default AppRouter
