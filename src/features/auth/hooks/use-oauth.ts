import { useSignUp } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { useSearchParams } from 'react-router'

type OAuthStrategy = 'oauth_google' | 'oauth_github'

export const useOAuth = () => {
    const { isLoaded, signUp } = useSignUp()
    const [loadingProvider, setLoadingProvider] = useState<OAuthStrategy | null>(null)
    const { showBoundary } = useErrorBoundary()
    const [searchParams, setSearchParams] = useSearchParams()

    // Handle invitation token from URL query parameters
    const token = searchParams.get('invitationToken') || null

    useEffect(() => {
        if (!token || !isLoaded || !signUp) return

        const handleInvitationToken = async () => {
            try {
                await signUp.update({ unsafeMetadata: { invite_token: token } })

                // Remove token from URL after processing for security reasons
                setSearchParams((params) => {
                    params.delete('invitationToken')
                    return params
                })
            } catch (error) {
                showBoundary(error)
            }
        }

        handleInvitationToken()
    }, [token, isLoaded, signUp, setSearchParams, showBoundary])

    // Google OAuth Signup Handler
    const handleGoogleSignup = async (oauthStrategy: OAuthStrategy) => {
        if (!isLoaded) return
        // Implement Google signup logic here
        if (oauthStrategy !== 'oauth_google') {
            return
        }
        setLoadingProvider(oauthStrategy)
        try {
            await signUp.authenticateWithRedirect({
                strategy: oauthStrategy,
                redirectUrl: `${window.location.origin}/auth/sso-callback`,
                redirectUrlComplete: `${window.location.origin}/dashboard`
            })
        } catch (error) {
            showBoundary(error)
            throw error
        } finally {
            setLoadingProvider(null)
        }
    }

    return {
        loadingProvider,
        handleGoogleSignup
    }
}
