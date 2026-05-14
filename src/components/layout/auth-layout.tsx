import { type ReactNode, useEffect, useState } from 'react'

import AuthLogo from '@/components/logo/auth-logo'

interface AuthLayoutProps {
    children: ReactNode
}

const banners = [
    'https://res.cloudinary.com/djblasters/image/upload/v1775298926/banner-3_pidd2n.png',
    'https://res.cloudinary.com/djblasters/image/upload/v1775298575/banner-2_wtkahd.png',
    'https://res.cloudinary.com/djblasters/image/upload/v1775298209/login-screen_bftqeq.png',
    'https://res.cloudinary.com/djblasters/image/upload/v1775299209/banner-4_glknqz.png'
]

export default function AuthLayout({ children }: AuthLayoutProps) {
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
        }, 3500)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Left Section */}
            <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 lg:px-20">
                <AuthLogo />
                {children}
            </div>

            {/* Right Section - Background Image Placeholder */}
            <div className="hidden lg:flex w-1/2 items-center justify-center bg-[var(--right-bg)]">
                <div className="h-full w-full relative overflow-hidden">
                    {banners.map((banner, index) => (
                        <img
                            key={banner}
                            src={banner}
                            alt={`banner-${index + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                                index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
