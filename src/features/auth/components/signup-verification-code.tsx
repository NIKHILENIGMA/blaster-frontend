import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
import { useState, type FC } from 'react'

import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

import { useSignup } from '../hooks/use-signup'

interface SignupVerificationCodeProps {
    setStep: (step: 'email' | 'code') => void
}

const SignupVerificationCode: FC<SignupVerificationCodeProps> = ({ setStep }) => {
    const [code, setCode] = useState<string>('')
    const [errorMsg, setErrorMsg] = useState<string>('')

    const { emailSendAddress, handleCodeChange, handleCodeVerification } = useSignup()

    return (
        <div className="flex flex-col space-y-4">
            <p className="text-center text-sm text-muted-foreground">
                A verification code has been sent to {emailSendAddress}. Please enter it below to verify your account.
            </p>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleCodeVerification(code, setStep, setErrorMsg)
                }}
                className="flex w-full flex-col items-center space-y-3 rounded-lg py-2">
                <InputOTP
                    value={code}
                    onChange={(value) => handleCodeChange(value, setCode, setErrorMsg)}
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
                {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
                <Button
                    variant={'default'}
                    type="submit"
                    disabled={code.length !== 6}
                    className="w-full">
                    Verify
                </Button>
                <Button
                    variant={'secondary'}
                    type="button"
                    disabled={code.length !== 6}
                    className="w-full">
                    Resend Code
                </Button>
            </form>
        </div>
    )
}

export default SignupVerificationCode
