
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, UserPlus, Eye, EyeOff } from 'lucide-react'
import api from '../../services/api'

function CreateUser() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        password: '',
        role: 'USER'
    })

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        const name = formData.name.trim()
        const email = formData.email.trim()
        const address = formData.address.trim()

        if (name.length < 20 || name.length > 60) {
            setError('Name must contain between 20 and 60 characters.')
            return
        }

        if (!address || address.length > 400) {
            setError('Address is required and cannot exceed 400 characters.')
            return
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/

        if (!passwordRegex.test(formData.password)) {
            setError(
                'Password must be 8-16 characters with one uppercase letter and one special character.'
            )
            return
        }

        setLoading(true)

        try {
            await api.post('/admin/users', {
                name,
                email,
                address,
                password: formData.password,
                role: formData.role
            })

            setSuccess('User created successfully.')

            setTimeout(() => {
                navigate('/admin/users')
            }, 1000)
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to create user.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-7">
            <div>
                <Link
                    to="/admin/users"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#647D68]"
                >
                    <ArrowLeft size={17} />
                    Back to Users
                </Link>

                <p className="text-sm font-medium text-[#647D68] mt-6">
                    USER MANAGEMENT
                </p>

                <h1 className="text-2xl md:text-3xl font-semibold text-[#252D27] mt-2">
                    Create New User
                </h1>

                <p className="text-gray-500 mt-2">
                    Add a new user or store owner to the platform.
                </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-7">
                    <div className="w-11 h-11 bg-[#EEF2ED] text-[#647D68] rounded-xl flex items-center justify-center">
                        <UserPlus size={22} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-gray-900">
                            Account Information
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                            Enter the required details.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="p-3 mb-5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-3 mb-5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>

                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            minLength={20}
                            maxLength={60}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#647D68]"
                        />

                        <p className="text-xs text-gray-400 mt-1">
                            20–60 characters
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="user@example.com"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#647D68]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter complete address"
                            rows={3}
                            maxLength={400}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-[#647D68]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create password"
                                required
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none focus:border-[#647D68]"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                            </button>
                        </div>

                        <p className="text-xs text-gray-400 mt-1">
                            8–16 characters, one uppercase letter and one special character.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Role
                        </label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-[#647D68]"
                        >
                            <option value="USER">Normal User</option>
                            <option value="OWNER">Store Owner</option>
                        </select>

                        <p className="text-xs text-gray-400 mt-1">
                            Admin accounts cannot be created through this form.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-[#647D68] text-white rounded-lg font-medium hover:bg-[#526A56] transition disabled:opacity-60"
                        >
                            {loading ? 'Creating...' : 'Create Account'}
                        </button>

                        <Link
                            to="/admin/users"
                            className="px-7 py-3 text-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateUser
