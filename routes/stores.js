const router = require('express').Router()
const storesController = require('../controllers/stores')
// requests 
router.get("/", storesController.getAllStores)
router.get("/:id", storesController.getSingleStore)
router.put("/:id", storesController.updateStoreAccount)
router.delete("/:id", storesController.deleteStoreAccount)
router.post("/signup", storesController.create_store)
router.post("/signin", storesController.login_to_store)

module.exports = router