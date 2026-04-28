import { Plus } from 'lucide-react'
import React from 'react'
import { FaStar } from 'react-icons/fa'
import { FaUserLarge } from 'react-icons/fa6'
import { IoMdTrophy } from 'react-icons/io'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'

const REQUIREMENTS = [
    {
        id: 1,
        title: 'Pick 25 Players',
        description: 'Build a full franchise squad while staying within the 2000-credit cycle budget.',
        color: '#2962FF12',
        icon: <FaUserLarge className="fill-primary" />
    },
    {
        id: 2,
        title: 'Manage Match Roles',
        description: 'Set Captain (4x), Vice-Captain (3x), and Impact Player (2.5x) for each fixture lineup.',
        color: '#FF6D0012',
        icon: <FaStar className="fill-secondary" />
    },
    {
        id: 3,
        title: 'Compete for Prizes',
        description: 'Earn points and climb the leaderboard to win exciting rewards.',
        color: '#2E7D3212',
        icon: <IoMdTrophy className="fill-[#2E7D32]" />
    }
]

type CreateTeamProps = {
    title?: string
    highlight?: string
    description?: string
    buttonLabel?: string
    actionPath?: string
    onActionClick?: () => void
}

const CreateTeam: React.FC<CreateTeamProps> = ({
    title = 'Ready to Build Your Dream Franchise?',
    highlight = 'Dream Franchise',
    description = 'You have not assembled your franchise squad for the active cycle yet. Start picking your 25-player roster to compete for the top spot on the leaderboard.',
    buttonLabel = 'Build Franchise Squad',
    actionPath = '/my-squad/create',
    onActionClick
}) => {
    const navigate = useNavigate()
    const hasHighlight = title.includes(highlight)

    const handleButtonClick = () => {
        if (onActionClick) {
            onActionClick()
        } else if (actionPath) {
            navigate(actionPath)
        }
    }

    return (
        <main className="flex flex-col items-center px-4 py-10">
            {/* Hero Section */}
            <section className="w-full max-w-4xl text-center">
                {/* Card / Illustration */}
                <div className="relative mx-auto w-full max-w-md sm:max-w-lg">
                    <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6">
                        <img
                            src="https://images.unsplash.com/photo-1593766827228-8737b4534aa6?q=80&w=1200"
                            alt="Cricket stadium"
                            className="rounded-2xl w-full h-40 sm:h-56 object-cover"
                        />
                    </div>

                    {/* Floating status badge */}
                    <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white shadow-md rounded-xl px-3 py-2 flex items-center gap-2 font-body">
                        <span className="text-red-500 text-lg">●</span>
                        <div className="text-left">
                            <p className="text-[10px] uppercase text-muted-foreground/70">Team Status</p>
                            <p className="text-xs font-semibold text-muted-foreground">Not Created</p>
                        </div>
                    </div>
                </div>

                {/* Heading */}
                <header className="mt-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight font-heading">
                        {hasHighlight ? (
                            <>
                                {title.replace(highlight, '')}
                                <span className="text-primary">{highlight}</span>
                            </>
                        ) : (
                            <span className="text-primary">{title}</span>
                        )}
                    </h1>

                    <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-xl mx-auto font-body">
                        {description}
                    </p>
                </header>

                {/* CTA */}
                <div className="mt-6">
                    <Button
                        size="lg"
                        variant="default"
                        onClick={handleButtonClick}>
                        <Plus />
                        {buttonLabel}
                    </Button>
                </div>
            </section>

            {/* Steps Section */}
            <section className="w-full max-w-5xl mt-12">
                <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
                    {/* Step 1 */}
                    {REQUIREMENTS.map((requirement, idx) => (
                        <article
                            key={requirement.id + idx}
                            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                            <div
                                className="w-10 h-10 flex items-center justify-center rounded-lg mb-4"
                                style={{
                                    backgroundColor: requirement.color
                                }}>
                                {requirement.icon}
                            </div>
                            <h3 className="font-semibold mb-1 font-heading">{requirement.title}</h3>
                            <p className="text-sm text-gray-500 font-body">{requirement.description}</p>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    )
}

export default CreateTeam
