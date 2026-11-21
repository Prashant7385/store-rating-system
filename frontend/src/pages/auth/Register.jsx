
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Store, ArrowRight } from 'lucide-react'
import api from '../../services/api'

function Register() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        password: '',
        confirmPassword: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

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

        const name = formData.name.trim()
        const email = formData.email.trim()
        const address = formData.address.trim()

        if (name.length < 20 || name.length > 60) {
            setError('Name must contain between 20 and 60 characters.')
            return
        }

        if (address.length === 0 || address.length > 400) {
            setError('Address is required and must not exceed 400 characters.')
            return
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/

        if (!passwordRegex.test(formData.password)) {
            setError(
                'Password must be 8-16 characters with at least one uppercase letter and one special character.'
            )
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)

        try {
            await api.post('/auth/register', {
                name,
                email,
                address,
                password: formData.password
            })

            navigate('/login', {
                replace: true,
                state: {
                    message: 'Registration successful! Please login.'
                }
            })
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Registration failed. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-5">

            <div className="w-full max-w-lg">

                <div className="text-center mb-7">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#647D68] text-white mb-4">
                        <Store size={27} />
                    </div>

                    <h1 className="text-3xl font-semibold text-[#252D27]">
                        RatePoint
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Create an account to get started.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7 sm:p-9">

                    <h2 className="text-xl font-semibold text-gray-900">
                        Create your account
                    </h2>

                    <p className="text-sm text-gray-500 mt-1 mb-6">
                        Fill in your details to register.
                    </p>

                    {error && (
                        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                minLength={20}
                                maxLength={60}
                                required
                                autoComplete="name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#647D68] focus:ring-2 focus:ring-[#647D68]/10"
                            />

                            <p className="text-xs text-gray-400 mt-1">
                                20–60 characters
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#647D68] focus:ring-2 focus:ring-[#647D68]/10"
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
                                placeholder="Enter your complete address"
                                rows={3}
                                maxLength={400}
                                required
                                autoComplete="street-address"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-[#647D68] focus:ring-2 focus:ring-[#647D68]/10"
                            />

                            <p className="text-xs text-gray-400 mt-1">
                                Maximum 400 characters
                            </p>
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
                                    placeholder="Create a password"
                                    required
                                    autoComplete="new-password"
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none focus:border-[#647D68] focus:ring-2 focus:ring-[#647D68]/10"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    aria-label="Toggle password visibility"
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
                                Confirm password
                            </label>

                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                    autoComplete="new-password"
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none focus:border-[#647D68] focus:ring-2 focus:ring-[#647D68]/10"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    aria-label="Toggle confirm password visibility"
                                >
                                    {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-[#647D68] text-white py-3 rounded-lg font-medium hover:bg-[#526A56] transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                            {!loading && <ArrowRight size={18} />}
                        </button>

                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-semibold text-[#647D68] hover:underline"
                        >
                            Sign in
                        </Link>
                    </div>

                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Store Rating System
                </p>

            </div>
        </div>
    )
}

export default Register
