
const express = require('express')
const router = express.Router()

const authenticateToken = require('../middleware/authMiddleware')
const checkRole = require('../middleware/roleMiddleware')

const {
    getStores,
    submitRating,
    changePassword
} = require('../controllers/userController')

router.get(
    '/stores',
    authenticateToken,
    checkRole('USER'),
    getStores
)

router.post(
    '/ratings',
    authenticateToken,
    checkRole('USER'),
    submitRating
)

router.put(
    '/change-password',
    authenticateToken,
    checkRole('USER', 'OWNER', 'ADMIN'),
    changePassword
)

module.exports = router
