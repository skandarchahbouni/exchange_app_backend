const router = require('express').Router()
const phonesController = require('../../controllers/announcements/phones')

router.get('/', phonesController.getAllPhones)
router.get('/:id', phonesController.getSinglePhone)

router.post('/add-Phone', phonesController.addPhone)

router.put('/:id', phonesController.updatePhone)
router.delete('/:id', phonesController.deletePhone)

module.exports = router