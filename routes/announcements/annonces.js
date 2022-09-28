const router = require('express').Router()
const announceController = require('../../controllers/announcements/annonces')
const authenticationMiddleware = require('../../middlewares/auth')

router.get('/count', authenticationMiddleware ,announceController.count)

module.exports = router