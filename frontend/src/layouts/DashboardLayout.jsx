
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-[#F7F6F2] flex">
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 min-w-0 flex flex-col">
                <Navbar
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 p-5 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout
