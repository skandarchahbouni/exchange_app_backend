const router = require('express').Router()
const carsController = require('../../controllers/announcements/cars')
const authenticationMiddleware = require('../../middlewares/auth')
const { announce_owner_middleware } = require('../../middlewares/owner')

router.get('/', carsController.getAllCars)
router.get('/:id', carsController.getSingleCar)

router.post('/add-Car',authenticationMiddleware, carsController.addCar)

router.put('/:id', authenticationMiddleware, announce_owner_middleware, carsController.updateCar)
router.delete('/:id', authenticationMiddleware, announce_owner_middleware, carsController.deleteCar)

module.exports = router