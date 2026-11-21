
const express = require('express')
const router = express.Router()

const authenticateToken = require('../middleware/authMiddleware')
const checkRole = require('../middleware/roleMiddleware')

const {
    getOwnerDashboard,
    getOwnerStores,
    getStoreRatings
} = require('../controllers/ownerController')

router.get(
    '/dashboard',
    authenticateToken,
    checkRole('OWNER'),
    getOwnerDashboard
)

router.get(
    '/stores',
    authenticateToken,
    checkRole('OWNER'),
    getOwnerStores
)

router.get(
    '/stores/:storeId/ratings',
    authenticateToken,
    checkRole('OWNER'),
    getStoreRatings
)

module.exports = router
