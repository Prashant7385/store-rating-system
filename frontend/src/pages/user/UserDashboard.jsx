
import { useEffect, useState } from 'react'
import {
    Search,
    MapPin,
    Store,
    Star,
    RefreshCw,
    MessageSquare
} from 'lucide-react'

import api from '../../services/api'
import RatingStars from '../../components/RatingStars'

function UserDashboard() {
    const [stores, setStores] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedRatings, setSelectedRatings] = useState({})
    const [submitting, setSubmitting] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')

    const fetchStores = async (searchValue = '') => {
        setLoading(true)
        setError('')

        try {
            const response = await api.get('/user/stores', {
                params: {
                    search: searchValue || undefined
                }
            })

            setStores(response.data.stores)
            setSelectedRatings({})
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load stores. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        setSuccessMessage('')
        fetchStores(search.trim())
    }

    const handleRatingChange = (storeId, rating) => {
        setSelectedRatings((prev) => ({
            ...prev,
            [storeId]: rating
        }))

        setSuccessMessage('')
    }

    const handleSubmitRating = async (storeId) => {
        const rating = selectedRatings[storeId]

        if (!rating) {
            return
        }

        setSubmitting(storeId)
        setError('')
        setSuccessMessage('')

        try {
            await api.post('/user/ratings', {
                store_id: storeId,
                rating
            })

            setSuccessMessage('Your rating has been saved successfully.')

            await fetchStores(search.trim())
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to submit rating. Please try again.'
            )
        } finally {
            setSubmitting(null)
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-7">

            {/* Page Heading */}
            <div>
                <p className="text-sm text-[#647D68] font-medium">
                    USER DASHBOARD
                </p>

                <h1 className="text-2xl md:text-3xl font-semibold text-[#252D27] mt-2">
                    Explore Stores
                </h1>

                <p className="text-gray-500 mt-2">
                    Discover stores, check customer ratings, and share your experience.
                </p>
            </div>

            {/* Search */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    <div className="relative flex-1">
                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by store name or address..."
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#647D68] focus:ring-2 focus:ring-[#647D68]/10"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-7 py-3 bg-[#647D68] text-white rounded-lg font-medium hover:bg-[#526A56] transition disabled:opacity-60"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Messages */}
            {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                    {successMessage}
                </div>
            )}

            {/* Store Count */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Available Stores
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {stores.length} {stores.length === 1 ? 'store' : 'stores'} found
                    </p>
                </div>

                <button
                    onClick={() => fetchStores(search.trim())}
                    disabled={loading}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#647D68] transition"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                    <RefreshCw
                        size={25}
                        className="animate-spin mx-auto text-[#647D68]"
                    />

                    <p className="text-gray-500 mt-4">
                        Loading stores...
                    </p>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && stores.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                    <Store
                        size={38}
                        className="mx-auto text-gray-300"
                    />

                    <h3 className="text-lg font-semibold text-gray-800 mt-4">
                        No stores found
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                        Try searching with another store name or address.
                    </p>
                </div>
            )}

            {/* Store Cards */}
            {!loading && stores.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {stores.map((store) => {
                        const currentRating =
                            selectedRatings[store.id] ??
                            Number(store.user_rating || 0)

                        const hasRated = store.user_rating !== null

                        return (
                            <div
                                key={store.id}
                                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition"
                            >

                                {/* Store Information */}
                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-[#EEF2ED] flex items-center justify-center text-[#647D68]">
                                            <Store size={23} />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {store.name}
                                            </h3>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {store.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <div className="flex items-center justify-end gap-1 text-[#B58B45]">
                                            <Star
                                                size={17}
                                                fill="currentColor"
                                            />

                                            <span className="font-semibold text-gray-900">
                                                {Number(store.average_rating).toFixed(2)}
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-500 mt-1">
                                            {store.total_ratings} ratings
                                        </p>
                                    </div>

                                </div>

                                {/* Address */}
                                <div className="flex items-start gap-2 mt-5 text-sm text-gray-500">
                                    <MapPin
                                        size={17}
                                        className="shrink-0 mt-0.5"
                                    />

                                    <span>{store.address}</span>
                                </div>

                                {/* Rating Information */}
                                <div className="mt-6 pt-5 border-t border-gray-100">

                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-semibold text-gray-800">
                                            Your Rating
                                        </h4>

                                        {hasRated && (
                                            <span className="text-xs text-[#647D68] bg-[#EEF2ED] px-3 py-1 rounded-full">
                                                Already rated
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between flex-wrap gap-4">

                                        <div>
                                            <RatingStars
                                                rating={currentRating}
                                                interactive={true}
                                                onChange={(rating) =>
                                                    handleRatingChange(store.id, rating)
                                                }
                                                size={25}
                                            />

                                            <p className="text-xs text-gray-400 mt-2">
                                                {currentRating > 0
                                                    ? `${currentRating} out of 5 stars selected`
                                                    : 'Select your rating'}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleSubmitRating(store.id)}
                                            disabled={
                                                !selectedRatings[store.id] ||
                                                submitting === store.id
                                            }
                                            className="px-5 py-2.5 rounded-lg bg-[#647D68] text-white text-sm font-medium hover:bg-[#526A56] transition disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            {submitting === store.id
                                                ? 'Saving...'
                                                : hasRated
                                                    ? 'Update Rating'
                                                    : 'Submit Rating'}
                                        </button>

                                    </div>
                                </div>

                            </div>
                        )
                    })}

                </div>
            )}

            {/* Footer Information */}
            {!loading && stores.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-400 pb-3">
                    <MessageSquare size={15} />

                    <span>
                        You can submit one rating per store and update it whenever you want.
                    </span>
                </div>
            )}

        </div>
    )
}

export default UserDashboard
