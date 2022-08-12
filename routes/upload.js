const db = require('../config/db.config')
const CustomAPIError = require('../errors/custom-error')
const authenticationMiddleware = require('../middlewares/auth')
const { announce_owner_middleware } = require('../middlewares/owner')
const upload = require('../middlewares/upload_files')
const router = require('express').Router()

const save_in_db = async (req, res, next) => {

    const { files } = req

    if (!files) return next(CustomAPIError.badRequest("No image were provided"))

    const { id } = req.params
    const values = []
    files.forEach( file => {
        const { filename } = file
        values.push(id, filename)
    });

    const arr = new Array(files.length).fill('(?, ?)')
    const query = `
        INSERT INTO Photos (annonce, lien_photo) VALUES ${arr}
    `

    try {
        await db.execute(query, values)
        return res.status(200).json("uploaded succesfully")
    } catch (error) {
        return next(error)
    }
}

router.post('/multiple/:id', authenticationMiddleware, announce_owner_middleware, upload.array('images', 4), save_in_db)

module.exports = router