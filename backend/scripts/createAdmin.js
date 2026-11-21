
const pool = require('../config/db')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const createAdmin = async () => {
    try {
        const name = process.env.ADMIN_NAME
        const email = process.env.ADMIN_EMAIL
        const address = process.env.ADMIN_ADDRESS
        const password = process.env.ADMIN_PASSWORD

        if (!name || !email || !address || !password) {
            throw new Error('Admin environment variables are missing')
        }

        const existingAdmin = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        )

        if (existingAdmin.rows.length > 0) {
            console.log('Admin account already exists')
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await pool.query(
            `INSERT INTO users (name, email, password_hash, address, role)
             VALUES ($1, $2, $3, $4, $5)`,
            [name, email, hashedPassword, address, 'ADMIN']
        )

        console.log('Admin account created successfully')
    } catch (error) {
        console.error('Error creating admin:', error.message)
        process.exitCode = 1
    } finally {
        await pool.end()
    }
}

createAdmin()
