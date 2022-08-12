const router = require('express').Router()
const favouritesControllers = require('../controllers/favourites')
const authenticationMiddleware = require('../middlewares/auth')
const { favourite_owner_middleware } = require('../middlewares/owner')
//TODO : add id_favourite attribute to the database 

router.get('/', authenticationMiddleware, favouritesControllers.getAllFavourites)
router.delete('/:id',authenticationMiddleware, favourite_owner_middleware, favouritesControllers.removeFromFavourites)
router.post('/add_to_favourites',authenticationMiddleware, favouritesControllers.addToFavourites)

module.exports = router