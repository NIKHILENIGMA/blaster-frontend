import { useSignIn, useSignUp } from '@clerk/clerk-react'
import { useEffect, type FC } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

const SSOCallback: FC = () => {
    const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp()
    const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        if (!signUpLoaded || !signInLoaded) return

        const flow = searchParams.get('flow')
        const authPath = flow === 'signup' ? '/auth/signup' : '/auth/login'

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

                navigate(`${authPath}?auth_error=oauth_incomplete`, { replace: true })
            } catch {
                navigate(`${authPath}?auth_error=oauth_failed`, { replace: true })
            }
        }

        complete()
    }, [signUpLoaded, signInLoaded, signUp, signIn, setSignUpActive, setSignInActive, navigate, searchParams])
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-background text-foreground font-body">
            <h2 className="mb-4 text-2xl font-semibold text-muted-foreground">Signing you in with SSO...</h2>
            <p className="text-gray-600">Please wait while we complete your authentication.</p>
        </div>
    )
}

export default SSOCallback
