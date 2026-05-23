import { Link, useNavigate } from 'react-router'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import LoginForm from './login-form'
import SignupForm from './signup-form'

type AuthTab = 'login' | 'signup'

interface AuthDialogProps {
    defaultTab: AuthTab
    closeTo?: string
}

export default function AuthDialog({ defaultTab, closeTo = '/' }: AuthDialogProps) {
    const navigate = useNavigate()

    return (
        <Dialog
            open={true}
            onOpenChange={(open) => {
                if (!open) {
                    navigate(closeTo)
                }
            }}>
            <DialogContent className="z-[70] max-h-[calc(100vh-2rem)] w-[min(calc(100vw-2rem),23rem)] overflow-y-auto p-0 sm:max-w-[23rem]">
                <DialogTitle className="sr-only">Authentication</DialogTitle>
                <div className="flex flex-col items-center px-5 pb-7 pt-6 sm:px-6">
                    <Link
                        to="/"
                        className="mb-3 flex justify-center">
                        <img
                            src="https://res.cloudinary.com/djblasters/image/upload/v1778250313/fpl_simple_t9rjey.png"
                            alt="DJBlaster logo"
                            className="h-16 w-16 object-cover sm:h-24 sm:w-24"
                        />
                    </Link>
                    <Tabs
                        value={defaultTab}
                        onValueChange={(value) => {
                            navigate(value === 'signup' ? '/auth/signup' : '/auth/login')
                        }}
                        className="w-full">
                        <TabsList className="mb-4 grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Signup</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <LoginForm />
                        </TabsContent>
                        <TabsContent value="signup">
                            <SignupForm />
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}
