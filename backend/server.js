
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const pool = require('./config/db')
const authRoutes = require('./routes/authRoutes')

const authenticateToken = require('./middleware/authMiddleware')
const checkRole = require('./middleware/roleMiddleware')

const adminRoutes = require('./routes/adminRoutes')

const userRoutes = require('./routes/userRoutes')

const ownerRoutes = require('./routes/ownerRoutes')


const app = express()

app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
    res.send('Store Rating API is running')
})

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1')

        res.status(200).json({
            success: true,
            message: 'Backend and database are connected'
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            message: 'Database connection failed'
        })
    }
})


app.get('/api/profile', authenticateToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'You are authenticated',
        user: req.user
    })
})

app.get('/api/admin/test', authenticateToken, checkRole('ADMIN'), (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome Admin'
    })
})

app.use('/api/admin', adminRoutes)

app.use('/api/user', userRoutes)

app.use('/api/owner', ownerRoutes)


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
