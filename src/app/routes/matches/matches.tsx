import type { FC } from 'react'

import Footer from '@/components/shared/footer'
import Header from '@/components/shared/header'

const fixtures = [
    { date: '22 Mar 2026', time: '7:30 PM', match: 'Mumbai Indians vs Chennai Super Kings', venue: 'Wankhede Stadium, Mumbai' },
    {
        date: '23 Mar 2026',
        time: '7:30 PM',
        match: 'Royal Challengers Bengaluru vs Kolkata Knight Riders',
        venue: 'M. Chinnaswamy Stadium, Bengaluru'
    },
    { date: '24 Mar 2026', time: '7:30 PM', match: 'Delhi Capitals vs Rajasthan Royals', venue: 'Arun Jaitley Stadium, Delhi' },
    { date: '25 Mar 2026', time: '7:30 PM', match: 'Sunrisers Hyderabad vs Punjab Kings', venue: 'Rajiv Gandhi Intl. Stadium, Hyderabad' },
    { date: '26 Mar 2026', time: '7:30 PM', match: 'Gujarat Titans vs Lucknow Super Giants', venue: 'Narendra Modi Stadium, Ahmedabad' }
]

const Matches: FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-background to-slate-100">
            <Header />
            <section className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6">
                <h2 className="mb-5 text-2xl font-bold font-heading tracking-tight text-slate-900 md:text-3xl">IPL Fixtures</h2>
                <ul className="m-0 grid list-none gap-4 p-0 font-body">
                    {fixtures.map((fixture) => (
                        <li
                            key={`${fixture.date}-${fixture.match}`}
                            className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                            <p className="m-0 text-base font-semibold text-slate-900 md:text-lg">{fixture.match}</p>
                            <p className="mt-1 text-sm font-medium text-slate-600 md:text-base">
                                {fixture.date} • {fixture.time}
                            </p>
                            <p className="mt-1 text-sm text-slate-500 md:text-base">{fixture.venue}</p>
                        </li>
                    ))}
                </ul>
            </section>
            <Footer />
        </div>
    )
}

export default Matches
