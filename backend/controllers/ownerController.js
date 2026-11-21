
const pool = require('../config/db')

const getOwnerDashboard = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                COUNT(DISTINCT s.id) AS total_stores,
                COUNT(r.id) AS total_ratings,
                COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating
             FROM stores s
             LEFT JOIN ratings r ON s.id = r.store_id
             WHERE s.owner_id = $1`,
            [req.user.id]
        )

        return res.status(200).json({
            success: true,
            dashboard: result.rows[0]
        })

    } catch (error) {
        console.error('Owner Dashboard Error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch owner dashboard'
        })
    }
}


const getOwnerStores = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating,
                COUNT(r.id) AS total_ratings
             FROM stores s
             LEFT JOIN ratings r ON s.id = r.store_id
             WHERE s.owner_id = $1
             GROUP BY s.id
             ORDER BY s.name ASC`,
            [req.user.id]
        )

        return res.status(200).json({
            success: true,
            totalStores: result.rows.length,
            stores: result.rows
        })

    } catch (error) {
        console.error('Owner Stores Error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch owner stores'
        })
    }
}


const getStoreRatings = async (req, res) => {
    try {
        const { storeId } = req.params

        const storeResult = await pool.query(
            'SELECT id FROM stores WHERE id = $1 AND owner_id = $2',
            [storeId, req.user.id]
        )

        if (storeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Store not found or you do not have access'
            })
        }

        const result = await pool.query(
            `SELECT
                r.id,
                r.rating,
                r.created_at,
                r.updated_at,
                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email
             FROM ratings r
             JOIN users u ON r.user_id = u.id
             WHERE r.store_id = $1
             ORDER BY r.updated_at DESC`,
            [storeId]
        )

        return res.status(200).json({
            success: true,
            totalRatings: result.rows.length,
            ratings: result.rows
        })

    } catch (error) {
        console.error('Store Ratings Error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch store ratings'
        })
    }
}


module.exports = {
    getOwnerDashboard,
    getOwnerStores,
    getStoreRatings
}
