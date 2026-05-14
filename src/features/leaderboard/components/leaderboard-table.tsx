import { useEffect, useMemo, useState, type FC } from 'react'

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import type { LeaderboardEntry } from '@/features/dashboard/types/dashboard'

type LeaderboardTableProps = {
    entries?: LeaderboardEntry[]
    isPending?: boolean
    currentUserId?: string
}

const PAGE_SIZE = 10

const LeaderboardTable: FC<LeaderboardTableProps> = ({ entries = [], isPending = false, currentUserId }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE))
    const pageEntries = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE
        return entries.slice(startIndex, startIndex + PAGE_SIZE)
    }, [currentPage, entries])

    useEffect(() => {
        setCurrentPage(1)
    }, [entries.length])

    const goToPage = (page: number) => {
        setCurrentPage(Math.min(Math.max(page, 1), totalPages))
    }

    if (isPending) {
        return <section className="rounded-xl bg-white p-8 text-center text-base text-gray-500 shadow-2xl">Loading leaderboard...</section>
    }

    return (
        <section className="rounded-xl bg-white p-4 shadow-2xl sm:p-6 lg:p-8">
            <header className="mb-6">
                <h2 className="font-heading text-2xl font-semibold lg:text-3xl">Global Challengers</h2>
            </header>

            <div className="hidden grid-cols-[96px_1.5fr_1.2fr_160px] items-center gap-5 border-b border-gray-200 pb-4 font-heading text-sm font-semibold uppercase text-black/80 sm:grid lg:text-base">
                <span>Rank</span>
                <span>Player</span>
                <span>Team</span>
                <span className="text-right">Points</span>
            </div>

            <div className="divide-y divide-gray-200">
                {pageEntries.length > 0 ? (
                    pageEntries.map((player) => {
                        const fullName = [player.firstName, player.lastName].filter(Boolean).join(' ').trim() || player.username
                        const playerAvatar = player.profileImage || 'https://res.cloudinary.com/dynbvnhcc/image/upload/v1775216051/Default-Men_pzwcaj.avif'
                        const teamLogo = player.teamLogo || 'https://res.cloudinary.com/djblasters/image/upload/v1778729286/ChatGPT_Image_May_14_2026_08_57_43_AM_sfqu1i.png'

                        return (
                            <div
                                key={player.userId}
                                className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-4 text-sm transition-colors sm:grid-cols-[96px_1.5fr_1.2fr_160px] sm:gap-5 sm:px-3 sm:text-base lg:py-5 lg:text-lg ${
                                    currentUserId && player.userId === currentUserId
                                        ? 'bg-primary/5 ring-2 ring-primary/50 hover:bg-primary/15'
                                        : 'hover:bg-gray-50'
                                }`}>
                                <div className="hidden font-semibold text-gray-700 sm:block">#{player.rank}</div>

                                <div className="flex min-w-0 items-center gap-3 lg:gap-4">
                                    <img
                                        src={playerAvatar}
                                        alt={fullName}
                                        className="h-10 w-10 shrink-0 rounded-full object-cover lg:h-14 lg:w-14"
                                    />

                                    <div className="min-w-0">
                                        <div className="mb-1 flex items-center gap-2 sm:hidden">
                                            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
                                                #{player.rank}
                                            </span>
                                            <span className="min-w-0 truncate text-xs font-medium text-gray-500">{player.teamName || 'No team'}</span>
                                        </div>
                                        <div className="flex min-w-0 items-center gap-2">
                                            <p className="truncate font-semibold">{fullName}</p>
                                            {currentUserId && player.userId === currentUserId ? (
                                                <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white lg:text-xs">
                                                    Me
                                                </span>
                                            ) : null}
                                        </div>
                                        <p className="truncate text-xs text-gray-900 lg:text-sm">@{player.username}</p>
                                    </div>
                                </div>

                                <div className="hidden min-w-0 items-center gap-3 sm:flex lg:gap-4">
                                    <img
                                        src={teamLogo}
                                        alt={player.teamName || 'Team logo'}
                                        className="h-10 w-10 shrink-0 rounded-md border border-gray-200 bg-white object-contain p-1 lg:h-14 lg:w-14"
                                    />
                                    <span className="truncate font-medium text-gray-700">{player.teamName || 'No team'}</span>
                                </div>

                                <div className="shrink-0 text-right font-bold text-blue-600 lg:text-xl">
                                    <span className="block">{player.totalScore.toLocaleString()}</span>
                                    <span className="block text-[11px] font-semibold uppercase text-gray-400 sm:hidden">pts</span>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <p className="py-6 text-sm text-gray-500">No additional leaderboard entries.</p>
                )}
            </div>

            {entries.length > PAGE_SIZE ? (
                <Pagination className="mt-6">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                aria-disabled={currentPage === 1}
                                className={currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}
                                onClick={(event) => {
                                    event.preventDefault()
                                    goToPage(currentPage - 1)
                                }}
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === currentPage}
                                    onClick={(event) => {
                                        event.preventDefault()
                                        goToPage(page)
                                    }}>
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                aria-disabled={currentPage === totalPages}
                                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : undefined}
                                onClick={(event) => {
                                    event.preventDefault()
                                    goToPage(currentPage + 1)
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            ) : null}
        </section>
    )
}

export default LeaderboardTable
