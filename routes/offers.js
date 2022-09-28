const router = require('express').Router()
const offersController = require('../controllers/offers')
const authenticationMiddleware = require('../middlewares/auth')
const { offer_owner_middleware } = require('../middlewares/owner')

router.post('/create_offer', authenticationMiddleware, offersController.create_offer)

router.get('/', offersController.getAllOffers)
router.get('/recieved-offers', authenticationMiddleware, offersController.getRecievedOffers)
router.get('/submitted-offers', authenticationMiddleware, offersController.getSubmittedOffers)
router.get('/:id', offersController.getSingleOffer)

router.put('/:id', authenticationMiddleware, offer_owner_middleware, offersController.updateOffer)
router.delete('/:id', authenticationMiddleware, offer_owner_middleware, offersController.removeOffer)

module.exports = router