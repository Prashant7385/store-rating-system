
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ allowedRoles }) {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (!allowedRoles.includes(user.role)) {
        const dashboardPaths = {
            ADMIN: '/admin/dashboard',
            USER: '/user/dashboard',
            OWNER: '/owner/dashboard'
        }

        return (
            <Navigate
                to={dashboardPaths[user.role] || '/login'}
                replace
            />
        )
    }

    return <Outlet />
}

export default ProtectedRoute
