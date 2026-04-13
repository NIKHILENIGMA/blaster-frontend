import { useSignIn } from '@clerk/clerk-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import type { LoginFormRequest } from '../types/auth'

type OAuthProvider = 'oauth_google' | 'oauth_github'

export const useLogin = () => {
    const { isLoaded, signIn, setActive } = useSignIn()
    const navigate = useNavigate()
    const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null)
    const [formError, setFormError] = useState<string | null>(null)
    const [requiresSecondFactor, setRequiresSecondFactor] = useState(false)
    const [secondFactorEmail, setSecondFactorEmail] = useState<string | null>(null)

    const onSubmit = async (data: LoginFormRequest) => {
        if (!isLoaded) return
        setFormError(null)
        setRequiresSecondFactor(false)
        setSecondFactorEmail(null)

        try {
            const result = await signIn.create({
                identifier: data.email,
                password: data.password
            })

            if (result.status === 'complete' && result.createdSessionId) {
                await setActive({ session: result.createdSessionId })
                navigate('/dashboard')
                return
            }

            if (result.status === 'needs_second_factor') {
                await signIn.prepareSecondFactor({ strategy: 'email_code' })

                const emailFactor = (result.supportedSecondFactors ?? []).find((factor) => factor.strategy === 'email_code') as
                    | { safeIdentifier?: string; safe_identifier?: string }
                    | undefined

                setSecondFactorEmail(emailFactor?.safeIdentifier ?? emailFactor?.safe_identifier ?? data.email)
                setRequiresSecondFactor(true)
                setFormError('A verification code was sent to your email. Enter it to continue.')
                return
            } else {
                setFormError('Login failed. Please try again.')
            }
        } catch (error) {
            setFormError(`Failed to login. Please try again. ${(error as Error).message}`)
        }
    }

    const verifySecondFactor = async (code: string) => {
        if (!isLoaded) return
        if (code.length !== 6) {
            setFormError('Please enter a valid 6-digit verification code.')
            return
        }

        setFormError(null)

        try {
            const result = await signIn.attemptSecondFactor({
                strategy: 'email_code',
                code
            })

            if (result.status === 'complete' && result.createdSessionId) {
                await setActive({ session: result.createdSessionId })
                setRequiresSecondFactor(false)
                setSecondFactorEmail(null)
                navigate('/dashboard')
                return
            }

            setFormError('Verification failed. Please check the code and try again.')
        } catch (error) {
            setFormError(`Failed to verify code. Please try again. ${(error as Error).message}`)
        }
    }

    const resendSecondFactorCode = async () => {
        if (!isLoaded || !requiresSecondFactor) return

        try {
            await signIn.prepareSecondFactor({ strategy: 'email_code' })
            setFormError('A new verification code was sent to your email.')
        } catch (error) {
            setFormError(`Failed to resend code. Please try again. ${(error as Error).message}`)
        }
    }

    const handleGoogleLogin = async (oauthStrategy: OAuthProvider) => {
        if (oauthStrategy !== 'oauth_google') {
            return
        }
        if (!isLoaded) return

        setLoadingProvider(oauthStrategy)
        try {
            await signIn.authenticateWithRedirect({
                strategy: oauthStrategy,
                redirectUrl: `${window.location.origin}/auth/sso-callback`,
                redirectUrlComplete: `${window.location.origin}/dashboard`
            })
        } catch (error) {
            setFormError(`Failed to login with Google. Please try again. ${(error as Error).message}`)
            throw error
        } finally {
            setLoadingProvider(null)
        }
    }

    return {
        onSubmit,
        verifySecondFactor,
        resendSecondFactorCode,
        handleGoogleLogin,
        loadingProvider,
        requiresSecondFactor,
        secondFactorEmail,
        formError,
        setFormError
    }
}

