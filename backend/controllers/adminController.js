
const pool = require('../config/db')
const bcrypt = require('bcryptjs')

const getDashboardStats = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM users) AS total_users,
                (SELECT COUNT(*) FROM stores) AS total_stores,
                (SELECT COUNT(*) FROM ratings) AS total_ratings
        `)

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers: Number(result.rows[0].total_users),
                totalStores: Number(result.rows[0].total_stores),
                totalRatings: Number(result.rows[0].total_ratings)
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics'
        })
    }
}

const createUser = async (req, res) => {
    try {
        const { name, email, address, password, role } = req.body

        if (!name || !email || !address || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        if (name.trim().length < 20 || name.trim().length > 60) {
            return res.status(400).json({
                success: false,
                message: 'Name must be between 20 and 60 characters'
            })
        }

        if (address.trim().length === 0 || address.length > 400) {
            return res.status(400).json({
                success: false,
                message: 'Address must be between 1 and 400 characters'
            })
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            })
        }

        const passwordPattern = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/

        if (!passwordPattern.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be 8-16 characters with at least one uppercase letter and one special character'
            })
        }

        if (!['USER', 'OWNER'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Role must be USER or OWNER'
            })
        }

        const normalizedEmail = email.trim().toLowerCase()

        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [normalizedEmail]
        )

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, address, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, name, email, address, role, created_at`,
            [name.trim(), normalizedEmail, hashedPassword, address.trim(), role]
        )

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: result.rows[0]
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create user'
        })
    }
}

const createStore = async (req, res) => {
    try {
        const { name, email, address, owner_id } = req.body

        if (!name || !email || !address || !owner_id) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        if (address.trim().length === 0 || address.length > 400) {
            return res.status(400).json({
                success: false,
                message: 'Address must be between 1 and 400 characters'
            })
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            })
        }

        const owner = await pool.query(
            'SELECT id FROM users WHERE id = $1 AND role = $2',
            [owner_id, 'OWNER']
        )

        if (owner.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Store owner not found'
            })
        }

        const result = await pool.query(
            `INSERT INTO stores (name, email, address, owner_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [name.trim(), email.trim().toLowerCase(), address.trim(), owner_id]
        )

        return res.status(201).json({
            success: true,
            message: 'Store created successfully',
            store: result.rows[0]
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create store'
        })
    }
}


const getAllUsers = async (req, res) => {
    try {
        const {
            search = '',
            role = '',
            sortBy = 'created_at',
            order = 'DESC'
        } = req.query

        const allowedSortColumns = ['name', 'email', 'created_at']
        const allowedOrders = ['ASC', 'DESC']
        const allowedRoles = ['USER', 'OWNER', 'ADMIN']

        if (!allowedSortColumns.includes(sortBy)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid sort field'
            })
        }

        if (!allowedOrders.includes(order.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid sort order'
            })
        }

        if (role && !allowedRoles.includes(role.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role filter'
            })
        }

        const values = []
        let query = `
            SELECT id, name, email, address, role, created_at
            FROM users
            WHERE 1 = 1
        `

        if (search.trim()) {
            values.push(`%${search.trim()}%`)
            query += ` AND (
                name ILIKE $${values.length}
                OR email ILIKE $${values.length}
                OR address ILIKE $${values.length}
            )`
        }

        if (role) {
            values.push(role.toUpperCase())
            query += ` AND role = $${values.length}`
        }

        query += ` ORDER BY ${sortBy} ${order.toUpperCase()}`

        const result = await pool.query(query, values)

        return res.status(200).json({
            success: true,
            totalUsers: result.rows.length,
            users: result.rows
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        })
    }
}


const getAllStores = async (req, res) => {
    try {
        const {
            search = '',
            owner_id = '',
            sortBy = 'created_at',
            order = 'DESC'
        } = req.query

        const allowedSortColumns = ['name', 'email', 'created_at']
        const allowedOrders = ['ASC', 'DESC']

        if (!allowedSortColumns.includes(sortBy)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid sort field'
            })
        }

        if (!allowedOrders.includes(order.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid sort order'
            })
        }

        const values = []
        let query = `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,
                u.name AS owner_name,
                COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating,
                COUNT(r.id) AS total_ratings,
                s.created_at
            FROM stores s
            JOIN users u ON s.owner_id = u.id
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE 1 = 1
        `

        if (search.trim()) {
            values.push(`%${search.trim()}%`)
            query += ` AND (
                s.name ILIKE $${values.length}
                OR s.email ILIKE $${values.length}
                OR s.address ILIKE $${values.length}
                OR u.name ILIKE $${values.length}
            )`
        }

        if (owner_id) {
            values.push(owner_id)
            query += ` AND s.owner_id = $${values.length}`
        }

        query += `
            GROUP BY s.id, u.name
            ORDER BY ${sortBy === 'name' ? 's.name' : sortBy === 'email' ? 's.email' : 's.created_at'} ${order.toUpperCase()}
        `

        const result = await pool.query(query, values)

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


const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params

        const userResult = await pool.query(
            `SELECT id, name, email, address, role, created_at
             FROM users
             WHERE id = $1`,
            [id]
        )

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const user = userResult.rows[0]

        let stores = []

        if (user.role === 'OWNER') {
            const storeResult = await pool.query(
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
                 GROUP BY s.id`,
                [id]
            )

            stores = storeResult.rows
        }

        return res.status(200).json({
            success: true,
            user,
            stores
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch user details'
        })
    }
}


module.exports = {
    getDashboardStats,
    createUser,
    createStore,
    getAllUsers,
    getAllStores,
    getUserDetails
}