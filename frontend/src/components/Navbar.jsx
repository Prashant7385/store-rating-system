
import { LogOut, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Navbar({ onMenuClick }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-5 md:px-8">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="md:hidden text-gray-600"
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>

                <h1 className="text-lg font-semibold text-gray-900">
                    Store Rating System
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {user && (
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-medium text-gray-900">
                            {user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {user.role}
                        </p>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
                >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>
    )
}

export default Navbar
