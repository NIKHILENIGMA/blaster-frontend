import { useSignUp } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import type { UseFormSetError } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router'

import type { SignupFormRequest } from '../types/auth'

type ClerkError = {
    message?: string
    longMessage?: string
    code?: string
    meta?: {
        paramName?: string
    }
}

type ClerkErrorResponse = {
    errors?: ClerkError[]
    message?: string
}

const SIGNUP_FIELD_BY_CLERK_PARAM: Record<string, keyof SignupFormRequest> = {
    email: 'email',
    email_address: 'email',
    emailAddress: 'email',
    password: 'password',
    first_name: 'firstName',
    firstName: 'firstName',
    last_name: 'lastName',
    lastName: 'lastName'
}

const getClerkErrors = (error: unknown): ClerkError[] => {
    if (typeof error !== 'object' || error === null) return []

    const response = error as ClerkErrorResponse
    return Array.isArray(response.errors) ? response.errors : []
}

const getClerkErrorMessage = (error: ClerkError) => {
    return error.longMessage || error.message || 'Signup failed. Please check your details and try again.'
}

export const useSignup = () => {
    const { isLoaded, signUp, setActive } = useSignUp()
    const { showBoundary } = useErrorBoundary()
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()

    // Handle invitation token from URL query parameters
    useEffect(() => {
        const token = searchParams.get('invitationToken') || null
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
    }, [searchParams, isLoaded, signUp, setSearchParams, showBoundary])

    const onSubmit = async (
        data: SignupFormRequest,
        clearErrors: () => void,
        reset: () => void,
        setError: UseFormSetError<SignupFormRequest>,
        setFormError: (error: string | null) => void,
        setStep: (step: 'email' | 'code') => void
    ) => {
        clearErrors()
        setFormError(null)
        try {
            if (!isLoaded) return
            await signUp.create({
                emailAddress: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                unsafeMetadata: {
                    invite_token: data.token
                }
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
            setStep('code')
            reset() // Clear form fields after successful submission
        } catch (error) {
            const clerkErrors = getClerkErrors(error)

            if (!clerkErrors.length) {
                const message = error instanceof Error ? error.message : 'Signup failed. Please check your details and try again.'
                setFormError(message)
                return
            }

            const formErrors: string[] = []

            clerkErrors.forEach((clerkError) => {
                const paramName = clerkError.meta?.paramName
                const fieldName = paramName ? SIGNUP_FIELD_BY_CLERK_PARAM[paramName] : undefined
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

            if (formErrors.length) {
                setFormError(formErrors.join(' '))
            }
        }
    }

    const handleCodeChange = (value: string, onCodeChange: (value: string) => void, onError: (error: string) => void) => {
        // If value contains only numbers, update code and clear error
        // Only allow numbers, no regex
        const isOnlyNumbers = value.split('').every((char) => char >= '0' && char <= '9')
        if (isOnlyNumbers) {
            onCodeChange(value)
            onError('')
        } else {
            onError('Only numbers are allowed')
        }
    }

    const handleCodeVerification = async (
        code: string,
        onStepChange: (step: 'email' | 'code') => void,
        onError: (error: string) => void
    ) => {
        if (!isLoaded) return
        if (code.length !== 6) {
            showBoundary(new Error('Please enter a valid 6-digit code.'))
            return
        }
        try {
            const completeSignup = await signUp.attemptEmailAddressVerification({ code })

            if (completeSignup.status !== 'complete') {
                showBoundary(new Error('Sign-up attempt failed, please try again.'))
                return
            }

            if (completeSignup.status === 'complete') {
                await setActive({ session: completeSignup.createdSessionId })
                navigate('/dashboard')
                onStepChange('email')
            }
        } catch (error) {
            const clerkErrors = getClerkErrors(error)
            const message = clerkErrors.length
                ? clerkErrors.map(getClerkErrorMessage).join(' ')
                : error instanceof Error
                  ? error.message
                  : 'Something went wrong during code verification.'
            onError(message)
        }
    }

    return {
        isLoaded,
        signUp,
        setActive,
        onSubmit,
        emailSendAddress: signUp?.emailAddress || '',
        handleCodeChange,
        handleCodeVerification
    }
}
