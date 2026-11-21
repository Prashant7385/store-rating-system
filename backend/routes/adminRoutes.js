
const express = require('express')
const router = express.Router()

const authenticateToken = require('../middleware/authMiddleware')
const checkRole = require('../middleware/roleMiddleware')

const {
    getDashboardStats,
    createUser,
    createStore,
    getAllUsers,
    getAllStores,
    getUserDetails
} = require('../controllers/adminController')

router.get(
    '/dashboard',
    authenticateToken,
    checkRole('ADMIN'),
    getDashboardStats
)

router.post(
    '/users',
    authenticateToken,
    checkRole('ADMIN'),
    createUser
)

router.get(
    '/users',
    authenticateToken,
    checkRole('ADMIN'),
    getAllUsers
)

router.post(
    '/stores',
    authenticateToken,
    checkRole('ADMIN'),
    createStore
)

router.get(
    '/stores',
    authenticateToken,
    checkRole('ADMIN'),
    getAllStores
)

router.get(
    '/users/:id',
    authenticateToken,
    checkRole('ADMIN'),
    getUserDetails
)

module.exports = router
