const router = require('express').Router()
const socialAccountsController = require('../../controllers/announcements/social_media_and_gaming_accounts')
const authenticationMiddleware = require('../../middlewares/auth') 
const { announce_owner_middleware } = require('../../middlewares/owner')

router.get('/', socialAccountsController.getAllSocialAccounts)
router.get('/:id', socialAccountsController.getSingleSocialAccount)

router.post('/add-Account', authenticationMiddleware, socialAccountsController.addSocialAccount)

router.put('/:id', authenticationMiddleware, announce_owner_middleware, socialAccountsController.updateSocialAccount)
router.delete('/:id', authenticationMiddleware, announce_owner_middleware, socialAccountsController.deleteSocialAccount)

module.exports = router