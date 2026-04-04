import { ArrowLeft, Home } from 'lucide-react'
import type { FC } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'

const NotFound: FC = () => {
    const navigate = useNavigate()

    const handleGoBack = () => {
        navigate(-1)
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
            <section className="relative overflow-hidden rounded-xl shadow-lg flex flex-col items-center justify-end text-foreground min-h-[90vh] w-full ">
                <img
                    src="https://res.cloudinary.com/dynbvnhcc/image/upload/v1775302659/banner-5_lzpcxx.png"
                    alt="not-found"
                    className="absolute inset-0 h-full w-full object-contain object-center opacity-90"
                />

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-3">
                    <Button
                        onClick={() => navigate('/')}
                        variant={'default'}>
                        <Home /> Go Home
                    </Button>
                    <Button
                        type="button"
                        onClick={handleGoBack}
                        variant={'secondary'}>
                        <ArrowLeft /> Go Back
                    </Button>
                </div>
            </section>
        </main>
    )
}

export default NotFound
