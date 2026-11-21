
import { useEffect, useState } from 'react'
import {
    Store,
    Search,
    RefreshCw,
    Plus,
    X,
    MapPin,
    Star
} from 'lucide-react'
import api from '../../services/api'

function Stores() {
    const [stores, setStores] = useState([])
    const [owners, setOwners] = useState([])

    const [search, setSearch] = useState('')
    const [ownerId, setOwnerId] = useState('')

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [showForm, setShowForm] = useState(false)
    const [creating, setCreating] = useState(false)
    const [success, setSuccess] = useState('')
    const [formError, setFormError] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        owner_id: ''
    })

    const fetchStores = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await api.get('/admin/stores', {
                params: {
                    search: search.trim() || undefined,
                    owner_id: ownerId || undefined
                }
            })

            setStores(response.data.stores)
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load stores.'
            )
        } finally {
            setLoading(false)
        }
    }

    const fetchOwners = async () => {
        try {
            const response = await api.get('/admin/users', {
                params: {
                    role: 'OWNER',
                    sortBy: 'name',
                    order: 'ASC'
                }
            })

            setOwners(response.data.users)
        } catch {
            setOwners([])
        }
    }

    useEffect(() => {
        fetchStores()
        fetchOwners()
    }, [ownerId])

    const handleSearch = (e) => {
        e.preventDefault()
        fetchStores()
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCreateStore = async (e) => {
        e.preventDefault()
        setFormError('')
        setSuccess('')

        const name = formData.name.trim()
        const email = formData.email.trim()
        const address = formData.address.trim()

        if (!name || !email || !address || !formData.owner_id) {
            setFormError('Please complete all fields.')
            return
        }

        if (address.length > 400) {
            setFormError('Address cannot exceed 400 characters.')
            return
        }

        setCreating(true)

        try {
            await api.post('/admin/stores', {
                name,
                email,
                address,
                owner_id: Number(formData.owner_id)
            })

            setSuccess('Store created successfully.')

            setFormData({
                name: '',
                email: '',
                address: '',
                owner_id: ''
            })

            await fetchStores()
            await fetchOwners()
        } catch (err) {
            setFormError(
                err.response?.data?.message ||
                'Unable to create store.'
            )
        } finally {
            setCreating(false)
        }
    }

    const closeForm = () => {
        setShowForm(false)
        setFormError('')
        setSuccess('')
    }

    return (
        <div className="max-w-7xl mx-auto space-y-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-[#647D68]">
                        STORE MANAGEMENT
                    </p>

                    <h1 className="text-2xl md:text-3xl font-semibold text-[#252D27] mt-2">
                        Manage Stores
                    </h1>

                    <p className="text-gray-500 mt-2">
                        View registered stores and assign store owners.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setShowForm(true)
                        setFormError('')
                        setSuccess('')
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-[#647D68] text-white rounded-lg text-sm font-medium hover:bg-[#526A56] transition"
                >
                    <Plus size={18} />
                    Add Store
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <form
                    onSubmit={handleSearch}
                    className="grid grid-cols-1 md:grid-cols-3 gap-3"
                >
                    <div className="relative md:col-span-2">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search store name or address..."
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#647D68]"
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-5 py-3 bg-[#647D68] text-white rounded-lg hover:bg-[#526A56] transition"
                    >
                        Search
                    </button>
                </form>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <label className="text-sm text-gray-500">
                        Filter by owner:
                    </label>

                    <select
                        value={ownerId}
                        onChange={(e) => setOwnerId(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    >
                        <option value="">All Owners</option>

                        {owners.map((owner) => (
                            <option key={owner.id} value={owner.id}>
                                {owner.name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => {
                            setSearch('')
                            setOwnerId('')
                        }}
                        className="text-sm text-gray-500 hover:text-[#647D68]"
                    >
                        Reset filters
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-gray-900">
                            Registered Stores
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            {stores.length} stores displayed
                        </p>
                    </div>

                    <button
                        onClick={fetchStores}
                        disabled={loading}
                        aria-label="Refresh stores"
                        className="text-gray-500 hover:text-[#647D68]"
                    >
                        <RefreshCw
                            size={19}
                            className={loading ? 'animate-spin' : ''}
                        />
                    </button>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        Loading stores...
                    </div>
                ) : !error && stores.length === 0 ? (
                    <div className="p-12 text-center">
                        <Store
                            size={36}
                            className="mx-auto text-gray-300"
                        />

                        <h3 className="font-semibold text-gray-800 mt-3">
                            No stores found
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            Try another search or add a new store.
                        </p>
                    </div>
                ) : (
                    !error && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#F7F6F2] text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4">Store</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Address</th>
                                        <th className="px-6 py-4">Owner</th>
                                        <th className="px-6 py-4">Rating</th>
                                        <th className="px-6 py-4">Reviews</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {stores.map((store) => (
                                        <tr key={store.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900 whitespace-nowrap">
                                                    {store.name}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    ID: {store.id}
                                                </p>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {store.email}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600 min-w-48">
                                                <div className="flex items-start gap-2">
                                                    <MapPin size={15} className="mt-0.5 shrink-0" />
                                                    {store.address}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {store.owner_name || `Owner #${store.owner_id}`}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Star
                                                        size={15}
                                                        fill="currentColor"
                                                        className="text-[#C49A55]"
                                                    />
                                                    {Number(store.average_rating).toFixed(2)}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {store.total_ratings}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Add New Store
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    Register a store and assign its owner.
                                </p>
                            </div>

                            <button onClick={closeForm} aria-label="Close form">
                                <X size={21} className="text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateStore} className="p-6 space-y-4">
                            {formError && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                                    {formError}
                                </div>
                            )}

                            {success && (
                                <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                                    {success}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Store Name
                                </label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter store name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#647D68]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Store Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="store@example.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#647D68]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Store Address
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    maxLength={400}
                                    rows={3}
                                    placeholder="Enter complete store address"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-[#647D68]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Assign Store Owner
                                </label>

                                <select
                                    name="owner_id"
                                    value={formData.owner_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-[#647D68]"
                                >
                                    <option value="">Select an owner</option>

                                    {owners.map((owner) => (
                                        <option key={owner.id} value={owner.id}>
                                            {owner.name} ({owner.email})
                                        </option>
                                    ))}
                                </select>

                                {owners.length === 0 && (
                                    <p className="text-xs text-amber-700 mt-2">
                                        No owners found. Create an OWNER account first.
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={creating || owners.length === 0}
                                    className="flex-1 py-3 bg-[#647D68] text-white rounded-lg font-medium hover:bg-[#526A56] transition disabled:opacity-50"
                                >
                                    {creating ? 'Creating Store...' : 'Create Store'}
                                </button>

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Stores
