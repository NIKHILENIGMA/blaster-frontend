import { useEffect, useMemo, useState, type FC } from 'react'

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import type { LeaderboardEntry } from '@/features/dashboard/types/dashboard'

type LeaderboardTableProps = {
    entries?: LeaderboardEntry[]
    isPending?: boolean
}

const PAGE_SIZE = 10

const LeaderboardTable: FC<LeaderboardTableProps> = ({ entries = [], isPending = false }) => {
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
        return <section className="rounded-xl bg-white p-6 text-center text-gray-500 shadow-2xl">Loading leaderboard...</section>
    }

    return (
        <section className="rounded-xl bg-white p-4 shadow-2xl sm:p-6">
            <header className="mb-6">
                <h2 className="font-heading text-2xl font-semibold">Global Challengers</h2>
            </header>

            <div className="hidden grid-cols-[80px_1.4fr_1fr_140px] items-center gap-3 border-b border-gray-200 pb-3 font-heading text-sm font-semibold uppercase text-black/80 sm:grid sm:text-md">
                <span>Rank</span>
                <span>Player</span>
                <span>Team</span>
                <span className="text-right">Points</span>
            </div>

            <div className="divide-y divide-gray-200">
                {pageEntries.length > 0 ? (
                    pageEntries.map((player) => {
                        const fullName = [player.firstName, player.lastName].filter(Boolean).join(' ').trim() || player.username
                        const playerAvatar =
                            player.profileImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(player.username)}&background=0D8ABC&color=fff&size=128`
                        const teamLogo =
                            player.teamLogo ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(player.teamName || 'Team')}&background=111827&color=fff&size=128`

                        return (
                            <div
                                key={player.username}
                                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-4 text-sm transition-colors hover:bg-gray-50 sm:grid-cols-[80px_1.4fr_1fr_140px] sm:text-md">
                                <div className="hidden font-semibold text-gray-700 sm:block">#{player.rank}</div>

                                <div className="flex min-w-0 items-center gap-3">
                                    <img
                                        src={playerAvatar}
                                        alt={fullName}
                                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                                    />

                                    <div className="min-w-0">
                                        <div className="mb-1 flex items-center gap-2 sm:hidden">
                                            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">#{player.rank}</span>
                                            <span className="min-w-0 truncate text-xs font-medium text-gray-500">{player.teamName || 'No team'}</span>
                                        </div>
                                        <p className="truncate font-medium">{fullName}</p>
                                        <p className="text-xs text-gray-500 truncate">@{player.username}</p>
                                    </div>
                                </div>

                                <div className="hidden min-w-0 items-center gap-2 sm:flex">
                                    <img
                                        src={teamLogo}
                                        alt={player.teamName || 'Team logo'}
                                        className="h-8 w-8 shrink-0 rounded-md border border-gray-200 object-cover"
                                    />
                                    <span className="truncate font-medium text-gray-700">{player.teamName || 'No team'}</span>
                                </div>

                                <div className="shrink-0 text-right font-bold text-blue-600">
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
