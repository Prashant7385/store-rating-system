
import { useEffect, useState } from 'react'
import {
    Search,
    Users as UsersIcon,
    RefreshCw,
    Eye,
    X,
    Store
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

function Users() {
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const [role, setRole] = useState('')
    const [sortBy, setSortBy] = useState('created_at')
    const [order, setOrder] = useState('DESC')

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [selectedUser, setSelectedUser] = useState(null)
    const [detailsLoading, setDetailsLoading] = useState(false)
    const [detailsError, setDetailsError] = useState('')

    const fetchUsers = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await api.get('/admin/users', {
                params: {
                    search: search.trim() || undefined,
                    role: role || undefined,
                    sortBy,
                    order
                }
            })

            setUsers(response.data.users)
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load users.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [role, sortBy, order])

    const handleSearch = (e) => {
        e.preventDefault()
        fetchUsers()
    }

    const handleViewUser = async (id) => {
        setSelectedUser(null)
        setDetailsError('')
        setDetailsLoading(true)

        try {
            const response = await api.get(`/admin/users/${id}`)
            setSelectedUser(response.data)
        } catch (err) {
            setDetailsError(
                err.response?.data?.message ||
                'Unable to load user details.'
            )
        } finally {
            setDetailsLoading(false)
        }
    }

    const closeDetails = () => {
        setSelectedUser(null)
        setDetailsError('')
    }

    return (
        <div className="max-w-7xl mx-auto space-y-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-[#647D68]">
                        ADMINISTRATION
                    </p>
                    <h1 className="text-2xl md:text-3xl font-semibold text-[#252D27] mt-2">
                        Manage Users
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Search, filter, and view registered users.
                    </p>
                </div>

                <Link
                    to="/admin/users/create"
                    className="px-5 py-3 bg-[#647D68] text-white rounded-lg text-sm font-medium text-center hover:bg-[#526A56] transition"
                >
                    Create User
                </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <form
                    onSubmit={handleSearch}
                    className="grid grid-cols-1 md:grid-cols-4 gap-3"
                >
                    <div className="relative md:col-span-2">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, email or address..."
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#647D68]"
                        />
                    </div>

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-[#647D68]"
                    >
                        <option value="">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="USER">User</option>
                        <option value="OWNER">Owner</option>
                    </select>

                    <button
                        type="submit"
                        className="px-5 py-3 bg-[#647D68] text-white rounded-lg hover:bg-[#526A56] transition"
                    >
                        Search
                    </button>
                </form>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
                    <span className="text-sm text-gray-500">
                        Sort users:
                    </span>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    >
                        <option value="created_at">Date Created</option>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="role">Role</option>
                    </select>

                    <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    >
                        <option value="DESC">Descending</option>
                        <option value="ASC">Ascending</option>
                    </select>

                    <button
                        type="button"
                        onClick={() => {
                            setSearch('')
                            setRole('')
                            setSortBy('created_at')
                            setOrder('DESC')
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
                            Registered Users
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {users.length} users displayed
                        </p>
                    </div>

                    <button
                        onClick={fetchUsers}
                        disabled={loading}
                        className="text-gray-500 hover:text-[#647D68]"
                        aria-label="Refresh users"
                    >
                        <RefreshCw
                            size={19}
                            className={loading ? 'animate-spin' : ''}
                        />
                    </button>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        Loading users...
                    </div>
                ) : !error && users.length === 0 ? (
                    <div className="p-12 text-center">
                        <UsersIcon
                            size={35}
                            className="mx-auto text-gray-300"
                        />
                        <p className="font-medium text-gray-800 mt-3">
                            No users found
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Try changing your search or filters.
                        </p>
                    </div>
                ) : (
                    !error && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#F7F6F2] text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Address</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900 whitespace-nowrap">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    ID: {user.id}
                                                </p>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {user.email}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full bg-[#EEF2ED] text-[#526A56] text-xs font-medium">
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600 min-w-48">
                                                {user.address}
                                            </td>

                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleViewUser(user.id)}
                                                    className="flex items-center gap-2 text-sm text-[#647D68] font-medium hover:underline"
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>

            {(selectedUser || detailsLoading || detailsError) && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-xl max-h-[85vh] overflow-y-auto">
                        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="font-semibold text-lg">
                                User Details
                            </h2>
                            <button onClick={closeDetails} aria-label="Close details">
                                <X size={21} className="text-gray-500" />
                            </button>
                        </div>

                        {detailsLoading ? (
                            <div className="p-10 text-center text-gray-500">
                                Loading user details...
                            </div>
                        ) : detailsError ? (
                            <div className="p-6 text-sm text-red-600">
                                {detailsError}
                            </div>
                        ) : selectedUser && (
                            <div className="p-6 space-y-5">
                                <div>
                                    <p className="text-xs text-gray-400">Full name</p>
                                    <p className="font-medium text-gray-900 mt-1">
                                        {selectedUser.user.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">Email</p>
                                    <p className="text-gray-800 mt-1">
                                        {selectedUser.user.email}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">Address</p>
                                    <p className="text-gray-800 mt-1">
                                        {selectedUser.user.address}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">Role</p>
                                    <p className="text-gray-800 mt-1">
                                        {selectedUser.user.role}
                                    </p>
                                </div>

                                {selectedUser.user.role === 'OWNER' && (
                                    <div className="pt-4 border-t border-gray-200">
                                        <h3 className="font-semibold text-gray-900 mb-3">
                                            Owned Stores
                                        </h3>

                                        {selectedUser.stores.length === 0 ? (
                                            <p className="text-sm text-gray-500">
                                                This owner has no stores.
                                            </p>
                                        ) : (
                                            selectedUser.stores.map((store) => (
                                                <div
                                                    key={store.id}
                                                    className="p-4 bg-[#F7F6F2] rounded-lg mb-3"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Store
                                                            size={17}
                                                            className="text-[#647D68]"
                                                        />
                                                        <p className="font-medium text-gray-900">
                                                            {store.name}
                                                        </p>
                                                    </div>

                                                    <p className="text-xs text-gray-500 mt-2">
                                                        {store.address}
                                                    </p>

                                                    <div className="flex gap-4 text-xs text-gray-600 mt-3">
                                                        <span>
                                                            Average: {Number(store.average_rating).toFixed(2)}
                                                        </span>
                                                        <span>
                                                            Ratings: {store.total_ratings}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Users
