const router = require('express').Router()
const offersController = require('../controllers/offers')

router.post('/create_offer', offersController.create_offer)

router.get('/', offersController.getAllOffers)
router.get('/:id', offersController.getSingleOffer)

router.put('/:id', offersController.updateOffer)
router.delete('/:id', offersController.removeOffer)

module.exports = router