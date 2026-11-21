
import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    Store,
    UserPlus,
    LockKeyhole,
    X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Sidebar({ open, onClose }) {
    const { user } = useAuth()

    const navigation = {
        ADMIN: [
            {
                name: 'Dashboard',
                path: '/admin/dashboard',
                icon: LayoutDashboard
            },
            {
                name: 'Users',
                path: '/admin/users',
                icon: Users
            },
            {
                name: 'Stores',
                path: '/admin/stores',
                icon: Store
            },
            {
                name: 'Create User',
                path: '/admin/users/create',
                icon: UserPlus
            },
            {
                name: 'Change Password',
                path: '/admin/change-password',
                icon: LockKeyhole
            }
        ],

        USER: [
            {
                name: 'Dashboard',
                path: '/user/dashboard',
                icon: LayoutDashboard
            },
            {
                name: 'Change Password',
                path: '/user/change-password',
                icon: LockKeyhole
            }
        ],

        OWNER: [
            {
                name: 'Dashboard',
                path: '/owner/dashboard',
                icon: LayoutDashboard
            },
            {
                name: 'Change Password',
                path: '/owner/change-password',
                icon: LockKeyhole
            }
        ]
    }

    const links = navigation[user?.role] || []

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#252D27] text-white flex flex-col transform transition-transform duration-200 md:translate-x-0 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
                    <span className="text-lg font-semibold">
                        RatePoint
                    </span>

                    <button
                        onClick={onClose}
                        className="md:hidden text-gray-300"
                        aria-label="Close menu"
                    >
                        <X size={21} />
                    </button>
                </div>

                <div className="px-5 py-6">
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">
                        Main Menu
                    </p>

                    <nav className="space-y-2">
                        {links.map((item) => {
                            const Icon = item.icon

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                                            isActive
                                                ? 'bg-[#647D68] text-white'
                                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                        }`
                                    }
                                >
                                    <Icon size={19} />
                                    {item.name}
                                </NavLink>
                            )
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-5 border-t border-white/10">
                    <p className="text-xs text-gray-400">
                        Store Rating System
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Manage and review stores
                    </p>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
