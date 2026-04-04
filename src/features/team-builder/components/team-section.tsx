import type { FC, ReactNode } from 'react'

interface TeamSectionProps {
    title: string
    count: string
    children: ReactNode
}

const TeamSection: FC<TeamSectionProps> = ({ title, count, children }) => {
    return (
        <section className="mb-8">
            <header className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-700">{title}</h2>
                <span className="text-xs text-gray-400">{count}</span>
            </header>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">{children}</div>
        </section>
    )
}

export default TeamSection
