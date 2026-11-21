
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LockKeyhole, ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import api from '../services/api'

function ChangePassword() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setMessage('')
        setError('')
    }

    const togglePassword = (field) => {
        setShowPasswords({
            ...showPasswords,
            [field]: !showPasswords[field]
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')

        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError('Please fill in all fields.')
            return
        }

        if (!/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(formData.newPassword)) {
            setError('New password must be 8–16 characters and include at least one uppercase letter and one special character.')
            return
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New password and confirmation do not match.')
            return
        }

        if (formData.currentPassword === formData.newPassword) {
            setError('Your new password must be different from your current password.')
            return
        }

        try {
            setLoading(true)

            const response = await api.put('/user/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            })

            setMessage(response.data.message || 'Password changed successfully.')

            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to change password. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const passwordField = (label, name, field) => (
        <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
                {label}
            </label>

            <div className="relative">
                <input
                    type={showPasswords[field] ? 'text' : 'password'}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 pr-12 text-sm text-stone-800 outline-none transition focus:border-stone-600 focus:ring-2 focus:ring-stone-200"
                    placeholder={`Enter ${label.toLowerCase()}`}
                    autoComplete="current-password"
                />

                <button
                    type="button"
                    onClick={() => togglePassword(field)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800"
                    aria-label={showPasswords[field] ? 'Hide password' : 'Show password'}
                >
                    {showPasswords[field] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    )

    return (
        <div className="mx-auto max-w-2xl">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900"
            >
                <ArrowLeft size={17} />
                Go back
            </button>

            <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8eee7] text-[#536b55]">
                    <LockKeyhole size={23} />
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
                    Change password
                </h1>

                <p className="mt-2 text-sm text-stone-500">
                    Update your password to keep your account secure.
                </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {passwordField('Current password', 'currentPassword', 'current')}
                    {passwordField('New password', 'newPassword', 'new')}
                    {passwordField('Confirm new password', 'confirmPassword', 'confirm')}

                    <div className="rounded-xl bg-stone-50 p-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-600">
                            Password requirements
                        </p>
                        <ul className="space-y-1 text-xs text-stone-500">
                            <li>• 8 to 16 characters</li>
                            <li>• At least one uppercase letter</li>
                            <li>• At least one special character</li>
                        </ul>
                    </div>

                    {error && (
                        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            <AlertCircle size={18} className="mt-0.5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {message && (
                        <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                            <p>{message}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#536b55] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#405642] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Updating password...' : 'Update password'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword
