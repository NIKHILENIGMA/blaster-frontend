import { useState, type FC } from 'react'
import { Link } from 'react-router'

import { useOAuth } from '../hooks/use-oauth'

import ChooseOptions from './choose-options'
import EmailSignup from './email-signup'
import SignupVerificationCode from './signup-verification-code'

type SignupStep = 'initial' | 'email' | 'code'

const SignupForm: FC = () => {
    const [step, setStep] = useState<SignupStep>('initial')
    const { loadingProvider, handleGoogleSignup } = useOAuth()

    return (
        <div className="relative w-full max-w-md p-6 flex flex-col z-50 font-body">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-semibold font-heading">
                    Join us today! <br /> Please <span className="text-primary">sign up</span> to create your account.
                </h1>
            </div>

            {step === 'initial' ? (
                <ChooseOptions
                    googleText="Sign up with Google"
                    emailBtnText="Sign up with Email"
                    onStepChange={setStep}
                    isLoading={loadingProvider}
                    onGoogleAuth={() => handleGoogleSignup('oauth_google')}
                />
            ) : step === 'email' ? (
                <EmailSignup setStep={setStep} />
            ) : step === 'code' ? (
                <SignupVerificationCode setStep={setStep} />
            ) : null}

            <div className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{' '}
                <Link
                    to="/auth/login"
                    className="text-primary">
                    Log in
                </Link>
            </div>
        </div>
    )
}

export default SignupForm
