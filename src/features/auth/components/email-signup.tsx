import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { FormField } from '@/components'
import { Button } from '@/components/ui/button'
import { signupSchema } from '@/shared/schema/auth-schema'

import { useSignup } from '../hooks/use-signup'
import type { SignupFormRequest } from '../types/auth'

interface EmailSignupProps {
    setStep: (step: 'email' | 'code') => void
}

const EmailSignup = ({ setStep }: EmailSignupProps) => {
    const [formError, setFormError] = useState<string | null>(null)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        clearErrors,
        reset,
        setError
    } = useForm<SignupFormRequest>({
        resolver: zodResolver(signupSchema),
        mode: 'onBlur',
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        }
    })

    const { onSubmit } = useSignup()

    return (
        <div className="flex flex-col space-y-4">
            <form
                onSubmit={handleSubmit((data) => onSubmit(data, clearErrors, reset, setError, setFormError, setStep))}
                className="w-full">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <FormField
                        label="First Name"
                        name="firstName"
                        placeholder="First Name"
                        icon={User}
                        iconPosition="left"
                        register={register('firstName')}
                        required={true}
                        errors={errors.firstName}
                    />
                    <FormField
                        label="Last Name"
                        name="lastName"
                        placeholder="Last Name"
                        icon={User}
                        iconPosition="left"
                        register={register('lastName')}
                        required={true}
                        errors={errors.lastName}
                    />
                </div>
                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    icon={Mail}
                    iconPosition="left"
                    register={register('email')}
                    required={true}
                    errors={errors.email}
                />
                <FormField
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="*********"
                    icon={Lock}
                    iconPosition="left"
                    register={register('password')}
                    required={true}
                    errors={errors.password}
                />
                <div id="clerk-captcha"></div>
                {formError ? <p className="mt-2 text-sm text-red-600">{formError}</p> : null}
                <div className="mt-4 flex flex-col space-y-2">
                    <Button
                        variant={'default'}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full">
                        {isSubmitting ? 'Signing up...' : 'Sign Up'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default EmailSignup
