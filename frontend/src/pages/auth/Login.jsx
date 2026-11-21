
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Store, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function Login() {
    const navigate = useNavigate()
    const location = useLocation()

    const { login, loading } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    const successMessage = location.state?.message

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            const response = await login(email.trim(), password)

            const dashboardPaths = {
                ADMIN: '/admin/dashboard',
                USER: '/user/dashboard',
                OWNER: '/owner/dashboard'
            }

            navigate(
                dashboardPaths[response.user.role] || '/login',
                { replace: true }
            )
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to login. Please try again.'
            )
        }
    }

    return (
        <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-5">

            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#647D68] text-white mb-4">
                        <Store size={27} />
                    </div>

                    <h1 className="text-3xl font-semibold text-[#252D27]">
                        RatePoint
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Welcome back. Please sign in to continue.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7 sm:p-9">

                    <h2 className="text-xl font-semibold text-gray-900">
                        Sign in
                    </h2>

                    <p className="text-sm text-gray-500 mt-1 mb-7">
                        Enter your account details below.
                    </p>

                    {successMessage && (
                        <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                            {successMessage}
                        </div>
                    )}

                    {error && (
                        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#647D68] focus:ring-2 focus:ring-[#647D68]/10"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    autoComplete="current-password"
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none focus:border-[#647D68] focus:ring-2 focus:ring-[#647D68]/10"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-[#647D68] text-white py-3 rounded-lg font-medium hover:bg-[#526A56] transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                            {!loading && <ArrowRight size={18} />}
                        </button>

                    </form>

                    <div className="mt-7 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="font-semibold text-[#647D68] hover:underline"
                        >
                            Create account
                        </Link>
                    </div>

                </div>

                <p className="text-center text-xs text-gray-400 mt-7">
                    Store Rating System
                </p>

            </div>
        </div>
    )
}

export default Login
