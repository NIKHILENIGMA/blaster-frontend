import type { FC } from 'react'

import { Badge } from '@/components/ui/badge'

interface PlayerCardProps {
    name: string
    credits: number
    tag: string
    highlight?: boolean
    badge?: string
    profilePicUrl?: string
    isCaptain?: boolean
    isViceCaptain?: boolean
}

const PlayerCard: FC<PlayerCardProps> = ({ name, credits, tag, highlight, badge, profilePicUrl, isCaptain, isViceCaptain }) => {
    return (
        <article
            className={`relative bg-white rounded-2xl p-4 text-center shadow-sm transition hover:shadow-md ${
                highlight ? 'ring-2 ring-blue-400' : ''
            }`}>
            {/* Badge */}
            {badge && <span className="absolute top-2 right-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{badge}</span>}
            {/* Avatar */}
            <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gray-200">
                {profilePicUrl !== '' ? (
                    <img
                        src={profilePicUrl}
                        alt={name}
                        className="w-full h-full object-cover rounded-xl"
                    />
                ) : (
                    <img
                        src={'./shadow-image.png'}
                        alt={name}
                        className="w-full h-full object-cover rounded-xl"
                    />
                )}
            </div>
            <h3 className="font-medium text-sm">{name}</h3>{' '}
            {isCaptain && (
                <Badge
                    variant="default"
                    className="ml-1 absolute top-2 left-2">
                    C
                </Badge>
            )}{' '}
            {isViceCaptain && (
                <Badge
                    variant="secondary"
                    className="ml-1 absolute top-2 left-2">
                    VC
                </Badge>
            )}
            <p className="text-xs text-gray-400">{credits} Points</p>
            <span className="inline-block mt-2 text-[10px] px-2 py-1 bg-primary/10 text-primary rounded-full">{tag}</span>
        </article>
    )
}

export default PlayerCard
