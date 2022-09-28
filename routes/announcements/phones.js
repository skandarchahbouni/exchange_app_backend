const router = require('express').Router()
const phonesController = require('../../controllers/announcements/phones')
const authenticationMiddleware = require('../../middlewares/auth')
const { announce_owner_middleware } = require('../../middlewares/owner')

router.get('/', phonesController.getAllPhones)
router.get('/count', phonesController.getNbPhones)
router.get('/marks', phonesController.getPhonesMarks)
router.get('/names', phonesController.getPhonesNames)
router.get('/:id', phonesController.getSinglePhone)

router.post('/add-Phone', authenticationMiddleware, phonesController.addPhone)

router.put('/:id', authenticationMiddleware, announce_owner_middleware, phonesController.updatePhone)
router.delete('/:id', authenticationMiddleware, announce_owner_middleware, phonesController.deletePhone)

module.exports = router