import { useState, type FC } from 'react'

import { Button } from '@/components/ui/button'
import { FcGoogle } from '@/shared/assets/icons'

import { useOAuth } from '../hooks/use-oauth'

import EmailSignup from './email-signup'
import SignupVerificationCode from './signup-verification-code'

type SignupStep = 'email' | 'code'

const SignupForm: FC = () => {
    const [step, setStep] = useState<SignupStep>('email')
    const { loadingProvider, handleGoogleSignup, formError } = useOAuth()

    return (
        <div className="relative z-50 flex w-full flex-col font-body">
            {step === 'email' ? (
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
                            onClick={() => handleGoogleSignup('oauth_google')}>
                            <FcGoogle size={20} />
                            Sign up with Google
                        </Button>
                    )}
                    {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
                    <div className="flex items-center">
                        <hr className="flex-grow border-gray-300" />
                        <span className="px-2 text-xs text-gray-400 sm:text-sm">OR</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>
                    <EmailSignup setStep={setStep} />
                </div>
            ) : step === 'code' ? (
                <SignupVerificationCode setStep={setStep} />
            ) : null}
        </div>
    )
}

export default SignupForm
