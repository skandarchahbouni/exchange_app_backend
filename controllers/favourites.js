const db = require("../config/db.config")
const getCurrentDate = require("../helpers/get_current_date")

const getAllFavourites = async (req, res, next) => {
    const { id_utilisateur } = req.user
    const query = "SELECT annonce FROM Favories WHERE utilisateur = ?"
    try {
        const [favourite_list] = await db.execute(query, [id_utilisateur])
        return res.status(200).json(favourite_list)
    } catch (error) {
        return next(error)
    }
}

const removeFromFavourites = async (req, res, next) => {
    const { id_utilisateur } = req.user
    const { annonce } = req.body
    const query = "DELETE FROM Favories WHERE utilisateur = ? and annonce = ?"
    try {
        await db.execute(query, [id_utilisateur, annonce])
        return res.status(200).json("removed succesfully")
    } catch (error) {
        return next(error)
    }
}

const addToFavourites = async (req, res, next) => {

    const { annonce } = req.body
    const current_date = getCurrentDate()
    const { id_utilisateur } = req.user

    const query = "INSERT INTO Favories(utilisateur, annonce, createdAt) VALUES (?,?,?)"

    try {
        const [{ insertId }] = await db.execute(query, [id_utilisateur, annonce, current_date])
        return res.status(201).json(insertId)
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getAllFavourites,
    removeFromFavourites,
    addToFavourites
}