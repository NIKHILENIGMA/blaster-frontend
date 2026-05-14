import { Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'

const FranchiseBanner = () => {
    const navigate = useNavigate()
    return (
        <section className="relative w-full min-h-[calc(100vh-64px)] overflow-hidden">
            <img
                src="https://res.cloudinary.com/djblasters/image/upload/v1777744606/buy-players-background_1_fi4kh5.png"
                alt="background-cover"
                className="absolute top-[10%] lg:top-[25%] h-[55vh]  lg:w-full object-cover object-[50%_50%] lg:object-[50%_60%] lg:mx-auto"
            />
            <div className="absolute top-4 lg:top-[0%] bg-gradient-to-b from-white to-white/40 w-full h-40 lg:h-72 blur-md backdrop-blur-2xl" />
            <div className="absolute bottom-28 lg:bottom-[0%] bg-gradient-to-t from-white via-white/70 to-transparent w-full h-40 lg:h-32 blur-md" />
            <div className="relative z-10 max-w-1xl p-6 lg:ml-14 lg:mt-10 space-y-5 flex flex-col justify-between min-h-[80vh]">
                <div className="w-full space-y-2">
                    <div className="flex items-center justify-center text-xs text-primary gap-2.5 mb-4 w-full tracking-[0.25em]">
                        <span className="w-8 h-[1px] bg-primary" />
                        <span className="uppercase">Your Franchise is Ready</span>
                        <span className="w-8 h-[1px] bg-primary" />
                    </div>
                    <div className="space-y-0.5 font-extrabold text-5xl lg:text-5xl text-black text-center">
                        <h2>
                            Build your <br />{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#490dc9] via-[#9246D5] to-[#fc810f] text-clip">
                                dream squad!
                            </span>
                        </h2>
                    </div>
                    <div className="text-muted-foreground ld:text-md text-sm text-center">
                        <p className="">You haven't selected any players yet.</p>
                        <p className="">Pick 25 players across all roles and create a winning legacy!</p>
                    </div>
                </div>
                <div className="w-full flex lg:justify-center lg:items-center">
                    <Button
                        onClick={() => navigate('build')}
                        variant={'fantasyBtn'}
                        className="w-full lg:w-72 py-6 cursor-pointer font-bold text-lg lg:-translate-x-8">
                        <Sparkles /> Build Your Frachise
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default FranchiseBanner
