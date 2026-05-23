import { ErrorBoundary } from 'react-error-boundary'

import { LoginFallback } from '@/components'
import PublicRoute from '@/components/shared/public-route'
import { Toaster } from '@/components/ui/sonner'
import AuthDialog from '@/features/auth/components/auth-dialog'

import Home from '../home'

export default function LoginPage() {
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
                    <AuthDialog defaultTab="login" />
                </ErrorBoundary>
                <Toaster />
            </div>
        </PublicRoute>
    )
}
