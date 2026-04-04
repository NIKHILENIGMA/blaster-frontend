import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'

interface CarouselSlide {
    id: number
    title: string
    subtitle: string
    backgroundImage: string
    ctaText: string
    ctaAction: () => void
}

const slides: CarouselSlide[] = [
    {
        id: 1,
        title: 'IPL Champions League',
        subtitle: 'March 29, 2026 • 19:30 IST',
        backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(200,50,50,0.3))',
        ctaText: 'Create Team',
        ctaAction: () => {}
    },
    {
        id: 2,
        title: 'Mega Tournament Series',
        subtitle: 'Limited Time • Join Now',
        backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(50,150,200,0.3))',
        ctaText: 'View Match',
        ctaAction: () => {}
    },
    {
        id: 3,
        title: 'Live Match Happening Now',
        subtitle: 'Australia vs India • 1st Innings',
        backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(200,50,50,0.3))',
        ctaText: 'Create Team',
        ctaAction: () => {}
    }
]

const HeroCarousel = () => {
    const [current, setCurrent] = useState(0)
    const [isAutoPlay, setIsAutoPlay] = useState(true)

    useEffect(() => {
        if (!isAutoPlay) return

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlay])

    const next = () => {
        setCurrent((prev) => (prev + 1) % slides.length)
        setIsAutoPlay(false)
    }

    const prev = () => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
        setIsAutoPlay(false)
    }

    const goToSlide = (index: number) => {
        setCurrent(index)
        setIsAutoPlay(false)
    }

    const slide = slides[current]

    return (
        <div className="relative w-full overflow-hidden rounded-2xl">
            {/* Carousel container */}
            <div className="relative h-[100vh] md:h-[70vh] w-full bg-gradient-to-b from-slate-950 to-slate-900">
                {/* Background with gradient overlay */}
                <div
                    className="absolute inset-0 transition-all duration-500 ease-out"
                    style={{
                        background: 'url(./rr_vs_gt-banner-2.png) top/cover no-repeat, ' + slide.backgroundImage
                    }}
                />

                {/* Content overlay */}
                {/* <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-12 bg-gradient-to-t from-black via-black/50 to-transparent">
                    <div className="w-full max-w-2xl">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 leading-tight">{slide.title}</h1>
                        <p className="text-base md:text-lg text-gray-300 mb-6">{slide.subtitle}</p>
                        <Button
                            onClick={slide.ctaAction}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-lg font-semibold">
                            {slide.ctaText}
                        </Button>
                    </div>
                </div> */}

                {/* Navigation arrows */}
                <button
                    onClick={prev}
                    className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    aria-label="Previous slide">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <button
                    onClick={next}
                    className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    aria-label="Next slide">
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* Pause/Play indicator */}
                <div className="absolute bottom-6 left-6 z-20">
                    <button
                        onClick={() => setIsAutoPlay(!isAutoPlay)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur transition-colors">
                        <div className={`w-2 h-2 rounded-full ${isAutoPlay ? 'bg-green-500' : 'bg-gray-500'}`} />
                        <span className="text-xs text-white">{isAutoPlay ? 'Playing' : 'Paused'}</span>
                    </button>
                </div>
            </div>

            {/* Dots navigation */}
            <div className="flex justify-center gap-3 py-6 bg-slate-900/50 backdrop-blur">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all ${index === current ? 'bg-red-600 w-8' : 'bg-gray-600 hover:bg-gray-500 w-2'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default HeroCarousel
