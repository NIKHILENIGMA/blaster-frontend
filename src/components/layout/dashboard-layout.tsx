import type { FC } from 'react'
import { Outlet } from 'react-router'

import Footer from '../shared/footer'
import Header from '../shared/header'
import Sidebar from '../shared/sidebar'

const DashboardLayout: FC = () => {
    return (
        <div className="w-full flex">
            <Sidebar />
            <div className="flex-1 w-full min-h-screen bg-background flex flex-col pb-24 lg:pb-0">
                <Header />
                <main className="flex-1">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    )
}

export default DashboardLayout
