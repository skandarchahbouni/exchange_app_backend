// requirements 
require('dotenv').config()
const express = require('express')
const storesRouter = require('./routes/stores')
const usersRouter = require('./routes/users')
const offersRouter = require('./routes/offers')
const favouritesRouter = require('./routes/favourites')
const apartmentsRouter = require('./routes/announcements/apartments')
const carsRouter = require('./routes/announcements/cars')
const phonesController = require('./routes/announcements/phones')
const socialAccountsRouter = require('./routes/announcements/social_media_and_gaming_accounts')

// 
const app = express()

// testing 
// app.get('/test', (req, res)=> res.json("server is running"))

// Routes
app.use('/api/stores', storesRouter) 
app.use('/api/users', usersRouter)
app.use('/api/offers', offersRouter)
app.use('/api/favourites', favouritesRouter)
app.use('/api/apartments', apartmentsRouter)
app.use('/api/cars', carsRouter)
app.use('/api/phones', phonesController)
app.use('/api/social_and_gaming_accounts', socialAccountsRouter)
// users 
// app.use('/api/users/auth')
// app.use('/api/')



// listening to the requests 
const port = process.env.PORT || 8080
const start = () => {
    try {
        app.listen(port)
        console.log(`Server is running on port ${port}`)
    } catch (error) {
        console.log("Server is not listening")
    }
}
start()