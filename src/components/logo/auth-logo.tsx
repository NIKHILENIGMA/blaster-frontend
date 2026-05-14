import { type FC } from 'react'
import { Link } from 'react-router'

const AuthLogo: FC<{ styles?: string }> = ({ styles }) => {
    return (
        <div className="absolute top-6 left-6">
            <Link to="/">
                <img
                    src="https://res.cloudinary.com/djblasters/image/upload/v1775299513/logo-fortune_qda5xe.png"
                    alt="logo"
                    className={`h-20 w-20 object-cover ${styles || ''}`}
                />
            </Link>
        </div>
    )
}

export default AuthLogo
