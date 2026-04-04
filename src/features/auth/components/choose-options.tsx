import { type FC } from 'react'

import { Button } from '@/components/ui/button'
import { FcGoogle, Mail } from '@/shared/assets/icons'

interface ChooseLoginProps {
    emailBtnText: string
    googleText?: string
    githubText?: string
    isLoading?: 'oauth_google' | 'oauth_github' | null
    onStepChange: (step: 'email' | 'initial') => void
    onGoogleAuth: () => void
    onGithubAuth?: () => void
}

const ChooseOptions: FC<ChooseLoginProps> = ({ onStepChange, isLoading, emailBtnText, googleText, onGoogleAuth }) => {
    return (
        <div className="w-full flex flex-col items-center">
            <Button
                onClick={() => onStepChange('email')}
                variant={'outline'}
                className="space-x-1.5 w-full">
                <Mail /> <span>{emailBtnText}</span>
            </Button>
            <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="px-2 text-sm text-gray-400">OR</span>
                <hr className="flex-grow border-gray-300" />
            </div>
            <div className="space-y-3 w-full flex flex-col">
                {isLoading === 'oauth_google' ? (
                    <Button
                        variant="outline"
                        className="space-x-1.5 cursor-not-allowed">
                        <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></span>
                        Redirecting to Google...
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        className="space-x-1.5"
                        disabled={!googleText}
                        onClick={onGoogleAuth}>
                        <FcGoogle size={20} />
                        {googleText}
                    </Button>
                )}
            </div>
        </div>
    )
}

export default ChooseOptions
