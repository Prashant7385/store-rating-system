
const pool = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try {
        const { name, email, address, password } = req.body

        if (!name || !email || !address || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            })
        }

        if (name.trim().length < 20 || name.trim().length > 60) {
            return res.status(400).json({
                success: false,
                message: 'Name must be between 20 and 60 characters'
            })
        }

        if (address.length > 400) {
            return res.status(400).json({
                success: false,
                message: 'Address cannot exceed 400 characters'
            })
        }

        const passwordPattern = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/

        if (!passwordPattern.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be 8-16 characters with at least one uppercase letter and one special character'
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
                message: 'Email is already registered'
            })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, address, role)
             VALUES ($1, $2, $3, $4, 'USER')
             RETURNING id, name, email, address, role`,
            [name.trim(), normalizedEmail, passwordHash, address.trim()]
        )

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: result.rows[0]
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            message: 'Registration failed'
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            })
        }

        const normalizedEmail = email.trim().toLowerCase()

        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [normalizedEmail]
        )

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        const user = result.rows[0]

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        )

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role
            }
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            message: 'Login failed'
        })
    }
}

module.exports = { register, login }
