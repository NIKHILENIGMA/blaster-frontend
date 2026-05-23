import { type FC } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from 'sonner'

import { LoginFallback } from '@/components'
import PublicRoute from '@/components/shared/public-route'
import AuthDialog from '@/features/auth/components/auth-dialog'

import Home from '../home'

const Signup: FC = () => {
    return (
        <PublicRoute>
            <Home />
            <div className="relative z-50">
                <ErrorBoundary
                    FallbackComponent={({ error, resetErrorBoundary }) => (
                        <LoginFallback
                            error={error}
                            resetError={resetErrorBoundary}
                        />
                    )}>
                    <AuthDialog defaultTab="signup" />
                </ErrorBoundary>
                <Toaster />
            </div>
        </PublicRoute>
    )
}

export default Signup
