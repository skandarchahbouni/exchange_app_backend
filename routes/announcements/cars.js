const router = require('express').Router()
const carsController = require('../../controllers/announcements/cars')

router.get('/', carsController.getAllCars)
router.get('/:id', carsController.getSingleCar)

router.post('/add-Car', carsController.addCar)

router.put('/:id', carsController.updateCar)
router.delete('/:id', carsController.deleteCar)

module.exports = router