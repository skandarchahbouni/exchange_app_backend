const router = require('express').Router()
const socialAccountsController = require('../../controllers/announcements/social_media_and_gaming_accounts')

router.get('/', socialAccountsController.getAllSocialAccounts)
router.get('/:id', socialAccountsController.getSingleSocialAccount)

router.post('/add-Account', socialAccountsController.addSocialAccount)

router.put('/:id', socialAccountsController.updateSocialAccount)
router.delete('/:id', socialAccountsController.deleteSocialAccount)

module.exports = router