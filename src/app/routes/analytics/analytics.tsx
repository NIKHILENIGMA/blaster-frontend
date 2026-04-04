import type { FC } from 'react'

import Footer from '@/components/shared/footer'
import Header from '@/components/shared/header'

const Analytics: FC = () => {
    return (
        <div className="bg-neutral-background">
            <Header />
            <main className="min-h-screen flex items-center justify-center">
                <div className="max-w-xl text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Analytics</p>
                    <h1 className="mt-3 text-4xl font-bold text-gray-900">Coming Soon</h1>
                    <p className="mt-4 text-base text-gray-600">We&apos;re building this page and it will be available soon.</p>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Analytics
