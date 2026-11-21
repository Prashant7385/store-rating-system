
const pool = require('../config/db')

const bcrypt = require('bcryptjs')

const getStores = async (req, res) => {
    try {
        const { search } = req.query

        const result = await pool.query(
            `SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating,
                COUNT(r.id) AS total_ratings,
                ur.rating AS user_rating
             FROM stores s
             LEFT JOIN ratings r ON s.id = r.store_id
             LEFT JOIN ratings ur
                ON s.id = ur.store_id AND ur.user_id = $1
             WHERE (
                $2::VARCHAR IS NULL
                OR s.name ILIKE '%' || $2 || '%'
                OR s.address ILIKE '%' || $2 || '%'
             )
             GROUP BY s.id, ur.rating
             ORDER BY s.name ASC`,
            [req.user.id, search || null]
        )

        return res.status(200).json({
            success: true,
            totalStores: result.rows.length,
            stores: result.rows
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch stores'
        })
    }
}


const submitRating = async (req, res) => {
    try {
        const { store_id, rating } = req.body

        if (!store_id || !Number.isInteger(Number(store_id))) {
            return res.status(400).json({
                success: false,
                message: 'Valid store ID is required'
            })
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be an integer between 1 and 5'
            })
        }

        const storeResult = await pool.query(
            'SELECT id FROM stores WHERE id = $1',
            [store_id]
        )

        if (storeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Store not found'
            })
        }

        const result = await pool.query(
            `INSERT INTO ratings (user_id, store_id, rating)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, store_id)
             DO UPDATE SET
                rating = EXCLUDED.rating,
                updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [req.user.id, store_id, rating]
        )

        return res.status(200).json({
            success: true,
            message: 'Rating submitted successfully',
            rating: result.rows[0]
        })

        } catch (error) {
        console.error('Submit Rating Error:', error)

        return res.status(500).json({
            success: false,
            message: 'Failed to submit rating'
        })
    
    }
}


const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Both passwords are required'
            })
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'New password must be 8-16 characters with at least one uppercase letter and one special character'
            })
        }

        const userResult = await pool.query(
            'SELECT password_hash FROM users WHERE id = $1',
            [req.user.id]
        )

        const isMatch = await bcrypt.compare(
            currentPassword,
            userResult.rows[0].password_hash
        )

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await pool.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2',
            [hashedPassword, req.user.id]
        )

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        })

    } catch (error) {
        console.error('Change Password Error:', error)

        return res.status(500).json({
            success: false,
            message: 'Failed to change password'
        })
    }
}




module.exports = {
    getStores,
    submitRating,
    changePassword
}
