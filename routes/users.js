const router = require('express').Router()
const userController = require('../controllers/users')
const authenticationMiddleware = require('../middlewares/auth')
const upload = require('../middlewares/upload_files')


// TODO : add the verify admin middlware  
router.get('/', userController.getAllUsers)

// -- for user 
router.get('/:id', userController.getSingleUser)

router.post('/auth/signup', userController.signup)
router.post('/auth/signin', userController.signin)
router.get("/auth/logout", userController.logout)

router.put('/', authenticationMiddleware, userController.updateUser)
router.delete('/', authenticationMiddleware, userController.deleteUser)

router.put('/upload-profile-picture', authenticationMiddleware, upload.single('image'), userController.uploadProfilePicture)

// for the admin (add a middlware verifyAdmin)
// router.put('/:id', verifyAdmin)
// router.delete('/:id', verifyAdmin)
// add a route to allow the admin to disconnect users from his dashboard 

module.exports = router