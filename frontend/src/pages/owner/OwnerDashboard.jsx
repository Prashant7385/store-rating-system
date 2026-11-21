
import { useEffect, useState } from 'react'
import {
    Store,
    Star,
    Users,
    MessageSquare,
    MapPin,
    Mail,
    RefreshCw,
    ChevronRight,
    CalendarDays
} from 'lucide-react'

import api from '../../services/api'
import RatingStars from '../../components/RatingStars'

function OwnerDashboard() {
    const [dashboard, setDashboard] = useState({
        total_stores: 0,
        total_ratings: 0,
        average_rating: 0
    })

    const [stores, setStores] = useState([])
    const [selectedStore, setSelectedStore] = useState(null)
    const [ratings, setRatings] = useState([])

    const [loading, setLoading] = useState(true)
    const [ratingsLoading, setRatingsLoading] = useState(false)
    const [error, setError] = useState('')
    const [ratingsError, setRatingsError] = useState('')

    const fetchDashboard = async () => {
        setLoading(true)
        setError('')

        try {
            const [dashboardResponse, storesResponse] = await Promise.all([
                api.get('/owner/dashboard'),
                api.get('/owner/stores')
            ])

            setDashboard(dashboardResponse.data.dashboard)
            setStores(storesResponse.data.stores)
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load dashboard information.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboard()
    }, [])

    const fetchStoreRatings = async (store) => {
        setSelectedStore(store)
        setRatings([])
        setRatingsError('')
        setRatingsLoading(true)

        try {
            const response = await api.get(
                `/owner/stores/${store.id}/ratings`
            )

            setRatings(response.data.ratings)
        } catch (err) {
            setRatingsError(
                err.response?.data?.message ||
                'Unable to load store ratings.'
            )
        } finally {
            setRatingsLoading(false)
        }
    }

    const formatDate = (date) => {
        if (!date) return '—'

        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const stats = [
        {
            title: 'Total Stores',
            value: dashboard.total_stores,
            icon: Store,
            description: 'Stores under your ownership'
        },
        {
            title: 'Total Ratings',
            value: dashboard.total_ratings,
            icon: MessageSquare,
            description: 'Ratings received from customers'
        },
        {
            title: 'Average Rating',
            value: Number(dashboard.average_rating).toFixed(2),
            icon: Star,
            description: 'Average across your stores'
        }
    ]

    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Page Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-[#647D68]">
                        STORE OWNER
                    </p>

                    <h1 className="text-2xl md:text-3xl font-semibold text-[#252D27] mt-2">
                        Owner Dashboard
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Monitor your stores and customer feedback.
                    </p>
                </div>

                <button
                    onClick={fetchDashboard}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-white transition disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? 'animate-spin' : ''}
                    />
                    Refresh
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Dashboard Statistics */}
            {loading ? (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                    <RefreshCw
                        size={25}
                        className="animate-spin mx-auto text-[#647D68]"
                    />
                    <p className="text-gray-500 mt-3">
                        Loading dashboard...
                    </p>
                </div>
            ) : !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {stats.map((stat) => {
                        const Icon = stat.icon

                        return (
                            <div
                                key={stat.title}
                                className="bg-white border border-gray-200 rounded-xl p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-11 h-11 rounded-xl bg-[#EEF2ED] flex items-center justify-center text-[#647D68]">
                                        <Icon size={22} />
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 mt-5">
                                    {stat.title}
                                </p>

                                <h2 className="text-3xl font-semibold text-[#252D27] mt-1">
                                    {stat.value}
                                </h2>

                                <p className="text-xs text-gray-400 mt-2">
                                    {stat.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Store List */}
            <section>
                <div className="mb-5">
                    <h2 className="text-xl font-semibold text-gray-900">
                        My Stores
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Select a store to view its customer ratings.
                    </p>
                </div>

                {loading ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500">
                        Loading stores...
                    </div>
                ) : !error && stores.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                        <Store
                            size={38}
                            className="mx-auto text-gray-300"
                        />

                        <h3 className="text-lg font-semibold text-gray-800 mt-4">
                            No stores assigned
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                            No stores are currently associated with your account.
                        </p>
                    </div>
                ) : (
                    !error && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {stores.map((store) => {
                                const isSelected =
                                    selectedStore?.id === store.id

                                return (
                                    <button
                                        key={store.id}
                                        onClick={() => fetchStoreRatings(store)}
                                        className={`text-left bg-white border rounded-xl p-6 transition ${
                                            isSelected
                                                ? 'border-[#647D68] ring-2 ring-[#647D68]/10'
                                                : 'border-gray-200 hover:border-[#647D68]'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-[#EEF2ED] flex items-center justify-center text-[#647D68]">
                                                    <Store size={23} />
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {store.name}
                                                    </h3>

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {store.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <ChevronRight
                                                size={20}
                                                className="text-gray-400 shrink-0"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-5">
                                            <MapPin size={16} />
                                            <span>{store.address}</span>
                                        </div>

                                        <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Average Rating
                                                </p>

                                                <div className="flex items-center gap-2 mt-2">
                                                    <Star
                                                        size={17}
                                                        className="text-[#C49A55]"
                                                        fill="currentColor"
                                                    />

                                                    <span className="font-semibold text-gray-900">
                                                        {Number(store.average_rating).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">
                                                    Total Ratings
                                                </p>

                                                <p className="font-semibold text-gray-900 mt-2">
                                                    {store.total_ratings}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-xs text-[#647D68] font-medium mt-5">
                                            View customer ratings
                                        </p>
                                    </button>
                                )
                            })}
                        </div>
                    )
                )}
            </section>

            {/* Customer Ratings */}
            {selectedStore && (
                <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-medium text-[#647D68]">
                                    CUSTOMER FEEDBACK
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mt-2">
                                    {selectedStore.name}
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Customer ratings for this store
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Users size={17} />
                                {ratings.length} ratings
                            </div>
                        </div>
                    </div>

                    {ratingsLoading ? (
                        <div className="p-12 text-center">
                            <RefreshCw
                                size={24}
                                className="animate-spin mx-auto text-[#647D68]"
                            />

                            <p className="text-gray-500 mt-3">
                                Loading customer ratings...
                            </p>
                        </div>
                    ) : ratingsError ? (
                        <div className="p-6">
                            <p className="text-sm text-red-600">
                                {ratingsError}
                            </p>
                        </div>
                    ) : ratings.length === 0 ? (
                        <div className="p-12 text-center">
                            <MessageSquare
                                size={35}
                                className="mx-auto text-gray-300"
                            />

                            <h3 className="font-semibold text-gray-800 mt-4">
                                No ratings yet
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">
                                Customer ratings will appear here when submitted.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {ratings.map((rating) => (
                                <div
                                    key={rating.id}
                                    className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-11 h-11 rounded-full bg-[#EEF2ED] flex items-center justify-center text-[#647D68] shrink-0">
                                            <Users size={19} />
                                        </div>

                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {rating.user_name}
                                            </h3>

                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                <Mail size={14} />
                                                {rating.user_email}
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                                                <CalendarDays size={14} />
                                                Rated on {formatDate(rating.created_at)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sm:text-right">
                                        <RatingStars
                                            rating={Number(rating.rating)}
                                            interactive={false}
                                            size={18}
                                        />

                                        <p className="text-sm font-medium text-gray-700 mt-2">
                                            {rating.rating} out of 5
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </section>
            )}

        </div>
    )
}

export default OwnerDashboard
