import { useEffect, useState, type FC } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { FaArrowRight } from 'react-icons/fa6'

const UPCOMING_MATCHES = [
    {
        id: 1,
        cover: 'https://m.media-amazon.com/images/M/MV5BZjA4NGI1OTctNDgyMy00YjI5LTkzMDMtMDI4MjBiNjgyOWQwXkEyXkFqcGc@._V1_.jpg'
    },
    {
        id: 2,
        cover: 'https://m.media-amazon.com/images/M/MV5BNzI2ZTkyZGEtOTY0Ny00Y2U3LTgyNDktN2Q4MDEyZTk1YWEzXkEyXkFqcGc@._V1_.jpg'
    },
    {
        id: 3,
        cover: 'https://img1.hotstarext.com/image/upload/f_auto/sources/r1/cms/prod/7716/1743347067716-i'
    }
]

const UpcomingCarousel: FC = () => {
    const [index, setIndex] = useState<number>(0)
    const [isMobile, setIsMobile] = useState<boolean>(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const visibleCards = isMobile ? 1 : 2
    const maxIndex = Math.max(UPCOMING_MATCHES.length - visibleCards, 0)

    const slidePercentage = isMobile ? 100 : 50

    const handleNext = () => {
        setIndex((prev) => Math.min(prev + 1, maxIndex))
    }

    const handlePrev = () => {
        setIndex((prev) => Math.max(prev - 1, 0))
    }
    return (
        <div className="w-full h-full ">
            <div className="flex text-center p-2">
                <h2 className="text-start text-2xl font-bold font-heading">Upcoming Matches</h2>
                <div className="flex items-center gap-1 ml-auto text-sm text-muted-foreground font-body">
                    <button
                        onClick={handlePrev}
                        disabled={index === 0}
                        className="p-4 rounded-full bg-[#2E7D3212] disabled:opacity-50">
                        <FaArrowLeft />
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={index === maxIndex}
                        className="p-4 rounded-full bg-[#2E7D3212] disabled:opacity-50">
                        <FaArrowRight />
                    </button>
                </div>
            </div>
            <div className="w-full overflow-hidden py-2">
                <div
                    className="flex transition-transform duration-500 ease-in-out "
                    style={{
                        transform: `translateX(-${index * slidePercentage}%)`
                    }}>
                    {UPCOMING_MATCHES.map((match) => (
                        <div
                            key={match.id}
                            className="min-w-full md:min-w-1/2 p-1">
                            <img
                                src={match.cover}
                                className="w-full h-72 rounded-2xl object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UpcomingCarousel
