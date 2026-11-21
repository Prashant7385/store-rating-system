
import { createContext, useContext, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user')
            return savedUser ? JSON.parse(savedUser) : null
        } catch {
            localStorage.removeItem('user')
            return null
        }
    })

    const [loading, setLoading] = useState(false)

    const login = async (email, password) => {
        setLoading(true)

        try {
            const response = await api.post('/auth/login', {
                email,
                password
            })

            const { token, user } = response.data

            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))

            setUser(user)

            return response.data
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
