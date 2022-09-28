// requirements 
require('dotenv').config()
const cookieParser = require('cookie-parser')
const express = require('express')
const cors = require('cors')
const storesRouter = require('./routes/stores')
const usersRouter = require('./routes/users')
const announceRouter = require('./routes/announcements/annonces')
const offersRouter = require('./routes/offers')
const favouritesRouter = require('./routes/favourites')
const apartmentsRouter = require('./routes/announcements/apartments')
const carsRouter = require('./routes/announcements/cars')
const phonesController = require('./routes/announcements/phones')
const socialAccountsRouter = require('./routes/announcements/social_media_and_gaming_accounts')
const uploadRouter = require('./routes/upload')
const notFound = require('./middlewares/not-found')
const errorHandlerMiddleware = require('./middlewares/errors-handler')
const upload = require('./middlewares/upload_files')

// 
const app = express()

// TODO 
// => sign up w update profile 
// current date trej3ha bseconds 
// joz 3la return res... tel9a res.json direct bla return 
// case where the body is Empty or any necessary attribute(not null) isn't in the body add_car, add_phone ...
// !importnat Don't forget the check in the db in Annonces make category & wilaya not null 
// !importnat store rehi blamot de passe
// next f controllers (req, res, next)
// id_utilisateur = ${id_utilisateur} verify sql injection

// testing 
// app.get('/test', (req, res)=> res.json("server is running"))


// Important : ki tchanger f db matnsach tbeddel flmodels te3k hna, wtani f lfront end (want to exchange by ..)*
// tester  get marks 
const corsConfig = {
    credentials: true,
    origin: true,
}


app.use('/images',express.static(__dirname + '/images'));
app.use(cors(corsConfig))
app.use(express.json())
app.use(cookieParser())

// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', "http://localhost:3001");
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
//   });

// Routes
app.use('/api/stores', storesRouter) // => !importnat store rehi blamot de passe 
app.use('/api/users', usersRouter) // DONE 
app.use('/api/annonces', announceRouter)
app.use('/api/offers', offersRouter) // DONE 
app.use('/api/favourites', favouritesRouter) // DONE 
app.use('/api/apartments', apartmentsRouter) // DONE 
app.use('/api/cars', carsRouter) // DONE 
app.use('/api/phones', phonesController) // DONE 
app.use('/api/social_and_gaming_accounts', socialAccountsRouter) // DONE 
app.use('/api/upload', uploadRouter)

app.post('/api/upload/single', upload.single("image"), (req, res) => {
    return res.status(200).json(req.file)
})

app.post('/api/upload/multiple/:id', upload.array("images", 1), (req, res) => {
    const { files } = req
    if(!files) return res.status(200).json("Nothing to upload")
    const { id } = req.params
    return res.status(200).json(req.files)
})

// middlewares 
app.use(errorHandlerMiddleware)
app.use(notFound)



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