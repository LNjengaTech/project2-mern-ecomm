const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors') // For pretty console logs
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')

const uploadRoutes = require('./routes/uploadRoutes')
const path = require('path') // import for path utility

const orderRoutes = require('./routes/orderRoutes')

//const configRoutes = require('./routes/configRoutes')

// Load environment variables from .env file
dotenv.config()

// Connect to Database
connectDB()

const app = express()
// Middleware to parse JSON bodies (for POST requests)
app.use(express.json())

// Simple Test Route
app.get('/', (req, res) => { res.send('API is running...') })

app.use('/api/users', userRoutes) //<-- user route endpoint

app.use('/api/products', productRoutes) // <-- product route endpoint

app.use('/api/upload', uploadRoutes) // <-- upload route endpoint

app.use('/api/orders', orderRoutes) // <-- Order Route

// PayPal Config Route
//app.use('/api/config', configRoutes)



// Crucially, the browser needs to be able to access the files in the uploads folder via a URL
// 🔑 Make the 'uploads' folder static and publicly accessible
//const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))) // <-- Important!


// Define Port
const PORT = process.env.PORT || 5000

// Start Server
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold)
)