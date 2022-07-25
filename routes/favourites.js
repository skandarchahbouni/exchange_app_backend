const router = require('express').Router()
const favouritesControllers = require('../controllers/favourites')

//TODO : add id_favourite attribute to the database 

router.get('/', favouritesControllers.getAllFavourites)
router.delete('/:id', favouritesControllers.removeFromFavourites)
router.post('/add_to_favourites', favouritesControllers.addToFavourites)

module.exports = router