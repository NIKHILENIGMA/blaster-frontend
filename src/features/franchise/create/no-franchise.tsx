import { type FC } from 'react'
import { IoInformationCircleOutline } from 'react-icons/io5'
import { RiTeamFill } from 'react-icons/ri'

import Header from '@/components/shared/header'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { CreateFranchiseDialog } from '../components/dialog/create-franchise'
import FranchiseInformation from '../components/dialog/franchise-information'
import { DETAILS, REWARDS } from '../constants/franchise-constants'

const NoFranchise: FC = () => {
    return (
        <div className="flex  flex-col mt-20 bg-amber-200">
            <Header />
            <main className="w-full relative">
                <section className="relative w-full min-h-[calc(100vh-64px)] overflow-hidden">
                    <img
                        src="https://res.cloudinary.com/dynbvnhcc/image/upload/v1777715584/background-image_xpar9c.png"
                        alt="background-cover"
                        className="absolute inset-0 lg:w-full h-full object-cover object-[80%_80%] lg:object-[50%_50%]"
                    />
                    {/* <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/40 to-transparent" /> */}

                    <div className="relative z-10 max-w-1xl p-6 lg:ml-14 lg:mt-10">
                        <span className="uppercase font-semibold text-xs lg:text-sm text-purple-800 bg-purple-500/10 px-2 py-1 rounded-sm">
                            no franchise yet
                        </span>
                        <div className="mt-2 space-y-0.2 font-extrabold text-3xl lg:text-5xl text-black truncate">
                            <h1>Create your franchise</h1>
                            <h1>
                                and{' '}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3c089c] via-[#b550b0] to-[#e7893d]">
                                    start your journey!
                                </span>
                            </h1>
                            <p className="font-medium text-sm text-muted-foreground tracking-tighter mt-2.5">
                                Build your dream squad of 25 players, <br /> compete all session long and win exciting rewards!
                            </p>
                        </div>
                    </div>

                    <div className="relative translate-y-12 min-h-72 z-10 w-full lg:w-2/6 lg:ml-14 px-8 flex flex-col space-y-4">
                        {DETAILS.map((detail, idx) => (
                            <div
                                key={idx + detail.title}
                                className="w-3/4 flex items-center justify-start p-2 space-x-2.5 lg:space-x-5 bg-white/40 backdrop-blur-xs rounded-md">
                                <div className="bg-purple-800/10 rounded-full p-2">
                                    <detail.icon
                                        className="flex items-center rounded-full text-purple-800"
                                        size={30}
                                    />
                                </div>

                                <div className="text-start flex flex-col">
                                    <h2 className="font-bold text-lg text-foreground w-full">{detail.title}</h2>
                                    <p className="font-normal text-sm text-[#2b3241] w-full">{detail.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="relative z-10 hidden lg:flex lg:w-[75%] lg:ml-14 p-6 mt-2 md:mt-2 mx-auto lg:mx-0">
                        <div className="bg-white/70 backdrop-blur-xs w-full rounded-2xl overflow-hidden p-4 lg:flex lg:items-center lg:gap-0">
                            {REWARDS.map((reward, idx) => (
                                <div
                                    key={idx + reward.title}
                                    className="flex-1 flex items-center justify-start p-4 space-x-3 lg:space-x-4">
                                    <div className="bg-purple-800/10 rounded-full p-2 flex-shrink-0">
                                        <reward.icon
                                            className="flex items-center rounded-full text-purple-800"
                                            size={30}
                                        />
                                    </div>
                                    <div className="text-start flex flex-col min-w-0">
                                        <h2 className="font-bold text-sm lg:text-base text-foreground">{reward.title}</h2>
                                        <p className="font-normal text-xs lg:text-sm text-[#2b3241]">{reward.description}</p>
                                    </div>
                                    {idx !== REWARDS.length - 1 && (
                                        <Separator
                                            orientation="vertical"
                                            className="mx-2 lg:mx-4 flex-shrink-0"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative z-10 w-full p-4 mx-auto mt-24 lg:mt-4 flex items-center justify-center space-x-2">
                        <CreateFranchiseDialog>
                            <Button
                                size={'lg'}
                                variant={'fantasyBtn'}
                                className="cursor-pointer flex items-center">
                                <RiTeamFill /> Create Franchise
                            </Button>
                        </CreateFranchiseDialog>
                        <FranchiseInformation>
                            <Button
                                size={'lg'}
                                variant={'outline'}
                                className="cursor-pointer flex items-center">
                                <IoInformationCircleOutline /> Learn More
                            </Button>
                        </FranchiseInformation>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default NoFranchise
