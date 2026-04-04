import type { FC } from 'react'
import { useNavigate } from 'react-router'

interface LogoProps {
    redirectTo: string
    classes?: string
}

const Logo: FC<LogoProps> = ({ redirectTo, classes }) => {
    const navigate = useNavigate()
    return (
        <div
            className={`w-10 h-10 flex items-center justify-center cursor-pointer ${classes || ''}`}
            onClick={() => {
                navigate(redirectTo)
            }}>
            <img
                src="/fortune-logo.png"
                alt="Blasters Logo"
                className="w-8 h-8"
            />
        </div>
    )
}

export default Logo
