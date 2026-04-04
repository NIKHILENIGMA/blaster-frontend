import { useState } from 'react'

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination'

export function LeaderboardPagination() {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = 5

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
            // Scroll to table on mobile
            const element = document.querySelector('h2')
            element?.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const getPageNumbers = () => {
        const pages = []
        const showEllipsisLeft = currentPage > 3
        const showEllipsisRight = currentPage < totalPages - 2

        if (showEllipsisLeft) {
            pages.push(1)
            pages.push('ellipsis-left')
        } else {
            for (let i = 1; i <= Math.min(3, totalPages); i++) {
                pages.push(i)
            }
        }

        if (!showEllipsisLeft && !showEllipsisRight) {
            for (let i = 1; i <= totalPages; i++) {
                if (!pages.includes(i)) pages.push(i)
            }
        } else if (currentPage > 3 && currentPage < totalPages - 2) {
            pages.push(currentPage - 1)
            pages.push(currentPage)
            pages.push(currentPage + 1)
        }

        if (showEllipsisRight) {
            pages.push('ellipsis-right')
            pages.push(totalPages)
        } else if (!showEllipsisLeft) {
            for (let i = Math.max(1, totalPages - 2); i <= totalPages; i++) {
                if (!pages.includes(i)) pages.push(i)
            }
        }

        return pages
    }

    return (
        <div className="flex justify-center mt-8">
            <Pagination>
                <PaginationContent className="flex flex-wrap gap-1 justify-center">
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                        />
                    </PaginationItem>

                    {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                            {page === 'ellipsis-left' || page === 'ellipsis-right' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    onClick={() => handlePageChange(page as number)}
                                    isActive={currentPage === page}
                                    className={`cursor-pointer transition-all duration-200 ${
                                        currentPage === page ? 'bg-primary text-white border-border' : 'hover:bg-primary/10'
                                    }`}>
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            <div className="text-sm text-slate-400 ml-4 flex items-center">
                Page {currentPage} of {totalPages}
            </div>
        </div>
    )
}
