const router = require('express').Router()
const apartmentController = require('../../controllers/announcements/apartments')

router.get('/', apartmentController.getAllApartments)
router.get('/:id', apartmentController.getSingleApartment)

router.post('/add-apartment', apartmentController.addApartment)

router.put('/:id', apartmentController.updateApartment)
router.delete('/:id', apartmentController.deleteApartment)

module.exports = router