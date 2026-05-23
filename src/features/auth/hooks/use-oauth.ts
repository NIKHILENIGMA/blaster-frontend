import { useSignUp } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { useSearchParams } from 'react-router'

type OAuthStrategy = 'oauth_google' | 'oauth_github'

type ClerkError = {
    message?: string
    longMessage?: string
}

type ClerkErrorResponse = {
    errors?: ClerkError[]
}

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
    oauth_failed: 'Google signup could not be completed. Please try again.',
    oauth_incomplete: 'Google signup was not completed. Please try again.',
    oauth_account_conflict: 'This Google account is already connected to another account. Try logging in with the original method.'
}

const getClerkErrors = (error: unknown): ClerkError[] => {
    if (typeof error !== 'object' || error === null) return []

    const response = error as ClerkErrorResponse
    return Array.isArray(response.errors) ? response.errors : []
}

const getClerkErrorMessage = (error: ClerkError) => {
    return error.longMessage || error.message || 'Google signup could not be completed. Please try again.'
}

export const useOAuth = () => {
    const { isLoaded, signUp } = useSignUp()
    const [loadingProvider, setLoadingProvider] = useState<OAuthStrategy | null>(null)
    const [formError, setFormError] = useState<string | null>(null)
    const { showBoundary } = useErrorBoundary()
    const [searchParams, setSearchParams] = useSearchParams()

    // Handle invitation token from URL query parameters
    const token = searchParams.get('invitationToken') || null

    useEffect(() => {
        const authError = searchParams.get('auth_error')
        if (!authError) return
        console.log('OAuth error detected:', authError)

        setFormError(OAUTH_ERROR_MESSAGES[authError] ?? 'Google signup could not be completed. Please try again.')
        setSearchParams((params) => {
            params.delete('auth_error')
            return params
        })
    }, [searchParams, setSearchParams])

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
                redirectUrl: `${window.location.origin}/auth/sso-callback?flow=signup`,
                redirectUrlComplete: `${window.location.origin}/dashboard`
            })
        } catch (error) {
            const clerkErrors = getClerkErrors(error)
            const message = clerkErrors.length
                ? clerkErrors.map(getClerkErrorMessage).join(' ')
                : error instanceof Error
                  ? error.message
                  : 'Google signup could not be completed. Please try again.'
            setFormError(message)
        } finally {
            setLoadingProvider(null)
        }
    }

    return {
        loadingProvider,
        handleGoogleSignup,
        formError
    }
}
