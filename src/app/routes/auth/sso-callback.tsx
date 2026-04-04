import { useSignIn, useSignUp } from '@clerk/clerk-react'
import { useEffect, type FC } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { useNavigate } from 'react-router'

const SSOCallback: FC = () => {
    const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp()
    const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn()
    const navigate = useNavigate()
    const { showBoundary } = useErrorBoundary()

    useEffect(() => {
        if (!signUpLoaded || !signInLoaded) return

        const complete = async () => {
            try {
                if (signIn.status === 'complete' && signIn.createdSessionId) {
                    await setSignInActive({ session: signIn.createdSessionId })
                    navigate('/dashboard')
                    return
                }

                if (signUp.status === 'complete' && signUp.createdSessionId) {
                    await setSignUpActive({ session: signUp.createdSessionId })
                    navigate('/dashboard')
                    return
                }

                navigate('/auth/login')
            } catch (err) {
                showBoundary(err as Error)
                navigate('/auth/login')
            }
        }

        complete()
    }, [signUpLoaded, signInLoaded, signUp, signIn, setSignUpActive, setSignInActive, navigate, showBoundary])
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-background text-foreground font-body">
            <h2 className="mb-4 text-2xl font-semibold text-muted-foreground">Signing you in with SSO...</h2>
            <p className="text-gray-600">Please wait while we complete your authentication.</p>
        </div>
    )
}

export default SSOCallback
