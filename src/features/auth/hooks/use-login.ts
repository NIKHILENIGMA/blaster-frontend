import { useSignIn } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import type { UseFormSetError } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router'

import type { LoginFormRequest } from '../types/auth'

type OAuthProvider = 'oauth_google' | 'oauth_github'

type ClerkError = {
    message?: string
    longMessage?: string
    meta?: {
        paramName?: string
    }
}

type ClerkErrorResponse = {
    errors?: ClerkError[]
}

const LOGIN_FIELD_BY_CLERK_PARAM: Record<string, keyof LoginFormRequest> = {
    email: 'email',
    email_address: 'email',
    emailAddress: 'email'
}

const LOGIN_CREDENTIAL_PARAMS = new Set(['identifier', 'password'])
const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password.'
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
    oauth_failed: 'Google login could not be completed. Please try again.',
    oauth_incomplete: 'Google login was not completed. Please try again.',
    oauth_account_conflict: 'This Google account is already connected to another account. Try logging in with the original method.'
}

const getClerkErrors = (error: unknown): ClerkError[] => {
    if (typeof error !== 'object' || error === null) return []

    const response = error as ClerkErrorResponse
    return Array.isArray(response.errors) ? response.errors : []
}

const getClerkErrorMessage = (error: ClerkError) => {
    return error.longMessage || error.message || 'Login failed. Please check your details and try again.'
}

export const useLogin = () => {
    const { isLoaded, signIn, setActive } = useSignIn()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null)
    const [formError, setFormError] = useState<string | null>(null)
    const [requiresSecondFactor, setRequiresSecondFactor] = useState(false)
    const [secondFactorEmail, setSecondFactorEmail] = useState<string | null>(null)

    useEffect(() => {
        const authError = searchParams.get('auth_error')
        if (!authError) return

        setFormError(OAUTH_ERROR_MESSAGES[authError] ?? 'Google login could not be completed. Please try again.')
        setSearchParams((params) => {
            params.delete('auth_error')
            return params
        })
    }, [searchParams, setSearchParams])

    const onSubmit = async (data: LoginFormRequest, setError: UseFormSetError<LoginFormRequest>) => {
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
            const clerkErrors = getClerkErrors(error)

            if (!clerkErrors.length) {
                const message = error instanceof Error ? error.message : 'Login failed. Please check your details and try again.'
                setFormError(message)
                return
            }

            const formErrors: string[] = []
            let hasCredentialError = false

            clerkErrors.forEach((clerkError) => {
                const paramName = clerkError.meta?.paramName
                if (paramName && LOGIN_CREDENTIAL_PARAMS.has(paramName)) {
                    hasCredentialError = true
                    return
                }

                const fieldName = paramName ? LOGIN_FIELD_BY_CLERK_PARAM[paramName] : undefined
                const message = getClerkErrorMessage(clerkError)

                if (fieldName) {
                    setError(fieldName, {
                        type: 'server',
                        message
                    })
                    return
                }

                formErrors.push(message)
            })

            if (hasCredentialError) {
                setFormError(INVALID_CREDENTIALS_MESSAGE)
                return
            }

            if (formErrors.length) {
                setFormError(formErrors.join(' '))
            }
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
            const clerkErrors = getClerkErrors(error)
            const message = clerkErrors.length
                ? clerkErrors.map(getClerkErrorMessage).join(' ')
                : error instanceof Error
                  ? error.message
                  : 'Failed to verify code. Please try again.'
            setFormError(message)
        }
    }

    const resendSecondFactorCode = async () => {
        if (!isLoaded || !requiresSecondFactor) return

        try {
            await signIn.prepareSecondFactor({ strategy: 'email_code' })
            setFormError('A new verification code was sent to your email.')
        } catch (error) {
            const clerkErrors = getClerkErrors(error)
            const message = clerkErrors.length
                ? clerkErrors.map(getClerkErrorMessage).join(' ')
                : error instanceof Error
                  ? error.message
                  : 'Failed to resend code. Please try again.'
            setFormError(message)
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
                redirectUrl: `${window.location.origin}/auth/sso-callback?flow=login`,
                redirectUrlComplete: `${window.location.origin}/dashboard`
            })
        } catch (error) {
            const clerkErrors = getClerkErrors(error)
            const message = clerkErrors.length
                ? clerkErrors.map(getClerkErrorMessage).join(' ')
                : error instanceof Error
                  ? error.message
                  : 'Failed to login with Google. Please try again.'
            setFormError(message)
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
