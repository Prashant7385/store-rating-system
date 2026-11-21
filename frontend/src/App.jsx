
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import UserDashboard from './pages/user/UserDashboard'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import Users from './pages/admin/Users'
import Stores from './pages/admin/Stores'
import CreateUser from './pages/admin/CreateUser'
import ChangePassword from './pages/ChangePassword'
import NotFound from './pages/NotFound'

function HomeRedirect() {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/login" replace />
    }

    const paths = {
        ADMIN: '/admin/dashboard',
        USER: '/user/dashboard',
        OWNER: '/owner/dashboard'
    }

    return <Navigate to={paths[user.role] || '/login'} replace />
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomeRedirect />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="stores" element={<Stores />} />
                    <Route path="users/create" element={<CreateUser />} />
                    <Route path="change-password" element={<ChangePassword />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
                <Route path="/user" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="change-password" element={<ChangePassword />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['OWNER']} />}>
                <Route path="/owner" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<OwnerDashboard />} />
                    <Route path="change-password" element={<ChangePassword />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default App
