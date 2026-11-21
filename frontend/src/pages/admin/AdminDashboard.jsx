
import { useEffect, useState } from 'react'
import { Users, Store, Star, RefreshCw, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchStats = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await api.get('/admin/dashboard')
            setStats(response.data.stats)
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load dashboard statistics.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    const cards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            description: 'Registered platform users',
            path: '/admin/users'
        },
        {
            title: 'Total Stores',
            value: stats.totalStores,
            icon: Store,
            description: 'Stores registered on the platform',
            path: '/admin/stores'
        },
        {
            title: 'Total Ratings',
            value: stats.totalRatings,
            icon: Star,
            description: 'Ratings submitted by users',
            path: '/admin/stores'
        }
    ]

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-[#647D68]">
                        ADMINISTRATION
                    </p>
                    <h1 className="text-2xl md:text-3xl font-semibold text-[#252D27] mt-2">
                        Dashboard Overview
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Monitor users, stores, and platform activity.
                    </p>
                </div>

                <button
                    onClick={fetchStats}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-white transition"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? 'animate-spin' : ''}
                    />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                    <RefreshCw
                        size={25}
                        className="animate-spin mx-auto text-[#647D68]"
                    />
                    <p className="text-gray-500 mt-3">
                        Loading statistics...
                    </p>
                </div>
            ) : !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {cards.map((card) => {
                        const Icon = card.icon

                        return (
                            <Link
                                key={card.title}
                                to={card.path}
                                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#647D68] hover:shadow-sm transition"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="w-11 h-11 rounded-xl bg-[#EEF2ED] text-[#647D68] flex items-center justify-center">
                                        <Icon size={22} />
                                    </div>
                                    <ArrowUpRight
                                        size={18}
                                        className="text-gray-400"
                                    />
                                </div>

                                <p className="text-sm text-gray-500 mt-5">
                                    {card.title}
                                </p>

                                <h2 className="text-3xl font-semibold text-[#252D27] mt-1">
                                    {card.value}
                                </h2>

                                <p className="text-xs text-gray-400 mt-2">
                                    {card.description}
                                </p>
                            </Link>
                        )
                    })}
                </div>
            )}

            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-5">
                    Quick Actions
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Link
                        to="/admin/users/create"
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#647D68] transition"
                    >
                        <Users className="text-[#647D68]" size={24} />
                        <h3 className="font-semibold text-gray-900 mt-4">
                            Create New User
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">
                            Register a USER or OWNER account.
                        </p>
                    </Link>

                    <Link
                        to="/admin/stores"
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#647D68] transition"
                    >
                        <Store className="text-[#647D68]" size={24} />
                        <h3 className="font-semibold text-gray-900 mt-4">
                            Manage Stores
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">
                            View stores and register new stores.
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
