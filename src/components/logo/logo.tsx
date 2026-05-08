import type { FC } from 'react'
import { useNavigate } from 'react-router'

interface LogoProps {
    redirectTo: string
    classes?: string
}

const Logo: FC<LogoProps> = ({ redirectTo, classes }) => {
    const navigate = useNavigate()

    return (
        <button
            type="button"
            className={`relative w-10 h-10 flex items-center justify-center overflow-hidden rounded-full cursor-pointer bg-transparent p-0 border-0 group ${classes || ''}`}
            onClick={() => {
                navigate(redirectTo)
            }}>
            <span className="sr-only">Blasters home</span>
            <img
                src="/logo.svg"
                alt="Blasters Logo"
                className="w-8 h-8 object-contain"
                draggable={false}
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/75 to-transparent opacity-80 mix-blend-screen blur-[1px] group-hover:animate-[logo-shine_1.1s_ease-out] motion-safe:animate-[logo-shine_2.8s_ease-in-out_infinite]"
            />
            <style>{`
                @keyframes logo-shine {
                    0% {
                        transform: translateX(-120%) skewX(-18deg);
                    }
                    45%, 100% {
                        transform: translateX(120%) skewX(-18deg);
                    }
                }
            `}</style>
        </button>
    )
}

export default Logo
