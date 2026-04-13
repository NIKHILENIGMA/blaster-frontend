import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
import { useEffect, useState, type FC } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'

import { FormField } from '@/components'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { loginSchema } from '@/shared/schema/auth-schema'

import { useLogin } from '../hooks/use-login'
import type { LoginFormRequest } from '../types/auth'

import ChooseOptions from './choose-options'

type LoginStep = 'initial' | 'email' | 'code'

const LoginForm: FC = () => {
    const [step, setStep] = useState<LoginStep>('initial')
    const [code, setCode] = useState('')
    const {
        onSubmit,
        verifySecondFactor,
        resendSecondFactorCode,
        handleGoogleLogin,
        loadingProvider,
        requiresSecondFactor,
        secondFactorEmail,
        formError
    } = useLogin()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormRequest>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        if (requiresSecondFactor) {
            setStep('code')
        }
    }, [requiresSecondFactor])

    return (
        <div className="relative w-full max-w-md p-6 flex flex-col z-50 font-body">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-semibold font-heading">
                    Welcome back! Please <span className="text-primary">login</span> to your account.
                </h1>
            </div>

            <div className="flex flex-col gap-4">
                {step == 'initial' ? (
                    <ChooseOptions
                        googleText="Log in with Google"
                        emailBtnText="Log in with Email"
                        onStepChange={setStep}
                        isLoading={loadingProvider}
                        onGoogleAuth={() => handleGoogleLogin('oauth_google')}
                    />
                ) : step == 'email' ? (
                    <div className="w-full flex items-center justify-center">
                        <form
                            className="w-full max-w-sm"
                            onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-4">
                                <FormField
                                    name="email"
                                    type="email"
                                    label="Email address"
                                    placeholder="johndoe@example.com"
                                    register={register('email')}
                                    required={true}
                                    errors={errors.email}
                                />
                                <FormField
                                    name="password"
                                    type="password"
                                    label="Password"
                                    placeholder="**********"
                                    register={register('password')}
                                    required={true}
                                    errors={errors.password}
                                />
                                <Button
                                    type="submit"
                                    className="w-full">
                                    Login
                                </Button>
                                {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
                            </div>
                        </form>
                    </div>
                ) : step == 'code' ? (
                    <div className="w-full flex items-center justify-center">
                        <form
                            className="w-full max-w-sm rounded-lg shadow py-4 px-3 flex flex-col items-center gap-4"
                            onSubmit={(event) => {
                                event.preventDefault()
                                verifySecondFactor(code)
                            }}>
                            <p className="text-center text-sm text-muted-foreground">
                                Enter the 6-digit code sent to {secondFactorEmail ?? 'your email'}.
                            </p>
                            <InputOTP
                                value={code}
                                onChange={setCode}
                                maxLength={6}
                                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            {formError ? <p className="text-sm text-red-600 text-center">{formError}</p> : null}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={code.length !== 6}>
                                Verify code
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full"
                                onClick={resendSecondFactorCode}>
                                Resend code
                            </Button>
                        </form>
                    </div>
                ) : null}
            </div>

            <div className="text-center text-sm text-gray-500 mt-6">
                Don’t have an account yet?{' '}
                <Link
                    to="/auth/signup"
                    className="text-primary">
                    Sign up
                </Link>
            </div>
        </div>
    )
}

export default LoginForm
