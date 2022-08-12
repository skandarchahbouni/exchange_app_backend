const router = require('express').Router()
const apartmentController = require('../../controllers/announcements/apartments')
const authenticationMiddleware = require('../../middlewares/auth')
const { announce_owner_middleware } = require('../../middlewares/owner')

router.get('/', apartmentController.getAllApartments)
router.get('/:id', apartmentController.getSingleApartment)

router.post('/add-apartment', authenticationMiddleware, apartmentController.addApartment)

router.put('/:id', authenticationMiddleware, announce_owner_middleware, apartmentController.updateApartment)
router.delete('/:id', authenticationMiddleware, announce_owner_middleware, apartmentController.deleteApartment)

module.exports = router