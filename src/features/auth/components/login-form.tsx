import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
import { Lock, Mail } from 'lucide-react'
import { useEffect, useState, type FC } from 'react'
import { useForm } from 'react-hook-form'

import { FormField } from '@/components'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { FcGoogle } from '@/shared/assets/icons'
import { loginSchema } from '@/shared/schema/auth-schema'

import { useLogin } from '../hooks/use-login'
import type { LoginFormRequest } from '../types/auth'

type LoginStep = 'email' | 'code'

const LoginForm: FC = () => {
    const [step, setStep] = useState<LoginStep>('email')
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
        formState: { errors },
        setError
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
        <div className="relative z-50 flex w-full flex-col font-body">
            <div className="flex flex-col gap-4">
                {step == 'email' ? (
                    <div className="w-full flex items-center justify-center">
                        <form
                            className="w-full"
                            onSubmit={handleSubmit((data) => onSubmit(data, setError))}>
                            <div className="flex flex-col gap-4">
                                {loadingProvider === 'oauth_google' ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full cursor-not-allowed gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                                        Redirecting to Google...
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full gap-2"
                                        onClick={() => handleGoogleLogin('oauth_google')}>
                                        <FcGoogle size={20} />
                                        Log in with Google
                                    </Button>
                                )}
                                <div className="flex items-center">
                                    <hr className="flex-grow border-gray-300" />
                                    <span className="px-2 text-xs text-gray-400 sm:text-sm">OR</span>
                                    <hr className="flex-grow border-gray-300" />
                                </div>
                                <FormField
                                    name="email"
                                    type="email"
                                    label="Email address"
                                    placeholder="johndoe@example.com"
                                    icon={Mail}
                                    iconPosition="left"
                                    register={register('email')}
                                    required={true}
                                    errors={errors.email}
                                />
                                <FormField
                                    name="password"
                                    type="password"
                                    label="Password"
                                    placeholder="**********"
                                    icon={Lock}
                                    iconPosition="left"
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
                            className="flex w-full flex-col items-center gap-4 rounded-lg py-4"
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
        </div>
    )
}

export default LoginForm
