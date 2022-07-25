const router = require('express').Router()
const userController = require('../controllers/users')

router.get('/', userController.getAllUsers)
router.get('/:id', userController.getSingleUser)

router.post('/signup', userController.signup)
router.post('/signin', userController.signin)

router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

module.exports = router