import type { FC } from 'react'

interface LoaderProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    color?: string
    className?: string
}

const sizeClasses = {
    xs: {
        wrapper: 'h-10 w-10',
        logo: 'h-5 w-5',
        ring: 'border-2'
    },
    sm: {
        wrapper: 'h-14 w-14',
        logo: 'h-8 w-8',
        ring: 'border-2'
    },
    md: {
        wrapper: 'h-20 w-20',
        logo: 'h-12 w-12',
        ring: 'border-[3px]'
    },
    lg: {
        wrapper: 'h-28 w-28',
        logo: 'h-16 w-16',
        ring: 'border-4'
    },
    xl: {
        wrapper: 'h-36 w-36',
        logo: 'h-24 w-24',
        ring: 'border-[5px]'
    }
}

const Loader: FC<LoaderProps> = ({ size = 'md', color = 'border-primary', className }) => {
    const selectedSize = sizeClasses[size] || sizeClasses.md

    return (
        <div className={`flex items-center justify-center p-4 w-full h-full ${className || ''}`}>
            <div
                className={`relative ${selectedSize.wrapper}`}
                role="status"
                aria-label="loading">
                <span className="sr-only">Loading...</span>

                <div
                    className={`absolute inset-0 rounded-full ${selectedSize.ring} ${color} border-t-transparent border-l-transparent opacity-80 animate-spin`}
                    style={{ animationDuration: '1.6s' }}
                />
                <div
                    className={`absolute inset-1 rounded-full ${selectedSize.ring} ${color} border-r-transparent border-b-transparent opacity-35 animate-spin`}
                    style={{ animationDuration: '2.4s', animationDirection: 'reverse' }}
                />

                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                <div className="absolute inset-[18%] rounded-full bg-background shadow-[0_0_30px_rgba(41,98,255,0.24)]" />

                <div className="absolute inset-0 flex items-center justify-center animate-[loader-logo-float_1.8s_ease-in-out_infinite]">
                    <div className="relative overflow-hidden rounded-full">
                        <img
                            src="/logo.svg"
                            alt="Blasters Logo"
                            className={`${selectedSize.logo} object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.22)]`}
                            draggable={false}
                        />
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-90 mix-blend-screen blur-[1px] animate-[loader-logo-shine_1.9s_ease-in-out_infinite]"
                        />
                    </div>
                </div>

                <style>{`
                    @keyframes loader-logo-shine {
                        0% {
                            transform: translateX(-130%) skewX(-18deg);
                        }
                        52%, 100% {
                            transform: translateX(130%) skewX(-18deg);
                        }
                    }

                    @keyframes loader-logo-float {
                        0%, 100% {
                            transform: translateY(0) scale(1);
                        }
                        50% {
                            transform: translateY(-3px) scale(1.04);
                        }
                    }
                `}</style>
            </div>
        </div>
    )
}

export default Loader
